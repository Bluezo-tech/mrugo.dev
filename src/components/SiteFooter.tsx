import { Link } from 'react-router-dom'

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
    <footer id="contact">
      <div data-reveal>
        <p className="section-label">HAVE A PROJECT IN MIND?</p>
        <h2>Let's connect.</h2>
        <p className="footer-description">
          Have an idea, a project, or an opportunity to discuss? I'd love to
          hear from you.
        </p>

        <div className="footer-links">
          <a href="mailto:bluezotech@gmail.com">
            Get in touch via email <span aria-hidden="true">↗</span>
          </a>
          <a
            href="https://wa.me/2349042715057"
            target="_blank"
            rel="noopener noreferrer"
          >
            Message Bluezo Tech on WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </div>

        <nav className="footer-nav" aria-label="Footer">
          <Link to="/#about">About</Link>
          <Link to="/#skills">Skills</Link>
          <Link to="/experience">Experience</Link>
          <Link to="/#contact">Contact</Link>
        </nav>
      </div>

      <p className="footer-note">© {CURRENT_YEAR} Ugochukwu</p>

      <button type="button" className="back-to-top" onClick={handleBackToTop}>
        Back to top <span aria-hidden="true">↑</span>
      </button>
    </footer>
  )
}

export default SiteFooter
