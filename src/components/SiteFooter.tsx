import { Link } from 'react-router-dom'
import Monogram from './Monogram'

// Computed once at module load instead of during render (keeps the render pure).
const CURRENT_YEAR = new Date().getFullYear()

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function SiteFooter() {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  return (
    <footer className="site-footer">
      <div className="footer-inner" data-reveal>
        <Link className="footer-brand" to="/" aria-label="Mr Ugo — home">
          <Monogram variant="light" size={38} idSuffix="footer" />
          <span>Mr Ugo</span>
        </Link>

        <nav className="footer-nav" aria-label="Footer">
          <Link to="/#about">About</Link>
          <Link to="/#skills">Skills</Link>
          <Link to="/experience">Experience</Link>
          <Link to="/#contact">Contact</Link>
        </nav>

        <button type="button" className="back-to-top" onClick={handleBackToTop}>
          Back to top <span aria-hidden="true">↑</span>
        </button>
      </div>

      <p className="footer-note">
        © {CURRENT_YEAR} Ugochukwu. All rights reserved.
      </p>
    </footer>
  )
}

export default SiteFooter
