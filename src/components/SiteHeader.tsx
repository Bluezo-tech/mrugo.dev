import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Monogram from './Monogram'
import { NAV_ITEMS, SPY_IDS } from '../data/navigation'

function SiteHeader() {
  const { pathname } = useLocation()
  const [activeSection, setActiveSection] = useState('')

  const onHome = pathname === '/'
  const onExperience = pathname === '/experience'
  const active = onHome ? activeSection : ''

  // Scroll spy: highlight the nav item for whichever section is under the
  // reading line. Sections are sorted by page position, because the nav order
  // and the page order are not identical.
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
