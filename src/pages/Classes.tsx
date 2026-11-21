import SupportSection from '../components/SupportSection'

export default function Classes() {
  return <main><section className="page-section catalog-page" id="classes">
    <header className="catalog-heading"><h1>Classes</h1><p>0 in total</p></header>
    <label className="catalog-search"><span className="sr-only">Search classes</span><input type="search" placeholder="Search" aria-describedby="classes-empty" /></label>
    <div className="catalog-empty" id="classes-empty"><h2>Nothing here yet</h2><p>New classes will appear here as soon as they are added.</p></div>
  </section><div className="catalog-support"><SupportSection /></div></main>
}
