import type { ComponentType } from 'react'
import {
  BookIcon,
  BriefcaseIcon,
  CodeIcon,
  EnvelopeIcon,
  GraduationIcon,
  HeartIcon,
  LayersIcon,
  PersonIcon,
  ShareIcon,
  TerminalIcon,
  UserCheckIcon,
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
 * #contact for now and will move to /hire once that page exists.
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'About', to: '/#about', Icon: PersonIcon, spyId: 'about' },
  { label: 'Skills', to: '/#skills', Icon: CodeIcon, spyId: 'skills' },
  { label: 'Experience', to: '/experience', Icon: BriefcaseIcon, spyId: null },
  { label: 'Projects', to: '/#projects', Icon: LayersIcon, spyId: 'projects' },
  { label: 'Source Code', to: '/#source-code', Icon: TerminalIcon, spyId: 'source-code' },
  { label: 'E-books', to: '/#ebooks', Icon: BookIcon, spyId: 'ebooks' },
  { label: 'Classes', to: '/#classes', Icon: GraduationIcon, spyId: 'classes' },
  { label: 'Socials', to: '/#socials', Icon: ShareIcon, spyId: 'socials' },
  { label: 'Contact', to: '/#contact', Icon: EnvelopeIcon, spyId: 'contact' },
  { label: 'Support', to: '/#support', Icon: HeartIcon, spyId: 'support' },
  { label: 'Hire Me', to: '/#contact', Icon: UserCheckIcon, spyId: null },
]

export const SPY_IDS = NAV_ITEMS.flatMap((item) => (item.spyId ? [item.spyId] : []))
