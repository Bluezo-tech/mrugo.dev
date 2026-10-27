import { Link } from 'react-router-dom'
import Monogram from './Monogram'

// Computed once at module load instead of during render (keeps the render pure).
const CURRENT_YEAR = new Date().getFullYear()

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-bar">
        <Link className="footer-brand" to="/" aria-label="Mr Ugo — home">
          <Monogram variant="white" size={32} idSuffix="footer" />
          <span>Mr Ugo</span>
        </Link>

        <p className="footer-copy">
          © {CURRENT_YEAR} Ugochukwu. All rights reserved.
        </p>

        <nav className="footer-nav" aria-label="Footer">
          <Link to="/#about">About</Link>
          <Link to="/#skills">Skills</Link>
          <Link to="/experience">Experience</Link>
          <Link to="/#contact">Contact</Link>
        </nav>
      </div>
    </footer>
  )
}

export default SiteFooter
