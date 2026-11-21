import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Monogram from './Monogram'
import SupportModal from './SupportModal'
import { loadHiddenPages, loadManagedPages, type ManagedPage } from '../lib/cmsPages'

// Computed once at module load instead of during render (keeps the render pure).
const CURRENT_YEAR = new Date().getFullYear()
const WORK_LINKS = [
  { label: 'Projects', to: '/projects' },
  { label: 'Source Code', to: '/source-code' },
  { label: 'Classes', to: '/classes' },
  { label: 'E-books', to: '/ebooks' },
  { label: 'Experience', to: '/experience' },
]

function SiteFooter() {
  const [supportOpen, setSupportOpen] = useState(false)
  const [managedPages, setManagedPages] = useState<ManagedPage[]>([])
  const [hiddenPages, setHiddenPages] = useState<string[]>([])
  useEffect(() => { void loadManagedPages().then(setManagedPages).catch(() => {}); void loadHiddenPages().then(setHiddenPages).catch(() => {}) }, [])
  return (
    <>
    <footer className="site-footer">
      <div className="footer-bar">
        <div className="footer-identity">
          <Link className="footer-brand" to="/" aria-label="Mr Ugo — home">
            <Monogram variant="white" size={38} idSuffix="footer" />
            <span>Mr Ugo</span>
          </Link>
          <p>Practical software for real problems.</p>
        </div>
        <nav className="footer-nav footer-nav--work" aria-label="Work">
          <h2>Work</h2>
          {WORK_LINKS.filter(({ to }) => !hiddenPages.includes(to)).map(({ label, to }) => <Link key={label} to={to}>{label}</Link>)}
          {managedPages.filter((page) => page.published && !page.deleted_at).map((page) => <Link key={page.id} to={`/p/${page.slug}`}>{page.title}</Link>)}
        </nav>
        <nav className="footer-nav footer-nav--contact" aria-label="Get in touch">
          <h2>Get in touch</h2>
          {!hiddenPages.includes('/about') && <Link to="/about">About</Link>}
          <Link to="/#contact">Contact</Link>
          {!hiddenPages.includes('/hire') && <Link to="/hire">Hire Me</Link>}
          <button type="button" onClick={() => setSupportOpen(true)}>Support</button>
        </nav>
      </div>
      <div className="footer-bottom"><span>© {CURRENT_YEAR} Chukwuekem Melchizedek.</span><span>mrugo.dev</span><a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer">Rates By Exchange Rate API</a></div>
    </footer>
    {supportOpen && <SupportModal onClose={() => setSupportOpen(false)} />}
    </>
  )
}

export default SiteFooter
