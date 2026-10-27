import { Link } from 'react-router-dom'

function SupportSection() {
  return (
    // TODO: Ugo's payment link and amounts go here — do not reuse Bayo's tiers
    <section className="support" id="support" data-reveal>
      <div className="support-row">
        <div className="support-text">
          <h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-heart"
              aria-hidden="true"
            >
              <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
            </svg>
            Support the work
          </h2>
          <p>If a class, a file or a guide here helped you, chip in whatever you like.</p>
          <p>Support options coming soon.</p>
        </div>

        <div className="support-actions" aria-label="Support with">
          <Link to="/support" className="support-chip">
            See support options
          </Link>
        </div>
      </div>
    </section>
  )
}

export default SupportSection
