import { EbookCard } from '../components/ProductCards'

/**
 * Placeholder only. No title, author, reader count or price is invented —
 * replace this object when Ugo supplies a real e-book.
 * TODO: Ugo's real title, format and price.
 */
const COMING_SOON_EBOOK = {
  title: 'E-book coming soon',
  priceLabel: 'Coming soon',
  buttonLabel: 'Coming soon',
}

function Ebooks() {
  return (
    <main>
      <section className="page-section" id="ebooks" data-reveal>
        <div className="section-head">
          <p className="section-label">E-BOOKS</p>
          <h2>
            Guides, <span className="gold-text">coming soon</span>
          </h2>
          <p className="section-intro">
            Practical write-ups from the things I build. No books are published
            yet.
          </p>
        </div>

        <div className="preview-grid">
          <EbookCard item={COMING_SOON_EBOOK} />
        </div>
      </section>
    </main>
  )
}

export default Ebooks
