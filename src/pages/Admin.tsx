import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase, type Inquiry } from '../lib/supabase'
import { defaultHero, getHeroContent, type HeroContent } from '../lib/siteContent'
import VisualEditor from './VisualEditor'
import BlocksEditor from './BlocksEditor'
import ReceiptsPanel from './ReceiptsPanel'
import DesignEditor from './DesignEditor'
import ProductsEditor from './ProductsEditor'
import { downloadInquiryPdf } from '../lib/inquiryPdf'
import { defaultReplyTemplates, formatReply, replyEditKeys, type ReplyTemplates } from '../lib/replyTemplates'
import './Admin.css'

const adminEmails = new Set(['ugodesktop@gmail.com', 'bluezotech@gmail.com'])
const whatsappLink = (value: string | null, name: string, template: string) => {
  if (!value || !/^\+?[\d\s()-]+$/.test(value)) return null
  const digits = value.replace(/\D/g, '')
  const international = digits.startsWith('0') ? `234${digits.slice(1)}` : digits
  const greeting = formatReply(template, name)
  return /^\d{10,15}$/.test(international) ? `https://wa.me/${international}?text=${encodeURIComponent(greeting)}` : null
}
const callLink = (value: string | null) => {
  if (!value || !/^\+?\d{7,15}$/.test(value.replace(/[\s()-]/g, ''))) return null
  return `tel:${value.replace(/[^\d+]/g, '')}`
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null)
  const [email, setEmail] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'archived'>('all')
  const [view, setView] = useState<'messages' | 'receipts' | 'replies' | 'content' | 'visual' | 'blocks' | 'design' | 'products'>(() => window.matchMedia('(min-width: 900px)').matches ? 'visual' : 'messages')
  const [desktop, setDesktop] = useState(() => window.matchMedia('(min-width: 900px)').matches)
  const [heroDraft, setHeroDraft] = useState<HeroContent>(defaultHero)
  const [saving, setSaving] = useState(false)
  const [replyTemplates, setReplyTemplates] = useState<ReplyTemplates>(defaultReplyTemplates)
  const [savingReplies, setSavingReplies] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 900px)')
    const update = () => { setDesktop(query.matches); setView(query.matches ? 'visual' : 'messages') }
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!supabase) return
    void supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!supabase || !session) { setAuthorized(false); setInquiries([]); return }
    const client = supabase
    let active = true
    const load = async () => {
      const { data: userResult, error: userError } = await client.auth.getUser()
      if (!active) return
      if (userError || !adminEmails.has(userResult.user?.email?.toLowerCase() ?? '')) {
        setAuthorized(false)
        setNotice('This account does not have Portfolio CMS access yet.')
        return
      }
      setAuthorized(true)
      const { data: replyEdits } = await client.from('portfolio_edits').select('element_key,value').eq('page_path', '*').eq('edit_type', 'text').in('element_key', Object.values(replyEditKeys))
      if (active && replyEdits) setReplyTemplates({
        email: typeof replyEdits.find((row) => row.element_key === replyEditKeys.email)?.value?.text === 'string' ? replyEdits.find((row) => row.element_key === replyEditKeys.email)!.value.text as string : defaultReplyTemplates.email,
        whatsapp: typeof replyEdits.find((row) => row.element_key === replyEditKeys.whatsapp)?.value?.text === 'string' ? replyEdits.find((row) => row.element_key === replyEditKeys.whatsapp)!.value.text as string : defaultReplyTemplates.whatsapp,
      })
      void getHeroContent().then((content) => { if (active) setHeroDraft(content) })
      const { data, error } = await client.from('portfolio_inquiries')
        .select('id,created_at,source,name,email,subject,message,project_type,phone,whatsapp,preferred_contact,status')
        .order('created_at', { ascending: false }).limit(200)
      if (!active) return
      if (error) setNotice('Could not load the inbox. Please try again.')
      else { setInquiries((data ?? []) as Inquiry[]); setNotice('') }
    }
    void load()
    return () => { active = false }
  }, [session])

  useEffect(() => {
    if (!supabase || !session || !authorized) return
    const client = supabase
    let active = true
    const refreshInbox = async () => {
      if (document.hidden) return
      const { data, error } = await client.from('portfolio_inquiries')
        .select('id,created_at,source,name,email,subject,message,project_type,phone,whatsapp,preferred_contact,status')
        .order('created_at', { ascending: false }).limit(200)
      if (active && !error) setInquiries((data ?? []) as Inquiry[])
    }
    const timer = window.setInterval(() => { void refreshInbox() }, 30000)
    const onVisible = () => { if (!document.hidden) void refreshInbox() }
    document.addEventListener('visibilitychange', onVisible)
    return () => { active = false; window.clearInterval(timer); document.removeEventListener('visibilitychange', onVisible) }
  }, [session, authorized])

  const newMessageCount = inquiries.filter((item) => item.status === 'new').length
  useEffect(() => {
    const originalTitle = document.title
    if (authorized) document.title = newMessageCount ? `(${newMessageCount}) Messages · Mr Ugo CMS` : 'Mr Ugo CMS'
    return () => { document.title = originalTitle }
  }, [authorized, newMessageCount])

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase) return
    if (!adminEmails.has(email.trim().toLowerCase())) {
      setNotice('Use one of the approved admin email addresses.')
      return
    }
    setBusy(true)
    setNotice('')
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    })
    setNotice(error ? 'Could not send the sign-in link. Please try again.' : 'Check your email for a sign-in link.')
    setBusy(false)
  }

  const changeStatus = async (item: Inquiry, status: Inquiry['status']) => {
    if (!supabase) return
    const { error } = await supabase.from('portfolio_inquiries').update({ status }).eq('id', item.id)
    if (error) { setNotice('Could not update that message. Please try again.'); return }
    setInquiries((current) => current.map((entry) => entry.id === item.id ? { ...entry, status } : entry))
  }

  const visible = inquiries.filter((item) => filter === 'all' || item.status === filter)

  const saveReplies = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase) return
    setSavingReplies(true)
    for (const kind of ['email', 'whatsapp'] as const) {
      const key = replyEditKeys[kind]
      const row = { page_path: '*', element_key: key, edit_type: 'text', value: { text: replyTemplates[kind].trim() } }
      const { data: existing, error: readError } = await supabase.from('portfolio_edits').select('id').eq('page_path', '*').eq('element_key', key).eq('edit_type', 'text').maybeSingle()
      if (readError) { setNotice('Could not save reply text. Please try again.'); setSavingReplies(false); return }
      const { error } = existing
        ? await supabase.from('portfolio_edits').update({ value: row.value }).eq('id', existing.id)
        : await supabase.from('portfolio_edits').insert(row)
      if (error) { setNotice('Could not save reply text. Please try again.'); setSavingReplies(false); return }
    }
    setNotice('Reply text saved.')
    setSavingReplies(false)
  }

  const saveHero = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase || !authorized) return
    setSaving(true)
    setNotice('')
    const { data, error } = await supabase.from('portfolio_sections').update({
      content: {
        headline: heroDraft.headline.trim(), highlight: heroDraft.highlight.trim(),
        description: heroDraft.description.trim(), bubble: heroDraft.bubble.trim(),
      },
      appearance: { headline_size: heroDraft.headlineSize },
    }).eq('page', 'home').eq('section_key', 'hero').select('id').single()
    setNotice(error || !data ? 'Could not save the homepage. Please try again.' : 'Homepage hero saved. Refresh the homepage to see it.')
    setSaving(false)
  }

  return <main className="admin-page" id="content">
    <div className="admin-shell">
      <div className="admin-topbar"><Link to="/" className="admin-brand"><span>U</span> Mr Ugo <small>CMS</small></Link><Link to="/" className="admin-view-site">View website <span aria-hidden="true">↗</span></Link></div>
      <header className="admin-heading"><div><p className="admin-eyebrow">MR UGO / CONTENT STUDIO</p><h1>{view === 'messages' ? 'Messages' : view === 'receipts' ? 'Receipts' : view === 'replies' ? 'Reply text' : view === 'content' ? 'Home hero' : view === 'blocks' ? 'Page sections' : view === 'design' ? 'Site design' : view === 'products' ? 'Products' : 'Pages'}</h1><p>{view === 'messages' ? 'Contact and project enquiries in one place.' : view === 'receipts' ? 'Verified payment records, when checkout is connected.' : view === 'visual' ? 'Choose a page, select an element, and see changes before saving.' : 'Edit your website without changing the code.'}</p></div>
        {session && <button type="button" onClick={() => { void supabase?.auth.signOut() }}>Sign out</button>}
      </header>
      {!supabase && <div className="admin-panel"><p>CMS connection is not configured on this device.</p></div>}
      {supabase && !session && <form className="admin-panel admin-login" onSubmit={signIn}>
        <h2>Sign in</h2><p>Use an approved admin email address. We’ll send a secure sign-in link.</p>
        <label>Email address<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" /></label>
        <button type="submit" disabled={busy}>{busy ? 'Sending link…' : 'Email me a sign-in link'}</button>
      </form>}
      {notice && <p className="admin-notice" role="status">{notice}</p>}
      {session && authorized && <>
        <nav className="admin-tabs" aria-label="Dashboard sections">
          {desktop && <button type="button" className={view === 'visual' ? 'is-active' : ''} onClick={() => setView('visual')}>Pages</button>}
          {desktop && <button type="button" className={view === 'blocks' ? 'is-active' : ''} onClick={() => setView('blocks')}>Add sections</button>}
          {desktop && <button type="button" className={view === 'design' ? 'is-active' : ''} onClick={() => setView('design')}>Site design</button>}
          {desktop && <button type="button" className={view === 'products' ? 'is-active' : ''} onClick={() => setView('products')}>Products</button>}
          <button type="button" className={view === 'messages' ? 'is-active' : ''} onClick={() => setView('messages')}>Messages{newMessageCount > 0 && <span className="admin-new-count" aria-label={`${newMessageCount} new messages`}>{newMessageCount}</span>}</button>
          <button type="button" className={view === 'replies' ? 'is-active' : ''} onClick={() => setView('replies')}>Reply text</button>
          <button type="button" className={view === 'receipts' ? 'is-active' : ''} onClick={() => setView('receipts')}>Receipts</button>
        </nav>
        {!desktop && <p className="admin-mobile-note">Page editing is available on desktop. You can manage messages, reply text, and receipts here on your phone.</p>}
        {view === 'replies' && <form className="admin-panel admin-reply-form" onSubmit={saveReplies}><p>These opening messages are prepared when you choose an email or WhatsApp reply. You can change them before sending. Use {'{{name}}'} for the visitor’s name.</p><label>Email reply<textarea maxLength={1000} required value={replyTemplates.email} onChange={(event) => setReplyTemplates((current) => ({ ...current, email: event.target.value }))} /></label><label>WhatsApp reply<textarea maxLength={500} required value={replyTemplates.whatsapp} onChange={(event) => setReplyTemplates((current) => ({ ...current, whatsapp: event.target.value }))} /></label><button type="submit" disabled={savingReplies}>{savingReplies ? 'Saving…' : 'Save reply text'}</button></form>}
        {view === 'messages' && <>
        <div className="admin-filters" role="group" aria-label="Filter messages">
          {(['all', 'new', 'read', 'archived'] as const).map((value) => <button type="button" className={filter === value ? 'is-active' : ''} onClick={() => setFilter(value)} key={value}>{value === 'all' ? 'All' : value[0].toUpperCase() + value.slice(1)}</button>)}
        </div>
        <div className="admin-inquiries">
          {visible.length === 0 && <div className="admin-panel"><p>No messages here yet.</p></div>}
          {visible.map((item) => <article className="admin-panel admin-inquiry" key={item.id}>
            <div className="admin-inquiry-top"><span>{item.source === 'hire' ? 'Hire Me enquiry' : 'Contact message'}</span><span className={`admin-badge admin-badge--${item.status}`}>{item.status}</span><time dateTime={item.created_at}>{new Date(item.created_at).toLocaleString()}</time></div>
            <div className="admin-inquiry-heading"><div className="admin-sender-avatar" aria-hidden="true">{item.name.trim().charAt(0).toUpperCase() || '?'}</div><div><h2>{item.name}</h2><a className="admin-sender-email" href={`mailto:${item.email}`}>{item.email}</a></div></div>
            <div className="admin-message-content"><span className="admin-field-label">{item.source === 'hire' ? 'Project' : 'Subject'}</span><h3>{item.subject || item.project_type || 'General enquiry'}</h3><span className="admin-field-label">Message</span><p className="admin-message">{item.message}</p></div>
            {(item.phone || item.whatsapp || item.preferred_contact.length > 0) && <div className="admin-contact-details">{item.phone && <span><strong>Phone</strong>{item.phone}</span>}{item.whatsapp && <span><strong>WhatsApp</strong>{item.whatsapp}</span>}{item.preferred_contact.length > 0 && <span><strong>Preferred reply</strong>{item.preferred_contact.join(', ')}</span>}</div>}
            <div className="admin-actions"><div className="admin-reply-actions"><a href={`mailto:${encodeURIComponent(item.email)}?subject=${encodeURIComponent(`Re: ${item.subject || item.project_type || 'Your message to Mr Ugo'}`)}&body=${encodeURIComponent(formatReply(replyTemplates.email, item.name))}`}>Reply by email</a>{whatsappLink(item.whatsapp, item.name, replyTemplates.whatsapp) && <a className="admin-whatsapp-reply" href={whatsappLink(item.whatsapp, item.name, replyTemplates.whatsapp)!} target="_blank" rel="noopener noreferrer">Reply via WhatsApp</a>}{callLink(item.phone) && <a className="admin-call-reply" href={callLink(item.phone)!}>Call number</a>}</div><div className="admin-manage-actions"><button type="button" onClick={() => { void downloadInquiryPdf(item).catch(() => setNotice('Could not create the PDF. Please try again.')) }}>Download PDF</button>{item.status !== 'read' && <button type="button" onClick={() => { void changeStatus(item, 'read') }}>Mark read</button>}{item.status !== 'archived' && <button type="button" onClick={() => { void changeStatus(item, 'archived') }}>Archive</button>}</div></div>
          </article>)}
        </div>
        </>}
        {view === 'receipts' && <ReceiptsPanel />}
        {desktop && view === 'content' && <form className="admin-panel admin-content-form" onSubmit={saveHero}>
          <div><p className="admin-eyebrow">HOME PAGE</p><h2>Hero section</h2><p>Edit the opening words visitors see. The layout and portrait stay in place.</p></div>
          <div className="admin-hero-preview" aria-label="Unsaved homepage preview"><span>UNSAVED PREVIEW</span><h3 style={{ fontSize: heroDraft.headlineSize === 'large' ? 'clamp(36px,4vw,58px)' : 'clamp(30px,3.3vw,48px)' }}>{heroDraft.headline} <em>{heroDraft.highlight}</em></h3><p>{heroDraft.description}</p><small>{heroDraft.bubble}</small></div>
          <label>Main headline<input value={heroDraft.headline} maxLength={100} required onChange={(event) => setHeroDraft((current) => ({ ...current, headline: event.target.value }))} /></label>
          <label>Highlighted words<input value={heroDraft.highlight} maxLength={100} required onChange={(event) => setHeroDraft((current) => ({ ...current, highlight: event.target.value }))} /></label>
          <label>Short description<textarea value={heroDraft.description} maxLength={500} required onChange={(event) => setHeroDraft((current) => ({ ...current, description: event.target.value }))} /></label>
          <div className="admin-content-row"><label>Portrait caption<input value={heroDraft.bubble} maxLength={80} required onChange={(event) => setHeroDraft((current) => ({ ...current, bubble: event.target.value }))} /></label>
            <label>Headline size<select value={heroDraft.headlineSize} onChange={(event) => setHeroDraft((current) => ({ ...current, headlineSize: event.target.value === 'large' ? 'large' : 'default' }))}><option value="default">Standard</option><option value="large">Large</option></select></label></div>
          <button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
        </form>}
        {desktop && view === 'visual' && <VisualEditor />}
        {desktop && view === 'blocks' && <BlocksEditor />}
        {desktop && view === 'design' && <DesignEditor />}
        {desktop && view === 'products' && <ProductsEditor />}
      </>}
    </div>
  </main>
}
