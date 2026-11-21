import type { ComponentType } from 'react'
import {
  BookOpenIcon,
  BriefcaseIcon,
  CodeIcon,
  CodeXmlIcon,
  FolderKanbanIcon,
  GraduationCapIcon,
  HandCoinsIcon,
  UserCheckIcon,
  MailIcon,
  ShareIcon,
  UserRoundIcon,
} from '../components/Icons'

export type NavItem = {
  label: string
  to: string
  Icon: ComponentType<{ className?: string }>
  /** Homepage section id for the scroll spy, or null (route / duplicate target). */
  spyId: string | null
}

/**
 * Single source of truth for BOTH the header and footer navigation, so the two
 * can never drift apart. Order matches the homepage section order:
 * About, Skills, Experience (page), Projects, Source Code, E-books, Classes,
 * Socials, Contact, Support — then the "Hire Me" action, which points at
 * /hire.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'About', to: '/about', Icon: UserRoundIcon, spyId: null },
  // { label: 'Skills', to: '/skills', Icon: CodeIcon, spyId: null },
  { label: 'Experience', to: '/experience', Icon: BriefcaseIcon, spyId: null },
  { label: 'Projects', to: '/projects', Icon: FolderKanbanIcon, spyId: null },
  // { label: 'Source Code', to: '/source-code', Icon: CodeXmlIcon, spyId: null },
  { label: 'E-books', to: '/ebooks', Icon: BookOpenIcon, spyId: null },
  { label: 'Classes', to: '/classes', Icon: GraduationCapIcon, spyId: null },
  // { label: 'Socials', to: '/socials', Icon: ShareIcon, spyId: null },
  { label: 'Contact', to: '/#contact', Icon: MailIcon, spyId: 'contact' },
  { label: 'Support', to: '/support', Icon: HandCoinsIcon, spyId: null },
  { label: 'Hire Me', to: '/hire', Icon: UserCheckIcon, spyId: null },
]

export const SPY_IDS = NAV_ITEMS.flatMap((item) => (item.spyId ? [item.spyId] : []))

/**
 * Icons for the nav items that are currently commented out above. Keeping them
 * referenced means the file still compiles with noUnusedLocals, and uncommenting
 * an item later only needs a copy from here — no import hunt.
 */
export const NAV_ICONS_ON_STANDBY = {
  Skills: CodeIcon,
  'Source Code': CodeXmlIcon,
  Classes: GraduationCapIcon,
  Socials: ShareIcon,
}
