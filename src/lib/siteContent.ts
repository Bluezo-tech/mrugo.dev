export type HeroContent = {
  headline: string
  highlight: string
  description: string
  bubble: string
  headlineSize: 'default' | 'large'
}

export const defaultHero: HeroContent = {
  headline: 'I build useful software',
  highlight: 'for real problems.',
  description: "I'm a software developer building practical web apps and digital tools that solve real problems.",
  bubble: "Hello, I'm Ugo.",
  headlineSize: 'default',
}

export async function getHeroContent(signal?: AbortSignal): Promise<HeroContent> {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return defaultHero
  const response = await fetch(`${url}/rest/v1/portfolio_sections?select=content,appearance&page=eq.home&section_key=eq.hero&limit=1`, {
    headers: { apikey: key }, signal,
  })
  if (!response.ok) return defaultHero
  const rows = await response.json()
  const row = rows?.[0]
  const content = row?.content ?? {}
  return {
    headline: typeof content.headline === 'string' ? content.headline : defaultHero.headline,
    highlight: typeof content.highlight === 'string' ? content.highlight : defaultHero.highlight,
    description: typeof content.description === 'string' ? content.description : defaultHero.description,
    bubble: typeof content.bubble === 'string' ? content.bubble : defaultHero.bubble,
    headlineSize: row?.appearance?.headline_size === 'large' ? 'large' : 'default',
  }
}
