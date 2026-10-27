import { SOCIALS } from '../data/content'

function SocialsSection() {
  return (
    <section className="socials-section" id="socials" data-reveal>
      <div className="section-head">
        <p className="section-label">LET'S CONNECT</p>
        <h2>
          Find me <span className="gold-text">online</span>
        </h2>
        <p className="section-intro">
          Where you can reach me or follow the work. Only accounts I actually use
          appear as links.
        </p>
      </div>

      <div className="socials-grid">
        {SOCIALS.map((social) =>
          social.todo || !social.href ? (
            <div className="social-card is-todo" key={social.id}>
              <div className="social-card-text">
                <p className="social-name">{social.label}</p>
                <p className="social-detail">{social.detail}</p>
              </div>
              <span className="social-mark" aria-hidden="true">
                TODO
              </span>
            </div>
          ) : (
            <a
              className="social-card"
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="social-card-text">
                <p className="social-name">{social.label}</p>
                <p className="social-detail">{social.detail}</p>
              </div>
              <span className="social-mark" aria-hidden="true">
                ↗
              </span>
            </a>
          ),
        )}
      </div>
    </section>
  )
}

export default SocialsSection
