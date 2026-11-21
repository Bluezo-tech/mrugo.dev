import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './InquirySuccess.css'

export default function InquirySuccess({ title, onAgain, returnHome = false }: { title: string; onAgain: () => void; returnHome?: boolean }) {
  const navigate = useNavigate()
  useEffect(() => {
    if (!returnHome || window.self !== window.top) return
    window.scrollTo({ top: 0, behavior: 'auto' })
    const timer = window.setTimeout(() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'auto' }) }, 5000)
    return () => window.clearTimeout(timer)
  }, [navigate, returnHome])
  return <div className="inquiry-success" role="status" aria-live="polite">
    <span className="inquiry-success-icon" aria-hidden="true"><svg viewBox="0 0 80 80" focusable="false"><circle className="inquiry-success-ring" cx="40" cy="40" r="33" /><text className="inquiry-success-brand" x="40" y="51" textAnchor="middle">U</text><path className="inquiry-success-tick" d="M24 40.5 35 51 57 29" /></svg></span>
    <h2>{title}</h2>
    <p>Thank you. Your details have been received. I’ll get back to you soon.</p>
    {returnHome && <p className="inquiry-success-return">Returning to the homepage shortly.</p>}
    <div className="inquiry-success-actions">
      {returnHome ? <Link className="inquiry-success-home" to="/">Back to home now</Link> : <button type="button" onClick={onAgain}>Send another message</button>}
    </div>
  </div>
}
