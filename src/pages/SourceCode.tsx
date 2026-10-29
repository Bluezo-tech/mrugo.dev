import { SourceCodeCard } from '../components/ProductCards'

/**
 * Placeholder only. No package name, ZIP name, size or price is invented —
 * replace this object when Ugo supplies a real package.
 * TODO: Ugo's real package name, ZIP filename + size, tags and price.
 */
const COMING_SOON_SOURCE = {
  title: 'Source code coming soon',
  description:
    'Finished project code will be published here once the first one is documented. Nothing is downloadable yet.',
  zipName: 'Coming soon',
  priceLabel: 'Coming soon',
  buttonLabel: 'Coming soon',
}

function SourceCode() {
  return (
    <main>
      <section className="page-section" id="source-code" data-reveal>
        <div className="section-head">
          <p className="section-label">SOURCE CODE</p>
          <h2>
            Code drops, <span className="gold-text">coming soon</span>
          </h2>
          <p className="section-intro">
            Once a project is finished and documented, the full code will be
            shared here. Nothing is available to download yet.
          </p>
        </div>

        <div className="preview-grid">
          <SourceCodeCard item={COMING_SOON_SOURCE} />
        </div>
      </section>
    </main>
  )
}

export default SourceCode
