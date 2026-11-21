import { SourceCodeCard } from '../components/ProductCards'
import { useEffect, useState } from 'react'
import { getPublishedProducts, type Product } from '../lib/products'
import { useCatalogPrice } from '../hooks/useCatalogPrice'
import CheckoutModal from '../components/CheckoutModal'
import SupportSection from '../components/SupportSection'

function SourceCode() {
  const [products, setProducts] = useState<Product[]>([])
  const [selected, setSelected] = useState<Product | null>(null)
  const [search, setSearch] = useState('')
  const displayPrice = useCatalogPrice()
  const visible = products.filter((product) => `${product.title} ${product.description}`.toLowerCase().includes(search.trim().toLowerCase()))
  useEffect(() => { let active = true; void getPublishedProducts('source').then((items) => { if (active) setProducts(items) }); return () => { active = false } }, [])
  return (
    <main>
      <section className="page-section catalog-page" id="source-code">
        <header className="catalog-heading"><h1>Source code</h1><p>{products.length} in total</p></header>
        <label className="catalog-search"><span className="sr-only">Search source code</span><input type="search" placeholder="Search" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        {products.length ? visible.length ? <div className="catalog-code-grid">
          {visible.map((product) => <SourceCodeCard key={product.id} item={{ title: product.title, description: product.description, zipName: 'ZIP package', priceLabel: displayPrice(product), buttonLabel: 'Get the code', availabilityLabel: 'Private download after payment', onSelect: () => setSelected(product) }} />)}
        </div> : <div className="catalog-empty"><h2>No matching code packages</h2><p>Try another search.</p></div> : <div className="catalog-empty"><h2>Nothing here yet</h2><p>New code packages will appear here as soon as they are published.</p></div>}
      </section>
      <div className="catalog-support"><SupportSection /></div>
      {selected && <CheckoutModal item={{ productId: selected.id, title: selected.title, kind: 'source', priceLabel: displayPrice(selected), description: selected.description }} onClose={() => setSelected(null)} />}
    </main>
  )
}

export default SourceCode
