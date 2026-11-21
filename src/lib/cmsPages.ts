import { supabase } from './supabase'

export const cmsPages = [
  ['/', 'Home'], ['/about', 'About'], ['/experience', 'Experience'],
  ['/experience/stem-lantern', 'STEM Lantern'], ['/experience/somtico-technologies', 'Somtico Technologies'],
  ['/experience/somtico-fashion-hub', 'Somtico Fashion Hub'], ['/experience/bluezo-tech', 'Bluezo Tech'],
  ['/bluezo-tech', 'Bluezo website'], ['/projects', 'Projects'], ['/source-code', 'Source Code'],
  ['/ebooks', 'E-books'], ['/classes', 'Classes'], ['/socials', 'Socials'], ['/hire', 'Hire Me'],
] as const

export type ManagedPage = { id: string; slug: string; title: string; published: boolean; deleted_at: string | null }

export async function loadHiddenPages(): Promise<string[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('portfolio_page_visibility').select('path').eq('hidden', true)
  if (error) throw error
  return (data ?? []).map((row) => row.path as string)
}

export async function loadManagedPages(): Promise<ManagedPage[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('portfolio_pages').select('id,slug,title,published,deleted_at').order('created_at')
  if (error) throw error
  return (data ?? []) as ManagedPage[]
}
