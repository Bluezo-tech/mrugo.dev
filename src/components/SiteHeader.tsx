import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Monogram from './Monogram'
import { NAV_ITEMS, SPY_IDS } from '../data/navigation'
import { CloseIcon, MenuIcon } from './Icons'
import SupportModal from './SupportModal'
import { loadHiddenPages } from '../lib/cmsPages'

function SiteHeader() {
  const { pathname } = useLocation()
  const [activeSection, setActiveSection] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [hiddenPages, setHiddenPages] = useState<string[]>([])

  useEffect(() => { void loadHiddenPages().then(setHiddenPages).catch(() => {}) }, [pathname])

  useEffect(() => {
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.style.colorScheme = 'light'
    window.localStorage.removeItem('ugo-theme')
  }, [])

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
    <>
    <header className={menuOpen ? 'site-header is-menu-open' : 'site-header'}>
      <div className="site-header-inner">
      <Link
        className="brand"
        to="/"
        aria-label="Mr Ugo — home"
        onClick={() => setMenuOpen(false)}
      >
        <Monogram variant="gold" size={32} idSuffix="header" />
        <span className="brand-text">Mr Ugo</span>
      </Link>

      {/* Bayo-style nav: one nav element, inline on desktop,
          dropdown panel below 1000px when the header is open */}
      <nav className="nav-links" id="site-menu" aria-label="Main navigation">
        {NAV_ITEMS.filter(({ to }) => !hiddenPages.includes(to)).map(({ label, to, Icon, spyId }) => {
          const isExperience = label === 'Experience'
          const isActive =
            pathname === to ||
            (isExperience ? onExperience : active === spyId)

          if (to === '/support') {
            return <button key={label} type="button" className="nav-support" aria-haspopup="dialog" onClick={() => { setMenuOpen(false); setSupportOpen(true) }}>
              <Icon className="nav-icon" />
              <span className="nav-label">{label}</span>
            </button>
          }

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
              onClick={(event) => {
                setMenuOpen(false)
                // React Router sees the same URL on a repeated hash click, so
                // the layout's hash effect will not run again.
                if (to === '/#contact' && pathname === '/' && window.location.hash === '#contact') {
                  event.preventDefault()
                  window.requestAnimationFrame(() => {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'instant', block: 'start' })
                  })
                }
              }}
            >
              <Icon className="nav-icon" />
              <span className="nav-label">{label}</span>
            </Link>
          )
        })}
      </nav>


      {/* Menu button — visible below 1000px only, via CSS */}
      <button
        type="button"
        className="menu-toggle"
        aria-expanded={menuOpen}
        aria-controls="site-menu"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? (
          <CloseIcon className="menu-toggle-icon" />
        ) : (
          <MenuIcon className="menu-toggle-icon" />
        )}
      </button>
      </div>
    </header>
    {supportOpen && <SupportModal onClose={() => setSupportOpen(false)} />}
    </>
  )
}

export default SiteHeader
