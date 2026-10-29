import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main>
      <section className="page-section" data-reveal>
        <div className="section-head">
          <p className="section-label">404</p>
          <h2>
            That page <span className="gold-text">isn't here</span>
          </h2>
          <p className="section-intro">
            The link may be old, or the address may have a typo. These two will
            get you back on track.
          </p>
        </div>

        <div className="notfound-actions">
          <Link className="contact-button" to="/">
            Back to home
          </Link>
          <Link className="hero-secondary-button" to="/projects">
            See projects
          </Link>
        </div>
      </section>
    </main>
  )
}

export default NotFound
