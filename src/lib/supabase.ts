import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = url && key ? createClient(url, key) : null

export type Inquiry = {
  id: string
  created_at: string
  source: 'contact' | 'hire'
  name: string
  email: string
  subject: string
  message: string
  project_type: string | null
  phone: string | null
  whatsapp: string | null
  preferred_contact: string[]
  status: 'new' | 'read' | 'archived'
}
