import { createClient } from 'npm:@supabase/supabase-js@2.119.0'

const allowedReplyMethods = new Set(['Email', 'WhatsApp', 'Phone call'])
const encoder = new TextEncoder()

async function notifyWhatsApp(details: { source: string; name: string; email: string; subject: string; message: string }, inquiryId: string) {
  const token = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
  const senderId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')
  const recipient = Deno.env.get('WHATSAPP_ALERT_RECIPIENT')
  const templateName = Deno.env.get('WHATSAPP_INQUIRY_TEMPLATE')
  if (!token || !senderId || !recipient || !templateName) return
  // The approved template needs four body variables: source, sender, reply address, and summary.
  const parameters = [
    details.source === 'hire' ? 'Hire Me' : 'Contact',
    details.name.slice(0, 80),
    details.email.slice(0, 160),
    `${details.subject}: ${details.message}`.slice(0, 350),
  ].map((text) => ({ type: 'text', text }))
  try {
    const response = await fetch(`https://graph.facebook.com/v27.0/${encodeURIComponent(senderId)}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messaging_product: 'whatsapp', to: recipient, type: 'template',
        template: { name: templateName, language: { code: Deno.env.get('WHATSAPP_TEMPLATE_LANGUAGE') || 'en_US' },
          components: [{ type: 'body', parameters }] },
      }),
      signal: AbortSignal.timeout(6000),
    })
    if (!response.ok) console.error(`WhatsApp notification failed for inquiry ${inquiryId}: HTTP ${response.status}`)
  } catch { console.error(`WhatsApp notification failed for inquiry ${inquiryId}`) }
}

function allowedOrigin(origin: string | null) {
  if (!origin) return true // Allows server-side tests; browser calls still use CORS.
  try {
    const url = new URL(origin)
    if (url.protocol === 'http:' && url.port === '5173') {
      return url.hostname === 'localhost' || url.hostname === '127.0.0.1' ||
        /^192\.168\.\d{1,3}\.\d{1,3}$/.test(url.hostname) ||
        /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(url.hostname) ||
        /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(url.hostname)
    }
    return (Deno.env.get('PORTFOLIO_ORIGINS') ?? '').split(',').map((item) => item.trim()).includes(origin)
  } catch { return false }
}

function reply(status: number, data: object, origin: string | null) {
  return Response.json(data, { status, headers: {
    'Access-Control-Allow-Origin': origin && allowedOrigin(origin) ? origin : 'null',
    'Access-Control-Allow-Headers': 'content-type, apikey, authorization, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  } })
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin')
  if (!allowedOrigin(origin)) return reply(403, { error: 'Origin not allowed.' }, origin)
  if (req.method === 'OPTIONS') return reply(200, { ok: true }, origin)
  if (req.method !== 'POST') return reply(405, { error: 'Method not allowed.' }, origin)

  const content = await req.text()
  if (content.length > 20000) return reply(413, { error: 'Request too large.' }, origin)
  let form: Record<string, unknown>
  try { form = JSON.parse(content) } catch { return reply(400, { error: 'Invalid request.' }, origin) }
  if (!form || typeof form !== 'object' || Array.isArray(form)) return reply(400, { error: 'Invalid request.' }, origin)

  // Quietly accept bot-filled forms without storing them.
  if (typeof form.website === 'string' && form.website.trim()) return reply(200, { ok: true }, origin)

  const source = typeof form.source === 'string' ? form.source : ''
  const name = typeof form.name === 'string' ? form.name.trim() : ''
  const email = typeof form.email === 'string' ? form.email.trim().toLowerCase() : ''
  const message = typeof form.message === 'string' ? form.message.trim() : ''
  const subject = typeof form.subject === 'string' ? form.subject.trim() : ''
  const projectType = typeof form.project_type === 'string' ? form.project_type.trim() : ''
  const phone = typeof form.phone === 'string' ? form.phone.trim() : ''
  const whatsapp = typeof form.whatsapp === 'string' ? form.whatsapp.trim() : ''
  const methods = Array.isArray(form.preferred_contact) ? form.preferred_contact : []

  if ((source !== 'contact' && source !== 'hire') || name.length < 1 || name.length > 160 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320 ||
    message.length < 1 || message.length > 5000 || subject.length > 200 ||
    projectType.length > 120 || phone.length > 40 || whatsapp.length > 40 ||
    methods.length > 3 || methods.some((method) => !allowedReplyMethods.has(method)) ||
    (source === 'hire' && !projectType)) {
    return reply(400, { error: 'Please check the form and try again.' }, origin)
  }

  const url = Deno.env.get('SUPABASE_URL')
  const keys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}')
  const secret = keys.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !secret) return reply(503, { error: 'The inbox is temporarily unavailable.' }, origin)
  const db = createClient(url, secret, { auth: { persistSession: false } })

  const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim() || email
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(`${secret}:${ip}`))
  const visitorHash = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
  const windowStart = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count, error: countError } = await db.from('portfolio_submission_attempts')
    .select('id', { count: 'exact', head: true }).eq('visitor_hash', visitorHash).gte('created_at', windowStart)
  if (countError) return reply(503, { error: 'The inbox is temporarily unavailable.' }, origin)
  if ((count ?? 0) >= 5) return reply(429, { error: 'Too many requests. Please try again later.' }, origin)
  const { error: attemptError } = await db.from('portfolio_submission_attempts').insert({ visitor_hash: visitorHash })
  if (attemptError) return reply(503, { error: 'The inbox is temporarily unavailable.' }, origin)

  const { data: saved, error } = await db.from('portfolio_inquiries').insert({
    source, name, email, subject, message, project_type: projectType || null,
    phone: phone || null, whatsapp: whatsapp || null, preferred_contact: methods,
  }).select('id').single()
  if (error || !saved) return reply(503, { error: 'Could not save your message. Please try again.' }, origin)
  // Saving the enquiry is the source of truth. A notification failure must not lose it.
  await notifyWhatsApp({ source, name, email, subject: subject || projectType, message }, saved.id)
  return reply(200, { ok: true }, origin)
})
