export type SiteDesign = {
  background: string
  surface: string
  heading: string
  body: string
  accent: string
  font: 'jakarta' | 'inter'
}

export const defaultSiteDesign: SiteDesign = {
  background: '#ffffff', surface: '#ffffff', heading: '#18191c', body: '#5b5d63',
  accent: '#7b1720', font: 'jakarta',
}

export function applySiteDesign(value: SiteDesign) {
  const root = document.documentElement
  const pairs: Record<string, string> = {
    '--bg': value.background, '--surface': value.surface,
    '--text-h': value.heading, '--card-title': value.heading, '--text': value.body,
    '--accent': value.accent, '--accent-from': value.accent, '--accent-mid': value.accent,
    '--accent-to': value.accent, '--gold-dark': value.accent, '--button-hover': value.accent,
  }
  for (const [name, color] of Object.entries(pairs)) {
    if (CSS.supports('color', color) && !/url\s*\(/i.test(color)) root.style.setProperty(name, color)
  }
  const font = value.font === 'inter' ? 'Inter, sans-serif' : '"Plus Jakarta Sans", Inter, sans-serif'
  root.style.setProperty('--sans', font)
  root.style.setProperty('--heading', font)
}
