import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect, useState } from 'react'
import Experience, { BluezoComingSoon } from './pages/Experience'
import Projects from './pages/Projects'
import SourceCode from './pages/SourceCode'
import Ebooks from './pages/Ebooks'
import NotFound from './pages/NotFound'
import ManagedPage from './pages/ManagedPage'
import Hire from './pages/Hire'
import About from './pages/About'
import Layout from './components/Layout'
import AboutSection from './components/AboutSection'
import ProjectsSection from './components/ProjectsSection'
import Classes from './pages/Classes'
import SocialsSection from './components/SocialsSection'
import ContactSection from './components/ContactSection'
import SupportSection from './components/SupportSection'
import OrganizationsSection from './components/OrganizationsSection'
import { MARQUEE_SKILLS } from './data/skills'
import { SourceCodeCard, EbookCard } from './components/ProductCards'
import './components/SourcePreview.css'
import './components/EbookPreview.css'
import { BriefcaseIcon, UserCheckIcon } from './components/Icons'
import './App.css'
import './catalog.css'
import './components/HeroPhone.css'
import './refined-theme.css'
import './theme.css'
import profilePhoto from './assets/images/ugo-profile.jpeg'
import { defaultHero, getHeroContent } from './lib/siteContent'
import { getPublishedProducts, type Product } from './lib/products'
import { useCatalogPrice } from './hooks/useCatalogPrice'
import CheckoutModal from './components/CheckoutModal'
import PaymentReturn from './pages/PaymentReturn'

const Admin = lazy(() => import('./pages/Admin'))

function RouteMetadata() {
  const { pathname } = useLocation()
  useEffect(() => {
    const root = import.meta.env.VITE_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? '' : window.location.origin)
    if (!root) return
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]') || document.createElement('link')
    canonical.rel = 'canonical'
    canonical.href = `${root}${pathname}`
    if (!canonical.parentNode) document.head.append(canonical)
    const socialUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]')
    if (socialUrl) socialUrl.content = canonical.href
  }, [pathname])
  return null
}

