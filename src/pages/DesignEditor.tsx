import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { applySiteDesign, defaultSiteDesign, type SiteDesign } from '../lib/siteDesign'

const fields: { key: Exclude<keyof SiteDesign, 'font'>; label: string }[] = [
  { key: 'background', label: 'Page background' }, { key: 'surface', label: 'Cards and panels' },
  { key: 'heading', label: 'Headings' }, { key: 'body', label: 'Body text' }, { key: 'accent', label: 'Accent and buttons' },
]

export default function DesignEditor() {
  const [draft, setDraft] = useState<SiteDesign>(defaultSiteDesign)
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!supabase) return
    let active = true
    void supabase.from('portfolio_site_settings').select('settings').eq('id', 'main').single()
      .then(({ data, error }) => {
        if (!active) return
        if (error) setNotice('Could not load site design settings.')
        else if (data?.settings) setDraft({ ...defaultSiteDesign, ...data.settings } as SiteDesign)
      })
    return () => { active = false }
  }, [])

  const save = async () => {
    if (!supabase) return
    setSaving(true)
    const { data, error } = await supabase.from('portfolio_site_settings').update({ settings: draft }).eq('id', 'main').select('id').single()
    setSaving(false)
    if (error || !data) { setNotice('Could not save design settings.'); return }
    applySiteDesign(draft)
    setNotice('Design saved across the website. Refresh an open page to see the update.')
  }

  return <div className="admin-panel admin-content-form admin-design-editor">
    <div><h2>Site-wide design</h2><p>Choose the shared colors and typography. The portfolio stays in its light layout.</p></div>
    {notice && <p className="admin-notice" role="status">{notice}</p>}
    <div className="admin-design-colors">{fields.map(({ key, label }) => <label key={key}>{label}<input type="color" value={draft[key]} onChange={(event) => setDraft((current) => ({ ...current, [key]: event.target.value }))} /></label>)}</div>
    <label>Font family<select value={draft.font} onChange={(event) => setDraft((current) => ({ ...current, font: event.target.value === 'inter' ? 'inter' : 'jakarta' }))}><option value="jakarta">Plus Jakarta Sans</option><option value="inter">Inter</option></select></label>
    <div className="admin-design-swatch" style={{ background: draft.background, color: draft.heading, fontFamily: draft.font === 'inter' ? 'Inter, sans-serif' : '"Plus Jakarta Sans", sans-serif' }}><p style={{ color: draft.accent }}>UNSAVED PREVIEW</p><h3>Practical software for real problems.</h3><span style={{ color: draft.body }}>A quick look at your chosen colors and type.</span><button type="button" style={{ background: draft.accent }}>Explore my work</button></div>
    <button type="button" onClick={() => { void save() }} disabled={saving}>{saving ? 'Saving…' : 'Save site design'}</button>
  </div>
}
