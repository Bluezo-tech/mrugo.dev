import { useEffect, useState, type ComponentType } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Monogram from './Monogram'
import { BriefcaseIcon, CodeIcon, EnvelopeIcon, PersonIcon } from './Icons'

type NavItem = {
  label: string
  to: string
  Icon: ComponentType<{ className?: string }>
  /** Section id used by the scroll spy, or null for the standalone page. */
  spyId: string | null
}

const NAV_ITEMS: NavItem[] = [
  { label: 'About', to: '/#about', Icon: PersonIcon, spyId: 'about' },
  { label: 'Skills', to: '/#skills', Icon: CodeIcon, spyId: 'skills' },
  { label: 'Experience', to: '/experience', Icon: BriefcaseIcon, spyId: null },
  { label: 'Contact', to: '/#contact', Icon: EnvelopeIcon, spyId: 'contact' },
]

const SPY_SECTIONS = NAV_ITEMS.flatMap((item) =>
  item.spyId ? [{ id: item.spyId, label: item.label }] : [],
)

function SiteHeader() {
  const { pathname } = useLocation()
  const [activeSection, setActiveSection] = useState('')

  const onHome = pathname === '/'
  const onExperience = pathname === '/experience'
  const active = onHome ? activeSection : ''

  // Scroll spy: highlight the nav item for whichever section is under the
  // reading line. Pure enhancement — links work with or without it.
  useEffect(() => {
    if (!onHome) return

    const sections = SPY_SECTIONS.map((section) =>
      document.getElementById(section.id),
    ).filter((element): element is HTMLElement => element !== null)

    if (sections.length === 0) return

    const updateActive = () => {
      const readingLine = window.innerHeight * 0.4
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4

      if (atBottom) {
        setActiveSection('contact')
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
        <span>Mr Ugo</span>
      </Link>

      <nav aria-label="Main navigation">
        {NAV_ITEMS.map(({ label, to, Icon, spyId }) => {
          const isExperience = spyId === null
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
