import { type ReactElement } from 'react'
import { STATS } from '../data/content'
import CountUp from './CountUp'

/** Small line icons drawn for these stat cards (not a copied icon set). */
const STAT_ICONS: Record<string, ReactElement> = {
  skills: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l8 4.5-8 4.5-8-4.5L12 3z" />
      <path d="M4 12l8 4.5 8-4.5" />
      <path d="M4 16.5L12 21l8-4.5" />
    </svg>
  ),
  roles: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20.5c0-3.1 2.7-5.6 6-5.6s6 2.5 6 5.6" />
      <path d="M16.2 5.4a3.2 3.2 0 010 5.6" />
      <path d="M17.6 15.2c2.1.7 3.4 2.4 3.4 4.6" />
    </svg>
  ),
}

function AboutSection() {
  return (
    <section className="about-section" id="about" data-reveal>
      <div className="section-head">
        <p className="section-label">A LITTLE ABOUT ME</p>
        <h2>
          Technology, creativity, and{' '}
          <span className="gold-text">building things that matter.</span>
        </h2>
      </div>

      <p className="about-copy">
        I'm a software developer and technology enthusiast with experience in web
        development, digital content creation, technical support, and platform
        operations. I enjoy building digital solutions, solving problems, and
        turning ideas into practical experiences through technology and
        creativity.
      </p>

      <div className="stats-row">
        {STATS.map((stat) => (
          <div
            className="stat-card"
            key={stat.id}
          >
            <span className="stat-icon" aria-hidden="true">
              {STAT_ICONS[stat.id]}
            </span>
            <p className="stat-value"><CountUp value={stat.value} suffix={stat.suffix} /></p>
            <p className="stat-label">{stat.label}</p>
            <span className="stat-rule" aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default AboutSection
