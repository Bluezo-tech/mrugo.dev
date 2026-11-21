import { useState, type FormEvent } from 'react'
import PhoneInput, { isValidPhoneNumber, type Value } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { submitInquiry } from '../lib/inquiries'
import InquirySuccess from '../components/InquirySuccess'
import './Hire.css'

const projectTypes = [
  { title: 'Website or online store', detail: 'A business site or shopping experience' },
  { title: 'Web app or portal', detail: 'Accounts, dashboards, or custom workflows' },
  { title: 'Automation or integration', detail: 'Connect tools and simplify repeated work' },
  { title: 'Something else', detail: 'Tell me what you have in mind' },
]

const contactMethods = ['Email', 'WhatsApp', 'Phone call']

export default function Hire() {
  const [projectType, setProjectType] = useState('')
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState<Value | undefined>()
  const [whatsapp, setWhatsapp] = useState<Value | undefined>()
  const [phoneError, setPhoneError] = useState('')
  const [methods, setMethods] = useState<string[]>(['WhatsApp'])
  const [sameWhatsapp, setSameWhatsapp] = useState(true)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState('')
  const [sent, setSent] = useState(() => window.self !== window.top && new URLSearchParams(window.location.search).has('cms-success'))

  const toggleMethod = (method: string) => {
    setMethods((current) => current.includes(method) ? current.filter((item) => item !== method) : [...current, method])
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!projectType || methods.length === 0) return
    const needsPhone = methods.includes('Phone call') || (methods.includes('WhatsApp') && sameWhatsapp)
    const needsWhatsapp = methods.includes('WhatsApp') && !sameWhatsapp
    if ((needsPhone && !phone) || (phone && !isValidPhoneNumber(phone))) {
      setPhoneError('Enter a complete phone number for the selected country.')
      return
    }
    if ((needsWhatsapp && !whatsapp) || (whatsapp && !isValidPhoneNumber(whatsapp))) {
      setPhoneError('Enter a complete WhatsApp number for the selected country.')
      return
    }
    setPhoneError('')
    const website = String(new FormData(event.currentTarget).get('website') ?? '')
    setSending(true)
    setResult('')
    try {
      await submitInquiry({ source: 'hire', name: name.trim(), email: email.trim(), subject: `Project enquiry: ${projectType}`,
        message: description.trim(), project_type: projectType, phone: phone || '',
        whatsapp: methods.includes('WhatsApp') ? (sameWhatsapp ? phone || '' : whatsapp || '') : '', preferred_contact: methods, website })
      setSent(true)
      setProjectType(''); setDescription(''); setName(''); setEmail(''); setPhone(undefined); setWhatsapp(undefined)
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'Could not send your request. Please try again.')
    } finally { setSending(false) }
  }

  return (
    <main className="hire-page" id="content">
      {sent ? <InquirySuccess title="Request sent" onAgain={() => setSent(false)} returnHome /> : <form className="hire-form" onSubmit={handleSubmit}>
          <label className="sr-only">Leave this field empty<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label>
          <div className="hire-form-head">
            <h1>Tell me about your project</h1>
          </div>
          <div className="hire-form-grid">
          <div className="hire-project-fields">
          <fieldset className="hire-options">
            <legend>What should I build?</legend>
            {projectTypes.map((option) => (
              <label className={`hire-option${projectType === option.title ? ' is-selected' : ''}`} key={option.title}>
                <input type="radio" name="project-type" value={option.title} checked={projectType === option.title} onChange={() => setProjectType(option.title)} required />
                <span className="hire-radio" aria-hidden="true" />
                <span><strong>{option.title}</strong><small>{option.detail}</small></span>
              </label>
            ))}
          </fieldset>

          <label className="hire-field">
            <span className="sr-only">Describe the project</span>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={2000} required placeholder="Describe the project" />
            <small className="hire-count">{description.length}/2000</small>
          </label>
          </div>

          <div className="hire-contact-fields">
          <div className="hire-field-grid">
            <label className="hire-field"><span className="sr-only">Your name</span><input type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required placeholder="Your name" /></label>
            <label className="hire-field"><span className="sr-only">Email</span><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="Email" /></label>
          </div>
            <label className="hire-field hire-phone-field"><span className="sr-only">Phone number</span><PhoneInput defaultCountry="NG" international withCountryCallingCode countryCallingCodeEditable={false} value={phone} onChange={(value) => { setPhone(value); setPhoneError('') }} required={methods.includes('Phone call') || (sameWhatsapp && methods.includes('WhatsApp'))} placeholder="Phone number" aria-label="Phone number with country code" /></label>
          <label className="hire-whatsapp"><input type="checkbox" checked={sameWhatsapp} onChange={(event) => setSameWhatsapp(event.target.checked)} /><span>Same number on WhatsApp</span></label>
          {!sameWhatsapp && <label className="hire-field hire-phone-field"><span className="sr-only">WhatsApp number</span><PhoneInput defaultCountry="NG" international withCountryCallingCode countryCallingCodeEditable={false} value={whatsapp} onChange={(value) => { setWhatsapp(value); setPhoneError('') }} required={methods.includes('WhatsApp')} placeholder="WhatsApp number" aria-label="WhatsApp number with country code" /></label>}
          {phoneError && <p className="hire-error" role="alert">{phoneError}</p>}

          <fieldset className="hire-preferences">
            <legend>How should I reach you?</legend>
            <div className="hire-preference-list">
              {contactMethods.map((method) => <label className={methods.includes(method) ? 'is-selected' : ''} key={method}><input type="checkbox" checked={methods.includes(method)} onChange={() => toggleMethod(method)} /><span>{method}</span></label>)}
            </div>
            {methods.length === 0 && <p className="hire-error">Choose at least one reply method.</p>}
          </fieldset>
          <div className="hire-form-action">
            <button className="hire-submit" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send request'}</button>
            {result && <p className="hire-disclosure" role="status">{result}</p>}
          </div>
          </div>
          </div>
      </form>}
    </main>
  )
}
