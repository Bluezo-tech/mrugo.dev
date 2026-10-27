import { useState, type FormEvent } from 'react'
import { CONTACT } from '../data/content'

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
      <p className="section-label">CONTACT</p>
      <h2>Let's work together</h2>
      <p className="section-intro">
        Have a project, a role, or an idea to talk through? Send a message and
        I'll get back to you.
      </p>

      <div className="contact-grid">
        <div className="contact-details">
          <a className="contact-card" href={`mailto:${CONTACT.email}`}>
            <span className="contact-card-label">Email</span>
            <span className="contact-card-value">{CONTACT.email}</span>
            <span className="contact-card-mark" aria-hidden="true">
              ↗
            </span>
          </a>

          <a
            className="contact-card"
            href={CONTACT.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact-card-label">WhatsApp</span>
            <span className="contact-card-value">Message me directly</span>
            <span className="contact-card-mark" aria-hidden="true">
              ↗
            </span>
          </a>

          <p className="todo-note">
            TODO: reply-time promise (the reference site shows one) — only if you
            want to state it.
          </p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
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
          </div>

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

          <label className="form-field">
            <span className="form-label">Your message</span>
            <textarea
              className="form-input form-textarea"
              name="message"
              placeholder="Tell me a bit about it…"
              rows={5}
              maxLength={MAX_MESSAGE}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              required
            />
          </label>

          <div className="form-footer">
            <p className="form-count">
              {message.length}/{MAX_MESSAGE}
            </p>
            <button className="form-submit" type="submit">
              Send message <span aria-hidden="true">↗</span>
            </button>
          </div>

          <p className="form-note">
            This opens your own email app with the message ready to send. Nothing
            is stored or sent from this website.
          </p>
        </form>
      </div>
    </section>
  )
}

export default ContactSection
