import { Link } from 'react-router-dom'
import stemLogo from '../assets/brands/stem-lantern-logo.webp'
import techLogo from '../assets/brands/somtico-tech-logo.webp'
import fashionLogo from '../assets/brands/somtico-fashion-hub-full.png'
import bluezoLogo from '../assets/images/bluezo-horizontal-on-navy.svg'

const organizations = [
  { name: 'STEM Lantern Education Inc.', logo: stemLogo, path: '/experience/stem-lantern' },
  { name: 'Somtico Technologies Inc.', logo: techLogo, path: '/experience/somtico-technologies' },
  { name: 'Somtico Fashion Hub', logo: fashionLogo, path: '/experience/somtico-fashion-hub' },
  { name: 'Bluezo Tech', logo: bluezoLogo, path: '/experience/bluezo-tech' },
]

export default function OrganizationsSection() {
  return <section className="organizations-section" aria-labelledby="organizations-title" data-reveal>
    <div className="section-head">
      <p className="section-label">PROFESSIONAL CONTRIBUTIONS</p>
      <h2 id="organizations-title">Organizations I Work With</h2>
      <p className="section-intro">Explore my role and specific contributions with each organization.</p>
    </div>
    <div className="organizations-window">
      <div className="organizations-track">
        {[0, 1].map(copy => <div className="organizations-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {organizations.map(organization => <Link key={organization.name} to={organization.path} tabIndex={copy === 1 ? -1 : undefined} className="organization-item">
            <span className={`organization-logo organization-logo--${organization.path.split('/').pop()}`}><img src={organization.logo} alt="" loading="lazy" /></span>
            <span>{organization.name}</span>
          </Link>)}
        </div>)}
      </div>
    </div>
  </section>
}
