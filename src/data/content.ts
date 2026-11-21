import { SKILLS } from './skills'

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
 * These links were supplied by Ugo.
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
    detail: 'Explore Bluezo Tech code',
    iconSlug: 'github',
    iconColor: '181717',
    tint: 'rgba(31, 31, 31, 0.06)',
    href: 'https://github.com/Bluezo-tech',
    todo: false,
  },
  {
    id: 'x',
    label: 'X',
    detail: 'Follow Bluezo Tech',
    iconSlug: 'x',
    iconColor: '000000',
    tint: 'rgba(31, 31, 31, 0.06)',
    href: 'https://x.com/bluezo_tech',
    todo: false,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    detail: 'Connect with Ugochukwu',
    iconColor: '0A66C2',
    tint: 'rgba(10, 102, 194, 0.12)',
    href: 'https://www.linkedin.com/in/ugochukwu-chukwuekem/',
    todo: false,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    detail: 'Watch Bluezo Tech',
    iconSlug: 'tiktok',
    iconColor: '000000',
    tint: 'rgba(31, 31, 31, 0.06)',
    href: 'https://www.tiktok.com/@bluezotech',
    todo: false,
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
  id: 'skills' | 'roles'
  value: number
  suffix?: string
  label: string
}

/** Confirmed skills and organizations, without a years-of-experience claim. */
export const STATS: Stat[] = [
  { id: 'skills', value: SKILLS.length, label: 'Skills and tools' },
  { id: 'roles', value: 4, label: 'Organizations I work with' },
]

