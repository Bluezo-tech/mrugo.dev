/**
 * Home page content that is NOT yet confirmed by Ugo.
 *
 * Rule for this file: nothing here may be invented. If a real fact is missing,
 * the entry is marked todo: true and renders as a visible TODO placeholder.
 * When Ugo supplies the real value, replace the string and set todo: false.
 */

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

export type Social = {
  id: string
  label: string
  detail: string
  href?: string
  todo: boolean
}

/**
 * Only WhatsApp is confirmed — the link already existed in this project's
 * footer. Everything else has no verified account, so it stays a TODO.
 */
export const SOCIALS: Social[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    detail: 'Message me directly',
    href: 'https://wa.me/2349042715057',
    todo: false,
  },
  {
    id: 'github',
    label: 'GitHub',
    detail: 'TODO: add your profile URL',
    todo: true,
  },
  {
    id: 'x',
    label: 'X',
    detail: 'TODO: add your profile URL',
    todo: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    detail: 'TODO: add your profile URL',
    todo: true,
  },
]

/** Contact details that already existed in this project. */
export const CONTACT = {
  email: 'bluezotech@gmail.com',
  whatsapp: 'https://wa.me/2349042715057',
}

/** The single honest project card — no fabricated projects. */
export const CURRENT_PROJECT_TODO = {
  title: 'Currently building',
  body:
    'A project is in progress right now. The details, stack and link will appear here once it is ready to show.',
  todo: 'TODO: project name, one-line description, tech stack, live link',
}
