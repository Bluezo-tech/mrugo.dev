import { useEffect, useState, type ComponentType } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Monogram from './Monogram'
import {
  BookIcon,
  BriefcaseIcon,
  CodeIcon,
  EnvelopeIcon,
  GraduationIcon,
  HeartIcon,
  LayersIcon,
  PersonIcon,
  TerminalIcon,
  UserCheckIcon,
} from './Icons'

type NavItem = {
  label: string
  to: string
  Icon: ComponentType<{ className?: string }>
  /** Homepage section id for the scroll spy, or null (route / duplicate target). */
  spyId: string | null
}

/**
 * Full navigation. Every item except Experience points at a homepage section —
 * the separate pages come later. "Hire Me" points at #contact for now and will
 * move to /hire once that page exists.
 */
const NAV_ITEMS: NavItem[] = [
  { label: 'About', to: '/#about', Icon: PersonIcon, spyId: 'about' },
  { label: 'Skills', to: '/#skills', Icon: CodeIcon, spyId: 'skills' },
  { label: 'Experience', to: '/experience', Icon: BriefcaseIcon, spyId: null },
  { label: 'Projects', to: '/#projects', Icon: LayersIcon, spyId: 'projects' },
  { label: 'Source Code', to: '/#source-code', Icon: TerminalIcon, spyId: 'source-code' },
  { label: 'Classes', to: '/#classes', Icon: GraduationIcon, spyId: 'classes' },
  { label: 'E-books', to: '/#ebooks', Icon: BookIcon, spyId: 'ebooks' },
  { label: 'Support', to: '/#support', Icon: HeartIcon, spyId: 'support' },
  { label: 'Hire Me', to: '/#contact', Icon: UserCheckIcon, spyId: null },
  { label: 'Contact', to: '/#contact', Icon: EnvelopeIcon, spyId: 'contact' },
]

const SPY_IDS = NAV_ITEMS.flatMap((item) => (item.spyId ? [item.spyId] : []))

function SiteHeader() {
  const { pathname } = useLocation()
  const [activeSection, setActiveSection] = useState('')

  const onHome = pathname === '/'
  const onExperience = pathname === '/experience'
  const active = onHome ? activeSection : ''

  // Scroll spy: highlight the nav item for whichever section is under the
  // reading line. Sections are sorted by page position, because the nav order
  // (Classes before E-books) differs from the page order.
  useEffect(() => {
    if (!onHome) return

    const sections = SPY_IDS.map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)
      .sort((a, b) => a.offsetTop - b.offsetTop)

    if (sections.length === 0) return

    const updateActive = () => {
      const readingLine = window.innerHeight * 0.4
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4

      if (atBottom) {
        setActiveSection(sections[sections.length - 1].id)
        return
      }

      let current = ''

      sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= readingLine) {
          current = section.id
        }
      })

      setActiveSection(current)
    }

    const frame = window.requestAnimationFrame(updateActive)

    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', updateActive)
    }
  }, [onHome])

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Mr Ugo — home">
        <Monogram variant="gold" size={32} idSuffix="header" />
        <span className="brand-text">Mr Ugo</span>
      </Link>

      <nav aria-label="Main navigation">
        {NAV_ITEMS.map(({ label, to, Icon, spyId }) => {
          const isExperience = label === 'Experience'
          const isActive = isExperience ? onExperience : active === spyId

          return (
            <Link
              key={label}
              to={to}
              className={isActive ? 'is-active' : undefined}
              aria-current={
                isActive ? (isExperience ? 'page' : 'location') : undefined
              }
              aria-label={label}
              title={label}
            >
              <Icon className="nav-icon" />
              <span className="nav-label">{label}</span>
            </Link>
          )
        })}
      </nav>
    </header>
  )
}

export default SiteHeader
