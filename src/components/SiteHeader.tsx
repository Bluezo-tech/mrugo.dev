import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Monogram from './Monogram'
import { NAV_ITEMS, SPY_IDS } from '../data/navigation'
import { CloseIcon, MenuIcon } from './Icons'

function SiteHeader() {
  const { pathname } = useLocation()
  const [activeSection, setActiveSection] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

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

  // Escape closes the phone menu.
  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header className={menuOpen ? 'site-header is-menu-open' : 'site-header'}>
      <Link
        className="brand"
        to="/"
        aria-label="Mr Ugo — home"
        onClick={() => setMenuOpen(false)}
      >
        <Monogram variant="gold" size={32} idSuffix="header" />
        <span className="brand-text">Mr Ugo</span>
      </Link>

      {/* Desktop / tablet nav — labels above 1000px, icons between 769 and 1000 */}
      <nav className="main-nav" aria-label="Main navigation">
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

      {/* Phone menu button */}
      <button
        type="button"
        className="menu-toggle"
        aria-expanded={menuOpen}
        aria-controls="phone-menu"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? (
          <CloseIcon className="menu-toggle-icon" />
        ) : (
          <MenuIcon className="menu-toggle-icon" />
        )}
      </button>

      {/* Phone menu panel */}
      {menuOpen && (
        <div className="phone-menu" id="phone-menu">
          <nav aria-label="Phone menu">
            {NAV_ITEMS.map(({ label, to, Icon }) => (
              <Link
                key={label}
                to={to}
                className="phone-menu-link"
                onClick={() => setMenuOpen(false)}
              >
                <Icon className="phone-menu-icon" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <button
            type="button"
            className="phone-menu-close"
            onClick={() => setMenuOpen(false)}
          >
            <CloseIcon className="phone-menu-close-icon" />
            <span>Close menu</span>
          </button>
        </div>
      )}
    </header>
  )
}

export default SiteHeader
