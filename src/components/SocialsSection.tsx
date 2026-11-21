import type { CSSProperties } from 'react'
import './SocialsSection.css'
import { SOCIALS } from '../data/content'
import { LinkedInIcon, PlusIcon } from './Icons'
import CmsBlocks from './CmsBlocks'

function SocialIconSquare({
  id,
  slug,
  color,
  tint,
}: {
  id: string
  slug?: string
  color?: string
  tint?: string
}) {
  return (
    <span
      className={`social-icon-square social-icon-${id}`}
      style={{ background: tint, color: color ? `#${color}` : undefined } as CSSProperties}
      aria-hidden="true"
    >
      {id === 'linkedin' ? (
        <LinkedInIcon className="social-brand-icon" />
      ) : slug ? (
        <img
          src={`https://cdn.simpleicons.org/${slug}/${color ?? '9a9a9a'}`}
          alt=""
          loading="lazy"
        />
      ) : (
        <PlusIcon className="social-plus-icon" />
      )}
    </span>
  )
}

function SocialsSection() {
  return (
    <section className="socials-section" id="socials" data-reveal>
      <div className="section-head">
        <p className="section-label">LET'S CONNECT</p>
        <h2>
          Find me on <span className="gold-text">social media</span>
        </h2>
        <p className="section-intro">
          Message me on WhatsApp or follow my work across these platforms.
        </p>
      </div>

      <div className="socials-grid">
        {SOCIALS.map((social) =>
          social.todo || !social.href ? (
            <div className="social-card is-todo" key={social.id}>
              <SocialIconSquare
                id={social.id}
                slug={social.iconSlug}
                color={social.iconColor}
                tint={social.tint}
              />
              <span className="social-card-text">
                <span className="social-name">{social.label}</span>
                <span className="social-detail">{social.detail}</span>
              </span>
              <span className="social-mark is-todo-mark" aria-hidden="true">
                Soon
              </span>
            </div>
          ) : (
            <a
              className="social-card"
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SocialIconSquare
                id={social.id}
                slug={social.iconSlug}
                color={social.iconColor}
                tint={social.tint}
              />
              <span className="social-card-text">
                <span className="social-name">{social.label}</span>
                <span className="social-detail">{social.detail}</span>
              </span>
              <span className="social-message-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                  <path d="M14 5h5v5M19 5l-8 8" />
                  <path d="M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
                </svg>
              </span>
            </a>
          ),
        )}
        <CmsBlocks slot="socials" />
      </div>
    </section>
  )
}

export default SocialsSection
