import { useState, type FormEvent } from 'react'
import { CONTACT } from '../data/content'
import { ClockIcon, EnvelopeIcon } from './Icons'

const MAX_MESSAGE = 5000

function ContactSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  /**
   * There is no backend and none is being faked. Submitting composes the
   * message in the visitor's own email app and sends nothing from this site.
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const subjectLine =
      subject.trim() || `Portfolio enquiry from ${name.trim() || 'a visitor'}`

    const body = [message.trim(), '', '—', name.trim(), email.trim()].join('\n')

    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      subjectLine,
    )}&body=${encodeURIComponent(body)}`
  }

  return (
    <section className="contact-section" id="contact" data-reveal>
      <div className="section-head">
        <p className="section-label">CONTACT</p>
        <h2>
          Let's <span className="gold-text">work together</span>
        </h2>
        <p className="section-intro">
          Have a project or an idea to talk through? Send a message and I'll get
          back to you.
        </p>
      </div>

      <p className="contact-line">
        <a className="contact-line-item" href={`mailto:${CONTACT.email}`}>
          <EnvelopeIcon className="contact-line-icon" />
          <span>{CONTACT.email}</span>
        </a>
        <span className="contact-line-item">
          <ClockIcon className="contact-line-icon" />
          <span>{CONTACT.replyTime}</span>
        </span>
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-columns">
          <label className="form-field form-field-message">
            <span className="form-label">Your message</span>
            <textarea
              className="form-input form-textarea"
              name="message"
              placeholder="Tell me a bit about it…"
              maxLength={MAX_MESSAGE}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
            />
            <span className="form-count">
              {message.length}/{MAX_MESSAGE}
            </span>
          </label>

          <div className="form-side">
            <label className="form-field">
              <span className="form-label">Your name</span>
              <input
                className="form-input"
                type="text"
                name="name"
                placeholder="Full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>

            <label className="form-field">
              <span className="form-label">Email</span>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="form-field">
              <span className="form-label">
                Subject <span className="form-optional">Optional</span>
              </span>
              <input
                className="form-input"
                type="text"
                name="subject"
                placeholder="What is this about?"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
            </label>

            <button className="form-submit" type="submit">
              Send message <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>

        <p className="form-note">
          This opens your own email app with the message ready to send. Nothing
          is stored or sent from this website.
        </p>
      </form>
    </section>
  )
}

export default ContactSection
