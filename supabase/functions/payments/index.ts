import { createClient } from 'npm:@supabase/supabase-js@2.119.0'

const encoder = new TextEncoder()
const hex = (bytes: ArrayBuffer) => [...new Uint8Array(bytes)].map((n) => n.toString(16).padStart(2, '0')).join('')
const hash = async (value: string) => hex(await crypto.subtle.digest('SHA-256', encoder.encode(value)))

function originAllowed(origin: string | null) {
  if (!origin) return false
  try {
    const u = new URL(origin)
    if (u.protocol === 'http:' && /^517[3-9]$/.test(u.port) && (u.hostname === 'localhost' || u.hostname === '127.0.0.1' || /^192\.168\.\d{1,3}\.\d{1,3}$/.test(u.hostname) || /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(u.hostname) || /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(u.hostname))) return true
    return (Deno.env.get('PORTFOLIO_ORIGINS') ?? '').split(',').map((v) => v.trim()).includes(origin)
  } catch { return false }
}
function respond(status: number, body: object, origin: string | null) {
  return Response.json(body, { status, headers: {
    'Access-Control-Allow-Origin': origin && originAllowed(origin) ? origin : 'null',
    'Access-Control-Allow-Headers': 'content-type, apikey, authorization, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin',
    'Cache-Control': 'no-store',
  } })
}
function database() {
  const url = Deno.env.get('SUPABASE_URL')
  const keys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}')
  const key = keys.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  return url && key ? createClient(url, key, { auth: { persistSession: false } }) : null
}
const paystackKey = () => Deno.env.get('PAYSTACK_SECRET_KEY') ?? ''
let cachedUsdNgn: { rate: number; updated: number; expires: number } | null = null
async function usdNgnRate() {
  if (cachedUsdNgn && cachedUsdNgn.expires > Date.now()) return cachedUsdNgn
  const response = await fetch('https://open.er-api.com/v6/latest/USD')
  if (!response.ok) throw new Error('Exchange rate unavailable')
  const data = await response.json()
  const rate = Number(data.rates?.NGN)
  const updated = Number(data.time_last_update_unix)
  if (data.result !== 'success' || data.base_code !== 'USD' || !Number.isFinite(rate) || rate < 100 || rate > 10000 ||
      !Number.isSafeInteger(updated) || Date.now() / 1000 - updated > 172800 || updated > Date.now() / 1000 + 300) {
    throw new Error('Exchange rate unavailable')
  }
  cachedUsdNgn = { rate, updated, expires: Date.now() + 60 * 60 * 1000 }
  return cachedUsdNgn
}
function validSupportAmount(amount: unknown, currency: unknown) {
  return typeof amount === 'number' && Number.isSafeInteger(amount) &&
    ((currency === 'USD' && amount >= 2 && amount <= 3500) || (currency === 'NGN' && amount >= 500 && amount <= 5000000))
}
async function verifyAtPaystack(reference: string) {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${paystackKey()}` } })
  if (!response.ok) throw new Error('Paystack verification unavailable')
  const result = await response.json()
  return result.status === true ? result.data : null
}
async function settle(db: ReturnType<typeof database>, reference: string) {
  if (!db) throw new Error('Database unavailable')
  const { data: order, error } = await db.from('portfolio_payment_orders').select('*').eq('reference', reference).maybeSingle()
  if (error || !order) return { state: 'missing' }
  if (order.status === 'paid') return { state: 'paid', order }
  const payment = await verifyAtPaystack(reference)
  if (!payment || payment.status !== 'success') return { state: 'pending', order }
  // Never trust a callback, webhook payload, or amount supplied by the browser.
  if (payment.reference !== order.reference || payment.amount !== order.amount_minor || payment.currency !== order.currency ||
      String(payment.customer?.email ?? '').toLowerCase() !== order.buyer_email.toLowerCase()) {
    return { state: 'mismatch', order }
  }
  const verifiedAt = payment.paid_at || new Date().toISOString()
  const { error: receiptError } = await db.from('portfolio_receipts').upsert({
    provider: 'paystack', provider_reference: reference, item_title: order.item_title,
    buyer_email: order.buyer_email, buyer_name: order.buyer_name, amount_minor: order.amount_minor, currency: order.currency,
    status: 'paid', verified_at: verifiedAt, test_mode: order.test_mode,
  }, { onConflict: 'provider,provider_reference' })
  if (receiptError) throw receiptError
  const { error: updateError } = await db.from('portfolio_payment_orders').update({ status: 'paid', verified_at: verifiedAt }).eq('id', order.id).eq('status', 'pending')
  if (updateError) throw updateError
  return { state: 'paid', order: { ...order, verified_at: verifiedAt } }
}
async function checkSignature(raw: Uint8Array, header: string | null) {
  const signingSecret = Deno.env.get('PAYSTACK_WEBHOOK_SECRET')
  if (signingSecret && header?.includes('v1=')) {
    const parts = header.split(',').map((part) => part.trim())
    const t = parts.find((part) => part.startsWith('t='))?.slice(2) ?? ''
    if (!/^\d+$/.test(t) || Math.abs(Date.now() / 1000 - Number(t)) > 300) return false
    const signatures = parts.filter((part) => part.startsWith('v1=')).map((part) => part.slice(3).split(':').at(-1) ?? '')
    const prefix = encoder.encode(`${t}.`)
    const content = new Uint8Array(prefix.length + raw.length)
    content.set(prefix); content.set(raw, prefix.length)
    const key = await crypto.subtle.importKey('raw', encoder.encode(signingSecret), { name: 'HMAC', hash: 'SHA-512' }, false, ['sign'])
    const expected = hex(await crypto.subtle.sign('HMAC', key, content))
    return signatures.some((sig) => sig.length === expected.length && [...sig].reduce((diff, ch, i) => diff | (ch.charCodeAt(0) ^ expected.charCodeAt(i)), 0) === 0)
  }
  // Paystack's older signature header is HMAC-SHA512 over the raw body.
  const legacy = Deno.env.get('PAYSTACK_SECRET_KEY')
  const oldHeader = header ?? ''
  if (!legacy || !/^[0-9a-f]{128}$/i.test(oldHeader)) return false
  const key = await crypto.subtle.importKey('raw', encoder.encode(legacy), { name: 'HMAC', hash: 'SHA-512' }, false, ['sign'])
  const expected = hex(await crypto.subtle.sign('HMAC', key, raw))
  return [...oldHeader.toLowerCase()].reduce((diff, ch, i) => diff | (ch.charCodeAt(0) ^ expected.charCodeAt(i)), 0) === 0
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  const path = new URL(req.url).pathname.split('/').at(-1)
  if (path === 'webhook') {
    if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })
    const raw = new Uint8Array(await req.arrayBuffer())
    if (raw.length > 50000 || !await checkSignature(raw, req.headers.get('paystack-signature') || req.headers.get('x-paystack-signature'))) return new Response('Unauthorized', { status: 401 })
    let event: { event?: string; data?: { reference?: string } }
    try { event = JSON.parse(new TextDecoder().decode(raw)) } catch { return new Response('Invalid body', { status: 400 }) }
    if (event.event === 'charge.success' && typeof event.data?.reference === 'string') {
      try {
        const result = await settle(database(), event.data.reference)
        if (result.state === 'mismatch') return new Response('Payment mismatch', { status: 400 })
      } catch { return new Response('Retry later', { status: 503 }) }
    }
    return new Response('OK')
  }
  if (!originAllowed(origin)) return respond(403, { error: 'Origin not allowed.' }, origin)
  if (req.method === 'OPTIONS') return respond(200, { ok: true }, origin)
  if (req.method !== 'POST') return respond(405, { error: 'Method not allowed.' }, origin)
  const visitorCountry = req.headers.get('cf-ipcountry')
  if (path === 'region') return respond(200, { country: visitorCountry && /^[A-Z]{2}$/.test(visitorCountry) ? visitorCountry : null }, origin)
  const db = database()
  if (!db || !paystackKey()) return respond(503, { error: 'Payments are not ready yet.' }, origin)
  const raw = await req.text()
  if (raw.length > 10000) return respond(413, { error: 'Request too large.' }, origin)
  let input: Record<string, unknown>
  try { input = JSON.parse(raw) } catch { return respond(400, { error: 'Invalid request.' }, origin) }
  if (path === 'quote') {
    if (!validSupportAmount(input.amount, 'USD')) return respond(400, { error: 'Choose a valid dollar amount.' }, origin)
    try {
      const rate = await usdNgnRate()
      const amountNgn = Math.round((input.amount as number) * rate.rate)
      if (amountNgn > 5000000) return respond(400, { error: 'Choose a smaller amount.' }, origin)
      return respond(200, { amount_ngn: amountNgn, rate_updated_at: new Date(rate.updated * 1000).toISOString() }, origin)
    } catch { return respond(503, { error: 'Dollar estimates are temporarily unavailable. Try naira instead.' }, origin) }
  }
  if (path === 'initialize') {
    const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : ''
    const name = typeof input.name === 'string' ? input.name.trim() : ''
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320 || name.length > 160) return respond(400, { error: 'Check your email and name.' }, origin)
    if (typeof input.website === 'string' && input.website.trim()) return respond(400, { error: 'Invalid request.' }, origin)
    let kind: 'support' | 'source' | 'ebook'
    let amountMinor: number
    let currency: string
    let title: string
    let productId: string | null = null
    let selectedUsdAmount: number | null = null
    if (input.kind === 'support') {
      kind = 'support'; currency = input.currency === 'USD' ? 'USD' : input.currency === 'NGN' ? 'NGN' : ''
      if (!validSupportAmount(input.amount, currency)) return respond(400, { error: 'Choose a valid support amount.' }, origin)
      const amount = input.amount as number
      amountMinor = amount * 100
      title = 'Support Mr Ugo'
    } else if (input.kind === 'source' || input.kind === 'ebook') {
      kind = input.kind
      if (typeof input.product_id !== 'string' || !/^[0-9a-f-]{36}$/i.test(input.product_id)) return respond(400, { error: 'Invalid product.' }, origin)
      const { data: product } = await db.from('portfolio_products').select('id,kind,title,price_minor,currency,published').eq('id', input.product_id).maybeSingle()
      if (!product || !product.published || product.kind !== kind || product.price_minor <= 0 || !Number.isSafeInteger(product.price_minor)) return respond(400, { error: 'This item is not available for checkout.' }, origin)
      const { data: file } = await db.from('portfolio_product_files').select('product_id').eq('product_id', product.id).maybeSingle()
      if (!file) return respond(400, { error: 'This item is not ready for download yet.' }, origin)
      productId = product.id; title = product.title; amountMinor = product.price_minor; currency = product.currency
    } else return respond(400, { error: 'Invalid checkout type.' }, origin)
    if (!['NGN', 'USD'].includes(currency)) return respond(400, { error: 'This currency is unavailable.' }, origin)
    const visitor = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || email
    const visitorHash = await hash(`${paystackKey()}:${visitor}`)
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { count, error: limitError } = await db.from('portfolio_payment_attempts').select('id', { count: 'exact', head: true }).eq('visitor_hash', visitorHash).gte('created_at', since)
    if (limitError) return respond(503, { error: 'Checkout is temporarily unavailable.' }, origin)
    if ((count ?? 0) >= 10) return respond(429, { error: 'Too many checkout attempts. Please try again later.' }, origin)
    const { error: attemptError } = await db.from('portfolio_payment_attempts').insert({ visitor_hash: visitorHash })
    if (attemptError) return respond(503, { error: 'Checkout is temporarily unavailable.' }, origin)
    // Keep the Paystack reference compact while retaining 80 bits of randomness.
    const reference = `ugo-${[...crypto.getRandomValues(new Uint8Array(10))].map((byte) => byte.toString(16).padStart(2, '0')).join('')}`
    const access = crypto.randomUUID().replaceAll('-', '') + crypto.randomUUID().replaceAll('-', '')
    const { error } = await db.from('portfolio_payment_orders').insert({ reference, access_hash: await hash(access), kind, product_id: productId, item_title: title, buyer_email: email, buyer_name: name, amount_minor: amountMinor, currency, selected_usd_amount: selectedUsdAmount, test_mode: paystackKey().startsWith('sk_test_') })
    if (error) return respond(503, { error: 'Could not start checkout.' }, origin)
    const callback = `${origin}/payment/return`
    let payment: { status?: boolean; data?: { authorization_url?: string; reference?: string }; message?: string }
    try {
      const channels = kind === 'support' ? (currency === 'NGN' ? ['card', 'bank_transfer', 'apple_pay'] : ['card', 'apple_pay']) : undefined
      const res = await fetch('https://api.paystack.co/transaction/initialize', { method: 'POST', headers: { Authorization: `Bearer ${paystackKey()}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ email, amount: amountMinor, currency, channels, reference, callback_url: callback, metadata: { order_id: reference, kind } }) })
      payment = await res.json()
    } catch { return respond(503, { error: 'Payment provider is unavailable. Please try again.' }, origin) }
    const checkoutUrl = payment.data?.authorization_url
    if (!payment.status || payment.data?.reference !== reference || !checkoutUrl || !checkoutUrl.startsWith('https://checkout.paystack.com/')) return respond(503, { error: payment.message || 'Could not start checkout.' }, origin)
    return respond(200, { reference, access, checkout_url: checkoutUrl }, origin)
  }
  if (path === 'status') {
    const reference = input.reference
    const access = input.access
    if (typeof reference !== 'string' || !/^(?:ugo_[a-z0-9_]{20,80}|ugo-[0-9a-f]{20})$/.test(reference) || typeof access !== 'string' || access.length !== 64) return respond(400, { error: 'Invalid order.' }, origin)
    const { data: order } = await db.from('portfolio_payment_orders').select('access_hash').eq('reference', reference).maybeSingle()
    if (!order || order.access_hash !== await hash(access)) return respond(404, { error: 'Order not found.' }, origin)
    try {
      const result = await settle(db, reference)
      if (result.state !== 'paid') return respond(200, { status: result.state === 'mismatch' ? 'pending' : result.state }, origin)
      const paidOrder = result.order
      return respond(200, { status: 'paid', kind: paidOrder?.kind, title: paidOrder?.item_title,
        name: paidOrder?.buyer_name, email: paidOrder?.buyer_email, amount_minor: paidOrder?.amount_minor,
        currency: paidOrder?.currency, selected_usd_amount: paidOrder?.selected_usd_amount, verified_at: paidOrder?.verified_at,
        test: paidOrder?.test_mode }, origin)
    } catch { return respond(503, { error: 'Verification is temporarily unavailable.' }, origin) }
  }
  if (path === 'download') {
    const reference = input.reference
    const access = input.access
    if (typeof reference !== 'string' || typeof access !== 'string' || access.length !== 64) return respond(400, { error: 'Invalid order.' }, origin)
    const { data: order } = await db.from('portfolio_payment_orders').select('access_hash,kind,product_id,status').eq('reference', reference).maybeSingle()
    if (!order || order.access_hash !== await hash(access) || order.status !== 'paid' || !order.product_id || order.kind === 'support') return respond(403, { error: 'Download unavailable.' }, origin)
    const { data: file } = await db.from('portfolio_product_files').select('object_path').eq('product_id', order.product_id).maybeSingle()
    if (!file) return respond(404, { error: 'The file is not ready yet. Contact us with your payment reference.' }, origin)
    const { data, error } = await db.storage.from('portfolio-products').createSignedUrl(file.object_path, 60)
    if (error || !data?.signedUrl) return respond(503, { error: 'Download unavailable. Please try again.' }, origin)
    return respond(200, { url: data.signedUrl }, origin)
  }
  return respond(404, { error: 'Not found.' }, origin)
})
