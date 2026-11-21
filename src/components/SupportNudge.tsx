import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SupportModal from './SupportModal'
import Monogram from './Monogram'
import './SupportNudge.css'

const SESSION_KEY = 'mrugo-support-nudge-dismissed'

export default function SupportNudge() {
  const { pathname } = useLocation()
  const [eligible, setEligible] = useState(false)
  const [seenRoutes, setSeenRoutes] = useState(0)
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setEligible(true), 60000)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => { setSeenRoutes((count) => count + 1) }, [pathname])

  const visible = !dismissed && !open && (eligible || seenRoutes >= 3)

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, '1')
    setDismissed(true)
  }

  return <>
    {visible && <aside className="support-nudge" aria-label="Support Mr Ugo">
      <button type="button" className="support-nudge-close" onClick={dismiss} aria-label="Dismiss support suggestion">×</button>
      <div className="support-nudge-mark"><Monogram size={38} idSuffix="nudge" /></div>
      <div className="support-nudge-copy"><strong>Support what I’m building next</strong><span>Help Mr Ugo keep creating practical work.</span></div>
      <button type="button" className="support-nudge-action" onClick={() => { dismiss(); setOpen(true) }}>Support</button>
    </aside>}
    {open && <SupportModal onClose={() => setOpen(false)} />}
  </>
}
