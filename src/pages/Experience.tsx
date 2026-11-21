import { Link, useParams } from 'react-router-dom'
import profilePhoto from '../assets/images/ugo-profile.jpeg'
import techPreview from '../assets/images/somtico-technologies-site.png'
import fashionPreview from '../assets/images/somtico-fashion-hub-site.png'
import stemPreview from '../assets/images/stem-lantern-site.png'
import fashionLogo from '../assets/brands/somtico-fashion-hub-full.png'
import stemLogo from '../assets/brands/stem-lantern-logo.webp'
import techLogo from '../assets/brands/somtico-tech-logo.webp'
import bluezoLogo from '../assets/images/bluezo-horizontal-on-navy.svg'
import bluezoPreview from '../assets/images/bluezo-preview.png'
import fashionProducts from '../data/somticoFashionProducts.json'
import './Experience.css'

function ArrowDownIcon() { return <svg className="xp-button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v15m-6-6 6 6 6-6" /></svg> }
function ExternalLinkIcon() { return <svg className="xp-button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 5h6v6M19 5l-9 9"/><path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/></svg> }
function HeartIcon() { return <svg className="xp-button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.8 8.6c0 4.4-8.8 10.2-8.8 10.2S3.2 13 3.2 8.6a4.5 4.5 0 0 1 8.8-1.2 4.5 4.5 0 0 1 8.8 1.2Z"/></svg> }

function StemOfferIcon({ offer }: { offer: string }) {
  const paths: Record<string, React.ReactNode> = {
    'Math programs': <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7 9h5m-2.5-2.5v5M15 14l4 4m0-4-4 4" /></>,
    'Coding classes': <><path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16" /></>,
    Robotics: <><rect x="5" y="8" width="14" height="12" rx="2" /><path d="M12 8V4m-2 0h4M2 12v5m20-5v5M9 14h.01M15 14h.01M9 17h6" /></>,
    '3D printing': <><path d="m12 2 9 5-9 5-9-5 9-5Zm-9 5v10l9 5 9-5V7M12 12v10" /></>,
    'Holiday camps': <><path d="M3 20h18L12 4 3 20Zm9-16v16m-5-7h10" /><path d="M17 3v3m-1.5-1.5h3" /></>,
  }
  return <svg className="xp-offer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[offer] ?? <circle cx="12" cy="12" r="8" />}</svg>
}

const bluezoServices = [
  { name: 'Websites & e-commerce', detail: 'Websites and online stores designed around how people browse and buy.', features: ['Business websites', 'Online stores', 'Responsive design'], href: '/hire', icon: 'website' },
  { name: 'Business automation', detail: 'Connected workflows that make repetitive work easier to manage.', features: ['Workflows', 'Forms', 'Approvals'], href: '/hire', icon: 'automation' },
  { name: 'Web apps & portals', detail: 'Interactive platforms for teams, customers, and communities.', features: ['User accounts', 'Dashboards', 'Content access'], href: '/hire', icon: 'portal' },
  { name: 'System integrations', detail: 'Connections that help separate tools work together.', features: ['APIs', 'Data flow', 'Service connections'], href: '/hire', icon: 'integration' },
  { name: 'Cloud hosting & support', detail: 'A stable home for digital products with ongoing technical care.', features: ['Hosting', 'Maintenance', 'Support'], href: 'https://www.somticoweb.com/cloud-hosting', icon: 'cloud' },
  { name: 'Domain support', detail: 'Help connecting a project to its online address.', features: ['Domains', 'Setup', 'Configuration'], href: 'https://www.somticoweb.com/cloud-hosting', icon: 'domain' },
]

