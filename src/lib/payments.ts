import { supabase } from './supabase'
import type { PaidReceipt } from './receipt'
import type { SupportCurrency } from '../utils/shop'

type StartPayment =
  | { kind: 'support'; amount: number; currency: SupportCurrency; email: string; name: string; website: string }
  | { kind: 'source' | 'ebook'; product_id: string; email: string; name: string; website: string }

async function paymentRequest<T>(action: string, body: object): Promise<T> {
  if (!supabase) throw new Error('Payments are not configured yet.')
  const { data, error } = await supabase.functions.invoke(`payments/${action}`, { body })
  if (error) {
    const response = (error as { context?: Response }).context
    if (response && typeof response.json === 'function') {
      try { const details = await response.json(); throw new Error(details.error || error.message) } catch (e) { if (e instanceof Error && e.message !== 'Unexpected end of JSON input') throw e }
    }
    throw new Error(error.message || 'Payment is unavailable. Please try again.')
  }
  return data as T
}

export async function startPayment(input: StartPayment) {
  const result = await paymentRequest<{ reference: string; access: string; checkout_url: string }>('initialize', input)
  if (!result.reference || !result.access || !result.checkout_url?.startsWith('https://checkout.paystack.com/')) throw new Error('Could not start checkout.')
  sessionStorage.setItem(`payment:${result.reference}`, result.access)
  window.location.assign(result.checkout_url)
}

export async function quoteDollarSupport(amount: number) {
  return paymentRequest<{ amount_ngn: number; rate_updated_at: string }>('quote', { amount })
}

export async function supportRegion(): Promise<string | null> {
  const result = await paymentRequest<{ country: string | null }>('region', {})
  return typeof result.country === 'string' && /^[A-Z]{2}$/.test(result.country) ? result.country : null
}

export async function paymentStatus(reference: string, access: string) {
  return paymentRequest<{ status: 'paid' | 'pending'; kind?: string; title?: string; name?: string;
    email?: string; amount_minor?: number; currency?: string; selected_usd_amount?: number | null; verified_at?: string; test?: boolean }>('status', { reference, access })
}

export function paidReceiptFromStatus(reference: string, result: Awaited<ReturnType<typeof paymentStatus>>): PaidReceipt | null {
  if (result.status !== 'paid' || !result.title || !result.email || !Number.isSafeInteger(result.amount_minor) ||
      !result.currency || !result.verified_at) return null
  return { reference, title: result.title, name: result.name || '', email: result.email,
    amount_minor: result.amount_minor!, currency: result.currency,
    selected_usd_amount: Number.isSafeInteger(result.selected_usd_amount) && (result.selected_usd_amount ?? 0) > 0 ? result.selected_usd_amount : null,
    verified_at: result.verified_at, test: !!result.test }
}

export async function paymentDownload(reference: string, access: string) {
  return paymentRequest<{ url: string }>('download', { reference, access })
}