function Home() {
  const [hero, setHero] = useState(defaultHero)
  const [sourceProducts, setSourceProducts] = useState<Product[]>([])
  const [ebooks, setEbooks] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const displayPrice = useCatalogPrice()

  useEffect(() => {
    const controller = new AbortController()
    void getHeroContent(controller.signal).then(setHero).catch(() => {})
    return () => controller.abort()
  }, [])
  useEffect(() => {
    let active = true
    void Promise.all([getPublishedProducts('source'), getPublishedProducts('ebook')]).then(([sources, books]) => {
      if (active) { setSourceProducts(sources); setEbooks(books) }
    })
    return () => { active = false }
  }, [])

  return (
    <main>
      <section className={`hero-section${hero.headlineSize === 'large' ? ' hero-section--large' : ''}`} id="home">
        <h1>
          {hero.headline} <span>{hero.highlight}</span>
        </h1>

        <div className="hero-right">
          <div className="avatar">
            <div className="avatar-disc" aria-hidden="true" />
            <div className="avatar-ring" aria-hidden="true" />
            <img
              className="avatar-image"
              src={profilePhoto}
              alt="Portrait of Ugochukwu"
            />
          </div>

          <p className="hero-bubble">{hero.bubble}</p>
        </div>

        <p className="hero-description">
          {hero.description}
        </p>

        <div className="hero-actions">
          <Link className="contact-button" to="/experience">
            <BriefcaseIcon className="button-icon" />
            <span>Explore My Work</span>
          </Link>
          <Link className="hero-secondary-button" to="/hire">
            <UserCheckIcon className="button-icon" />
            <span>Hire Me</span>
          </Link>
        </div>
      </section>

      <section className="tech-stripe" aria-label="Technologies I work with">
        <div className="tech-track">
          {[0, 1].map((copy) => (
            <div
              className="tech-group"
              key={copy}
              aria-hidden={copy === 1 ? true : undefined}
            >
              {MARQUEE_SKILLS.map((skill) => (
                <span className="tech-item" key={skill.name}>
                  {skill.icon ? (
                    <img
                      className={`tech-logo${skill.name === 'Canva' ? ' is-wordmark' : ''}${skill.name === 'LinkedIn' ? ' is-linkedin' : ''}`}
                      src={skill.icon.src ?? `https://cdn.simpleicons.org/${skill.icon.slug}/${skill.icon.onDark}`}
                      alt=""
                      loading="lazy"
                    />
                  ) : (
                    <span className="tech-symbol" aria-hidden="true">
                      {skill.symbol}
                    </span>
                  )}
                  <span>{skill.name}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <AboutSection />
      <OrganizationsSection />
      <ProjectsSection />

      <section className="source-preview-section preview-section" id="source-code" data-reveal>
        <div className="section-head">
          <p className="section-label">SOURCE CODE</p>
          <h2>Source code</h2>
          {sourceProducts.length > 0 && <p className="section-intro">Explore the latest source packages.</p>}
        </div>
        <div className="source-preview-grid">
          {sourceProducts.length ? sourceProducts.slice(0, 2).map((product) => <SourceCodeCard key={product.id} item={{ title: product.title, description: product.description, zipName: 'ZIP package', priceLabel: displayPrice(product), buttonLabel: 'Get the code', availabilityLabel: 'Private download after payment', onSelect: () => setSelectedProduct(product) }} />) : <SourceCodeCard item={{ title: 'Source code coming soon', description: 'The first documented project package will appear here when it is ready.', zipName: 'ZIP package coming soon', priceLabel: 'Not available yet', buttonLabel: 'Coming soon' }} />}
        </div>
        {sourceProducts.length > 0 && <Link className="catalog-all-link" to="/source-code">All source code <span aria-hidden="true">›</span></Link>}
      </section>

      <section className="ebook-preview-section preview-section" id="ebooks" data-reveal>
        <div className="section-head">
          <p className="section-label">E-BOOKS</p>
          <h2>E-books</h2>
          {ebooks.length > 0 && <p className="section-intro">Explore the latest e-books.</p>}
        </div>
        <div className="ebook-preview-grid">
          {ebooks.length ? ebooks.slice(0, 2).map((product) => <EbookCard key={product.id} item={{ title: product.title, imageUrl: product.cover_url || undefined, priceLabel: displayPrice(product), buttonLabel: 'Get the e-book', onSelect: () => setSelectedProduct(product) }} />) : <EbookCard item={{ title: 'E-book coming soon', priceLabel: 'Not available yet', buttonLabel: 'Coming soon' }} />}
        </div>
        {ebooks.length > 0 && <Link className="catalog-all-link" to="/ebooks">All e-books <span aria-hidden="true">›</span></Link>}
      </section>

      <SocialsSection />
      <ContactSection />
      <SupportSection />
      {selectedProduct && <CheckoutModal item={{ productId: selectedProduct.id, title: selectedProduct.title, kind: selectedProduct.kind, priceLabel: displayPrice(selectedProduct), description: selectedProduct.description }} onClose={() => setSelectedProduct(null)} />}
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <RouteMetadata />
      <Routes>
        <Route path="/admin" element={<Suspense fallback={<main className="admin-page" id="content">Loading dashboard…</main>}><Admin /></Suspense>} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Navigate to="/about#skills" replace />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/experience/:slug" element={<Experience />} />
          <Route path="/bluezo-tech" element={<BluezoComingSoon />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/source-code" element={<SourceCode />} />
          <Route path="/ebooks" element={<Ebooks />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/socials" element={<main><h1 className="sr-only">Social media</h1><SocialsSection /></main>} />
          <Route path="/hire" element={<Hire />} />
          <Route path="/payment/return" element={<PaymentReturn />} />
          <Route path="/p/:slug" element={<ManagedPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
