
import { Link } from 'react-router-dom'

function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Mr Ugo home">
        Mr Ugo
      </Link>

      <nav aria-label="Main navigation">
        <Link to="/source-code">Source Code</Link>
        <Link to="/classes">Classes</Link>
        <Link to="/ebooks">E-books</Link>
        <Link to="/experience">Experience</Link>
        <Link to="/#about">About</Link>
        <Link to="/#contact">Contact</Link>
        <Link to="/support">Support Me</Link>
        <Link to="/hire">Hire Me</Link>
      </nav>
    </header>
  )
}

export default SiteHeader
