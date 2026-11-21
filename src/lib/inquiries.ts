export type InquirySubmission = {
  source: 'contact' | 'hire'
  name: string
  email: string
  subject: string
  message: string
  project_type?: string
  phone?: string
  whatsapp?: string
  preferred_contact?: string[]
  website?: string
}

export async function submitInquiry(payload: InquirySubmission) {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) throw new Error('The inbox is not configured yet.')
  const response = await fetch(`${url}/functions/v1/submit-inquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: key },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(typeof data.error === 'string' ? data.error : 'Could not send your message. Please try again.')
  }
}
