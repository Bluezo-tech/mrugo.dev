import { HeartIcon } from './Icons'

function SupportSection() {
  return (
    <section className="support-section" id="support" data-reveal>
      <div className="support-panel">
        <div className="section-head">
          <p className="section-label">SUPPORT</p>
          <h2>
            Support <span className="gold-text">the work</span>
          </h2>
          <p className="section-intro">
            If something on this site has been useful to you, there will be a way
            to support the work here soon.
          </p>
        </div>

        <p className="support-placeholder">
          <HeartIcon className="support-icon" />
          <span>Support options coming soon</span>
        </p>

        <p className="todo-note">
          TODO: add a payment or support link when there is one
        </p>
      </div>
    </section>
  )
}

export default SupportSection
