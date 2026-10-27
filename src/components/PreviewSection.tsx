import type { ComponentType } from 'react'

type PreviewCard = {
  title: string
  note: string
}

type PreviewSectionProps = {
  id: string
  eyebrow: string
  headingBefore: string
  headingGold: string
  subline: string
  cards: PreviewCard[]
  Icon: ComponentType<{ className?: string }>
}

/**
 * Shared "coming soon" preview section, used by Source Code and E-books.
 * Nothing is for sale and no product is described — each card is a marked TODO.
 */
function PreviewSection({
  id,
  eyebrow,
  headingBefore,
  headingGold,
  subline,
  cards,
  Icon,
}: PreviewSectionProps) {
  return (
    <section className="preview-section" id={id} data-reveal>
      <div className="section-head">
        <p className="section-label">{eyebrow}</p>
        <h2>
          {headingBefore} <span className="gold-text">{headingGold}</span>
        </h2>
        <p className="section-intro">{subline}</p>
      </div>

      <div className="preview-grid">
        {cards.map((card) => (
          <article className="preview-card" key={card.title}>
            <span className="preview-icon" aria-hidden="true">
              <Icon className="preview-glyph" />
            </span>
            <p className="preview-chip">Coming soon</p>
            <h3>{card.title}</h3>
            <p className="preview-note">{card.note}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PreviewSection
