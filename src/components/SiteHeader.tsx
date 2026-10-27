import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

/** The only sections in the main nav. Order matters. */
const SECTION_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
] as const

function SiteHeader() {
  const { pathname } = useLocation()
  const [activeSection, setActiveSection] = useState('')

  const onHome = pathname === '/'
  const onExperience = pathname === '/experience'
  const active = onHome ? activeSection : ''

  // Scroll spy: highlight the nav link for whichever section is under the
  // reading line. Pure enhancement — links work with or without it.
  useEffect(() => {
    if (!onHome) return

    const sections = SECTION_LINKS.map((link) =>
      document.getElementById(link.id),
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

    // Deferred so the first paint is not interrupted by a state update.
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
        Mr Ugo
      </Link>

      <nav aria-label="Main navigation">
        <Link
          to="/#about"
          className={active === 'about' ? 'is-active' : undefined}
          aria-current={active === 'about' ? 'location' : undefined}
        >
          About
        </Link>

        <Link
          to="/#skills"
          className={active === 'skills' ? 'is-active' : undefined}
          aria-current={active === 'skills' ? 'location' : undefined}
        >
          Skills
        </Link>

        <Link
          to="/experience"
          className={onExperience ? 'is-active' : undefined}
          aria-current={onExperience ? 'page' : undefined}
        >
          Experience
        </Link>

        <Link
          to="/#contact"
          className={active === 'contact' ? 'is-active' : undefined}
          aria-current={active === 'contact' ? 'location' : undefined}
        >
          Contact
        </Link>
      </nav>
    </header>
  )
}

export default SiteHeader
