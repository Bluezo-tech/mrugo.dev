export type Social = {
  id: string
  label: string
  detail: string
  /** simpleicons slug — omit for the unnamed placeholder slots. */
  iconSlug?: string
  /** Hex used for the brand glyph. */
  iconColor?: string
  /** Background tint of the icon square. */
  tint?: string
  href?: string
  todo: boolean
}

/**
 * Only WhatsApp is a confirmed account (the link already existed in this
 * project). GitHub / X / LinkedIn remain unconfirmed placeholders.
 */
export const SOCIALS: Social[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    detail: 'Message me directly',
    iconSlug: 'whatsapp',
    iconColor: '25D366',
    tint: 'rgba(37, 211, 102, 0.14)',
    href: 'https://wa.me/2349042715057',
    todo: false,
  },
  {
    id: 'github',
    label: 'GitHub',
    detail: 'Profile link coming soon',
    iconSlug: 'github',
    iconColor: '9a9a9a',
    tint: 'rgba(31, 31, 31, 0.06)',
    todo: true,
  },
  {
    id: 'x',
    label: 'X',
    detail: 'Profile link coming soon',
    iconSlug: 'x',
    iconColor: '9a9a9a',
    tint: 'rgba(31, 31, 31, 0.06)',
    todo: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    detail: 'Profile link coming soon',
    tint: 'rgba(31, 31, 31, 0.06)',
    todo: true,
  },

]

/** Contact details that already existed in this project. */
export const CONTACT = {
  email: 'bluezotech@gmail.com',
  whatsapp: 'https://wa.me/2349042715057',
  /** Confirmed by Ugo on 27 October 2026. */
  replyTime: 'Replies within 24 hours',
}

/** The single honest project card — no fabricated projects. */
export const CURRENT_PROJECT_TODO = {
  title: 'Currently building',
  body:
    "I’m working on my first featured project. I’ll share it here when it’s ready.",
  todo: 'TODO: project name, one-line description, tech stack, live link',
}

export type Stat = {
  id: string
  value: string
  label: string
  todo: boolean
}

/** Bayo's layout is 3 stat cards. Values are HIS numbers — ours are TODO. */
export const STATS: Stat[] = [
  { id: 'years', value: 'TODO', label: 'Years experience', todo: true },
  { id: 'projects', value: 'TODO', label: 'Projects built', todo: true },
  { id: 'clients', value: 'TODO', label: 'Clients served', todo: true },
]
