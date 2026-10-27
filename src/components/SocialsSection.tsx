import type { CSSProperties } from 'react'
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
          Follow along for the projects I'm building, what I'm learning, and the
          work behind them.
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
                TODO
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
              <span className="social-mark" aria-hidden="true">
                ↗
              </span>
            </a>
          ),
        )}
      </div>
    </section>
  )
}

export default SocialsSection