function BluezoServices() {
  return <section className="xp-bluezo-services" aria-label="What Bluezo Tech is building"><div className="xp-bluezo-services-inner"><div className="xp-bluezo-services-heading"><p className="section-label">WHAT BLUEZO TECH BUILDS</p><h2>Practical ideas, built with purpose.</h2></div></div><div className="xp-bluezo-services-window"><div className="xp-bluezo-services-track">{[0, 1].map((copy) => <div className="xp-bluezo-services-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{bluezoServices.map((service) => <a className="xp-bluezo-service" key={service.name} href={service.href} target={service.href.startsWith('http') ? '_blank' : undefined} rel={service.href.startsWith('http') ? 'noopener noreferrer' : undefined} tabIndex={copy === 1 ? -1 : undefined}><TechServiceIcon kind={service.icon} /><h3>{service.name}</h3><p>{service.detail}</p><ul>{service.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><span>{service.href.startsWith('http') ? 'View at Somtico Technologies' : 'Hire me'} <ExternalLinkIcon /></span></a>)}</div>)}</div></div></section>
}

export function BluezoComingSoon() {
  return <main className="xp-page xp-page--bluezo-coming"><div className="xp-coming"><img src={bluezoLogo} alt="Bluezo Tech" /><p className="section-label">WEBSITE IN DEVELOPMENT</p><h1>We’re building what comes next.</h1><p>The Bluezo Tech website is under development. Explore my work here while it takes shape.</p><Link to="/experience/bluezo-tech">Back to my Bluezo Tech experience</Link></div></main>
}

const stemProgramClips = [
  { name: 'Math', clip: '/stem-programs/math.mp4', label: 'Math programs' },
  { name: 'Coding', clip: '/stem-programs/coding.mp4', label: 'Coding classes' },
  { name: 'Robotics', clip: '/stem-programs/robotics.mp4', label: 'Robotics' },
  { name: '3D Printing', clip: '/stem-programs/printing.mp4', label: '3D printing' },
  { name: 'Holiday Camps', clip: '/stem-programs/camps.mp4', label: 'Holiday camps' },
]

function StemPrograms() {
  return <section className="xp-stem-programs" aria-label="STEM Lantern programs">
    <div className="xp-stem-programs-heading"><div><p className="section-label">STEM LANTERN PROGRAMS</p><h2>Learning in motion.</h2><p>My promotional content presents the organization's programs. The programs belong to STEM Lantern.</p></div><a href="https://stemlantern.com/programs" target="_blank" rel="noopener noreferrer">Visit programs <ExternalLinkIcon /></a></div>
    <div className="xp-stem-programs-window"><div className="xp-stem-programs-track">{[0, 1].map((copy) => <div className="xp-stem-programs-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{stemProgramClips.map((item) => <article className="xp-stem-program" key={item.name}><div className="xp-stem-program-video"><video src={item.clip} autoPlay muted loop playsInline preload="metadata" aria-label={`${item.name} animation from the STEM Lantern promotional video`} /></div><div className="xp-stem-program-title"><StemOfferIcon offer={item.label} /><h3>{item.name}</h3></div></article>)}</div>)}</div></div>
  </section>
}

const techServices = [
  { name: 'Custom software', description: 'Tools built around an organization’s workflow.', features: ['Databases', 'Dashboards', 'Reporting'], href: '/custom-software', icon: 'software' },
  { name: 'Web apps & portals', description: 'Secure spaces for staff, clients, and members.', features: ['Secure login', 'Forms & uploads', 'Payments'], href: '/web-apps-portals', icon: 'portal' },
  { name: 'Business automation', description: 'Connected workflows that reduce manual work.', features: ['Approvals', 'Email automation', 'Registration'], href: '/business-systems-automation', icon: 'automation' },
  { name: 'Websites & e-commerce', description: 'Websites and online stores for growing businesses.', features: ['Online stores', 'Bookings', 'SEO'], href: '/websites-ecommerce', icon: 'website' },
  { name: 'System integrations', description: 'Connections between platforms and services.', features: ['Payment gateways', 'Email services', 'APIs'], href: '/services', icon: 'integration' },
  { name: 'Cloud hosting & support', description: 'Hosting, maintenance, and technical support.', features: ['Backups', 'Security updates', 'Maintenance'], href: '/cloud-hosting', icon: 'cloud' },
  { name: 'Domain support', description: 'Help with domains as part of managed hosting.', features: ['Domain support', 'Hosting setup', 'Ongoing support'], href: '/cloud-hosting', icon: 'domain' },
  { name: 'Logo design & brand marks', description: 'Identity assets for web, print, and social media.', features: ['Primary logos', 'Logo variants', 'Social assets'], href: '/logo-design', icon: 'brand' },
  { name: 'Business Advisor', description: 'An AI product for tutoring and enrichment centres.', features: ['Pricing guidance', 'Business insights', 'Savings tracking'], href: '/ai-business-advisor', icon: 'advisor' },
  { name: 'Email security', description: 'Email protection offered through the client portal.', features: ['Incoming filtering', 'Outgoing filtering', 'Email archiving'], href: 'https://clients.somticoweb.com/store/email-services', icon: 'mail' },
]

function TechServiceIcon({ kind }: { kind: string }) {
  const paths: Record<string, React.ReactNode> = {
    software: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18m-13 4-2 2 2 2m8-4 2 2-2 2" /></>,
    portal: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18m-10 4h6m-6 3h4m-8-3h1m-1 3h1" /></>,
    automation: <><path d="M4 7h9m-3-3 3 3-3 3M20 17h-9m3-3-3 3 3 3" /><rect x="3" y="14" width="5" height="5" rx="1" /><rect x="16" y="4" width="5" height="5" rx="1" /></>,
    website: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 9h20m-15-2h.01M11 7h.01m-4 6h5m-5 3h9" /></>,
    integration: <><circle cx="5" cy="12" r="2" /><circle cx="19" cy="5" r="2" /><circle cx="19" cy="19" r="2" /><path d="M7 12h5m0 0 5-7m-5 7 5 7" /></>,
    cloud: <><path d="M6 18a4 4 0 0 1-.6-7.9A7 7 0 0 1 19 11a3.5 3.5 0 0 1-.5 7H6Z" /><path d="M9 14h6m-3-3v6" /></>,
    domain: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3Z" /></>,
    brand: <><path d="m12 3 2.7 5.4L21 9.3l-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.3l6.3-.9L12 3Z" /></>,
    advisor: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 15h8m-8-4h5m3-3 .5 1.5L18 10l-1.5.5L16 12l-.5-1.5L14 10l1.5-.5L16 8Z" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>
}

function TechServices() {
  return <section className="xp-tech-services" aria-label="Somtico Technologies services">
    <div className="xp-tech-services-heading"><div><p className="section-label">WHAT SOMTICO OFFERS</p><h2>Practical systems for real work.</h2><p className="xp-attribution">These are the company's services. My work as a junior developer is described in the role section below.</p></div><a href="https://www.somticoweb.com/services" target="_blank" rel="noopener noreferrer">Visit services <ExternalLinkIcon /></a></div>
    <div className="xp-tech-services-window"><div className="xp-tech-services-track">{[0, 1].map((copy) => <div className="xp-tech-services-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{techServices.map((item) => <a className="xp-tech-service" key={item.name} href={item.href.startsWith('http') ? item.href : `https://www.somticoweb.com${item.href}`} target="_blank" rel="noopener noreferrer" tabIndex={copy === 1 ? -1 : undefined}><TechServiceIcon kind={item.icon} /><h3>{item.name}</h3><p>{item.description}</p><ul>{item.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><span>Explore offering <ExternalLinkIcon /></span></a>)}</div>)}</div></div>
  </section>
}

function FashionProducts() {
  const formatPrice = (price: number) => `CAD $${price.toFixed(2)}`
  return <section className="xp-products" aria-label="Products from Somtico Fashion Hub">
    <div className="xp-products-heading"><div><p className="section-label">SOMTICO FASHION HUB MARKETPLACE</p><h2>The platform I support</h2><p className="xp-attribution">These are products listed by the company and its vendors. My role includes vendor support, product listing management, and social content planning; this gallery does not represent products or a store I built.</p></div><a href="https://somtico.com/shop/" target="_blank" rel="noopener noreferrer">View company store <ExternalLinkIcon /></a></div>
    <div className="xp-products-window"><div className="xp-products-track">{[0, 1].map((copy) => <div className="xp-products-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{fashionProducts.map((product) => <article className="xp-product" key={product.url}>
      <a className="xp-product-image" href={product.url} target="_blank" rel="noopener noreferrer" tabIndex={copy === 1 ? -1 : undefined}><img src={product.image} alt={product.name} loading="lazy" />{product.onSale && <span className="xp-sale-badge">Sale</span>}</a>
      <div className="xp-product-copy"><a className="xp-product-name" href={product.url} target="_blank" rel="noopener noreferrer" tabIndex={copy === 1 ? -1 : undefined}>{product.name}</a><span className="xp-product-price">{product.onSale && product.regularPrice > product.price && <del>{formatPrice(product.regularPrice)}</del>}<strong>{formatPrice(product.price)}</strong></span>{product.sizes.length > 0 && <span className="xp-product-sizes">Sizes: {product.sizes.slice(0, 5).join(' · ')}{product.sizes.length > 5 ? ' +' : ''}</span>}</div>
      <div className="xp-product-actions"><a href={product.url} target="_blank" rel="noopener noreferrer" tabIndex={copy === 1 ? -1 : undefined}>{product.sizes.length ? 'Select options' : 'View product'} <ExternalLinkIcon /></a><a className="xp-product-wishlist" href={product.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${product.name} to add it to your wishlist on the store`} tabIndex={copy === 1 ? -1 : undefined}><HeartIcon /></a></div>
    </article>)}</div>)}</div></div>
    <p className="xp-products-note">Company and vendor products. Prices may change; check the store before buying.</p>
  </section>
}

const roles = [
  { slug: 'stem-lantern', company: 'STEM Lantern Education Inc.', title: 'Social Media Manager & Content Creator', summary: 'I manage social media content and digital communications that support STEM Lantern’s educational work.', work: ['Create educational graphics, captions and short-form videos.', 'Plan and manage content across social platforms.'], offers: ['Math programs', 'Coding classes', 'Robotics', '3D printing', 'Holiday camps'], site: 'https://stemlantern.com/', preview: stemPreview, mark: 'SL' },
  { slug: 'somtico-technologies', company: 'Somtico Technologies Inc.', title: 'Junior Web Developer', summary: 'I contribute to web applications and reusable interface components using modern web technologies.', work: ['Contribute to web applications and reusable interface components using modern web technologies.', 'Build responsive components from product requirements and existing design systems.', 'Use Git and GitLab in a ticket-based workflow for version control and collaboration.', 'Test and refine features across screen sizes for functionality, usability, and consistency.', 'Work with the development team to troubleshoot issues, apply feedback, and maintain existing features.'], offers: ['Custom software', 'Web apps & portals', 'Business automation', 'Websites & e-commerce', 'System integrations', 'Cloud hosting & support', 'Domain support', 'Logo design & brand marks', 'Business Advisor', 'Email security'], site: 'https://www.somticoweb.com/', preview: techPreview, mark: 'ST' },
  { slug: 'somtico-fashion-hub', company: 'Somtico Fashion Hub', title: 'Vendor Success & Technical Support Lead', summary: 'I help vendors use the platform and keep their product listings in good shape.', work: ['Support vendor onboarding and provide technical assistance.', 'Review and manage vendor product listings on the platform.', 'Plan and manage content across social platforms.'], offers: ['African fashion', 'Vendor storefronts', 'Clothing & accessories', 'Beauty products', 'Online shopping'], site: 'https://somtico.com/', preview: fashionPreview, mark: 'SF' },
  { slug: 'bluezo-tech', company: 'Bluezo Tech', title: 'Founder & Lead Developer', summary: 'I founded Bluezo Tech to build practical software and digital solutions.', work: ['Design and develop web applications and digital platforms using modern web technologies.', 'Work across front end, back end, databases, APIs, testing, and software development workflows.', 'Develop a church media platform for organizing and accessing church media content.', 'Plan, build, test, and improve software projects based on their requirements.'], offers: bluezoServices.map((service) => service.name), mark: 'B' },
]

function Experience() {
  const { slug } = useParams()
  const role = roles.find((item) => item.slug === slug)
  if (slug && !role) return <main className="xp-page"><div className="xp-wrap"><h1>Experience not found</h1><Link to="/experience">Back to experience</Link></div></main>

  if (role) return (
    <main className={`xp-page xp-page--detail${role.slug === 'somtico-fashion-hub' ? ' xp-page--fashion' : role.slug === 'stem-lantern' ? ' xp-page--stem' : role.slug === 'somtico-technologies' ? ' xp-page--tech' : role.slug === 'bluezo-tech' ? ' xp-page--bluezo' : ''}`}><div className="xp-wrap">
      <nav className="xp-breadcrumb" aria-label="Breadcrumb"><Link to="/experience">Experience</Link><span aria-hidden="true">/</span><span>{role.company}</span></nav>
      <section className="xp-detail-hero">
        <div className="xp-detail-copy"><span className="xp-kicker"><span className={`xp-mark${role.slug === 'somtico-fashion-hub' ? ' xp-mark--fashion' : role.slug === 'stem-lantern' ? ' xp-mark--stem' : role.slug === 'somtico-technologies' ? ' xp-mark--tech' : role.slug === 'bluezo-tech' ? ' xp-mark--bluezo' : ''}`}>{role.slug === 'somtico-fashion-hub' ? <img src={fashionLogo} alt="" /> : role.slug === 'stem-lantern' ? <img src={stemLogo} alt="" /> : role.slug === 'somtico-technologies' ? <img src={techLogo} alt="" /> : role.slug === 'bluezo-tech' ? <img src={bluezoLogo} alt="" /> : role.mark}</span> {role.slug === 'stem-lantern' ? <span>MY ROLE WITH STEM LANTERN <span className="xp-kicker-nowrap">EDUCATION INC.</span></span> : <>MY ROLE WITH {role.company.toUpperCase()}</>}</span><h1>{role.title}</h1>{role.slug === 'somtico-technologies' && <span className="xp-role-type">Independent Contractor</span>}<p>{role.summary}</p><div className="xp-hero-actions"><a className="xp-hero-action" href="#my-role">Explore my role <ArrowDownIcon /></a>{'site' in role && role.site && <a className="xp-hero-site" href={role.site} target="_blank" rel="noopener noreferrer">Company website <ExternalLinkIcon /></a>}{role.slug === 'bluezo-tech' && <Link className="xp-hero-site" to="/bluezo-tech">Company website <ExternalLinkIcon /></Link>}</div></div>
        <div className="xp-portrait-wrap"><div className="xp-portrait"><span aria-hidden="true" /><img src={profilePhoto} alt="Portrait of Mr Ugo" /></div><p className="xp-portrait-label">Hello, I'm Ugo.</p></div>
      </section>
      {role.slug === 'somtico-fashion-hub' ? <FashionProducts /> : role.slug === 'stem-lantern' ? <StemPrograms /> : role.slug === 'somtico-technologies' ? <TechServices /> : role.slug === 'bluezo-tech' ? <BluezoServices /> : <div className="xp-offerings-strip" aria-label={`What ${role.company} offers`}>
        <div className="xp-offerings-track">
          {[0, 1].map((copy) => <div className="xp-offerings-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
            {role.offers.map((offer) => <span className="xp-offerings-item" key={offer}>{role.slug === 'stem-lantern' ? <StemOfferIcon offer={offer} /> : <span aria-hidden="true">✦</span>}{offer}</span>)}
          </div>)}
        </div>
      </div>}
      <div className="xp-detail-grid" id="my-role">
        <section className="xp-panel"><p className="section-label">01 / MY ROLE</p><h2>What I do</h2><ul className="xp-work-list">{role.work.map((item) => <li key={item}>{item}</li>)}</ul></section>
        <section className="xp-panel"><p className="section-label">02 / THE COMPANY</p><h2>What {role.company} offers</h2><p className="xp-panel-context">These are the organization's offerings, separate from the work described in my role.</p><ul className="xp-offers">{role.offers.map((item) => <li key={item}>{item}</li>)}</ul></section>
      </div>
      {'site' in role && role.site && 'preview' in role && role.preview && <section className="xp-site-section">
        <div className="xp-site-copy"><p className="section-label">03 / ORGANIZATION WEBSITE</p><h2>Explore {role.company}.</h2><p>This is the organization's own website, shown as context for my role. My specific contributions are listed above.</p><a className="xp-site-visit" href={role.site} target="_blank" rel="noopener noreferrer">Visit company website <ExternalLinkIcon /></a></div>
        <a className="xp-site-card" href={role.site} target="_blank" rel="noopener noreferrer" aria-label={`Open ${role.company} official website`}><span className="xp-browser-bar"><span className="xp-browser-dots" aria-hidden="true"><i /><i /><i /></span><span>{new URL(role.site).hostname.replace(/^www\./, '')}</span><ExternalLinkIcon /></span><img src={role.preview} alt={`${role.company} website preview`} loading="lazy" /></a>
      </section>}
      {role.slug === 'bluezo-tech' && <section className="xp-site-section xp-site-section--bluezo"><div className="xp-site-copy"><p className="section-label">03 / COMPANY WEBSITE</p><h2>Bluezo Tech is taking shape.</h2><p>The official website is under development. Preview the brand and check back as the platform grows.</p><Link className="xp-site-visit" to="/bluezo-tech">View development page <ExternalLinkIcon /></Link></div><Link className="xp-site-card" to="/bluezo-tech" aria-label="Open Bluezo Tech development page"><span className="xp-browser-bar"><span className="xp-browser-dots" aria-hidden="true"><i /><i /><i /></span><span>Bluezo Tech · In development</span><ExternalLinkIcon /></span><img src={bluezoPreview} alt="Bluezo Tech brand preview" loading="lazy" /></Link></section>}
    </div></main>
  )

  return <main className="xp-page xp-page--listing"><div className="xp-wrap">
    <header className="xp-intro"><div className="xp-intro-copy"><p className="section-label">PROFESSIONAL CONTRIBUTIONS</p><h1>Where I work, <span>what I do.</span></h1><p>Explore my specific roles with these organizations. Their websites and products are shown for context; each detail page explains what I contributed.</p><span className="xp-intro-count">04 roles · 04 organizations</span></div><div className="xp-intro-portrait"><span className="xp-intro-disc" aria-hidden="true" /><span className="xp-intro-ring" aria-hidden="true" /><img src={profilePhoto} alt="Portrait of Mr Ugo" /></div></header>
    <div className="xp-cards">{roles.map((item, index) => <Link className="xp-card" to={`/experience/${item.slug}`} key={item.slug}>
      <div className={`xp-card-art xp-card-art--${item.slug}`}>{'preview' in item && item.preview ? <img src={item.preview} alt="" loading="lazy" /> : item.slug === 'bluezo-tech' ? <img src={bluezoPreview} alt="" loading="lazy" /> : <span>B<span>.</span></span>}</div>
      <div className="xp-card-body"><div className="xp-card-meta"><span className={`xp-mark${item.slug === 'somtico-fashion-hub' ? ' xp-mark--fashion' : item.slug === 'stem-lantern' ? ' xp-mark--stem' : item.slug === 'somtico-technologies' ? ' xp-mark--tech' : item.slug === 'bluezo-tech' ? ' xp-mark--bluezo' : ''}`}>{item.slug === 'somtico-fashion-hub' ? <img src={fashionLogo} alt="" /> : item.slug === 'stem-lantern' ? <img src={stemLogo} alt="" /> : item.slug === 'somtico-technologies' ? <img src={techLogo} alt="" /> : item.slug === 'bluezo-tech' ? <img src={bluezoLogo} alt="" /> : item.mark}</span><span>0{index + 1} / 04</span></div><span className="xp-contribution-label">{item.slug === 'bluezo-tech' ? 'Independent venture' : 'Professional contribution'}</span><h2>{item.company}</h2><p>{item.title}{item.slug === 'somtico-technologies' && ' · Independent Contractor'}</p><span className="xp-card-cta">Explore role <ExternalLinkIcon /></span></div>
    </Link>)}</div>
  </div></main>
}

export default Experience

