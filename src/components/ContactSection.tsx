import { useState, type FormEvent } from 'react'
import { CONTACT } from '../data/content'
import { ClockIcon, EnvelopeIcon } from './Icons'
import { submitInquiry } from '../lib/inquiries'
import InquirySuccess from './InquirySuccess'
import './ContactSection.css'

const MAX_MESSAGE = 5000

function ContactSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState('')
  const [sent, setSent] = useState(() => window.self !== window.top && new URLSearchParams(window.location.search).has('cms-success'))

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const website = String(new FormData(event.currentTarget).get('website') ?? '')
    setSending(true)
    setResult('')
    try {
      await submitInquiry({ source: 'contact', name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim(), website })
      setSent(true)
      setName(''); setEmail(''); setSubject(''); setMessage('')
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'Could not send your message. Please try again.')
    } finally { setSending(false) }
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

      {sent ? <InquirySuccess title="Message sent" onAgain={() => setSent(false)} /> : <form className="contact-form" onSubmit={handleSubmit}>
        <label className="sr-only">Leave this field empty<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
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
                Subject
              </span>
              <input
                className="form-input"
                type="text"
                name="subject"
                required
                placeholder="What is this about?"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
            </label>

            <button className="form-submit" type="submit" disabled={sending}>
              {sending ? 'Sending…' : 'Send message'}{' '}
              <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {result && <p className="form-note" role="status">{result}</p>}
      </form>}
    </section>
  )
}

export default ContactSection
