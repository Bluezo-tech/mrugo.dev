import type { CSSProperties } from 'react'
import './SocialsSection.css'
import { SOCIALS } from '../data/content'
import { LinkedInIcon, PlusIcon } from './Icons'

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
      className="social-icon-square"
      style={{ background: tint } as CSSProperties}
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
          Reach me on WhatsApp. More ways to follow my work are coming soon.
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
              <span className="social-message-action" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                  <path d="M20 11.5a8 8 0 0 1-8.5 8 8.7 8.7 0 0 1-3.3-.8L4 20l1.3-4.1A8 8 0 1 1 20 11.5Z" />
                  <path d="M8.5 10.5h7M8.5 13.5h5" />
                </svg>
                <span>Message</span>
              </span>
            </a>
          ),
        )}
      </div>
    </section>
  )
}

export default SocialsSection
