import { useEffect, useState, type FormEvent } from 'react'
import { cmsPages, loadHiddenPages, loadManagedPages, type ManagedPage } from '../lib/cmsPages'
import { supabase } from '../lib/supabase'
import './PageManager.css'

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)

export default function PageManager({ onChanged }: { onChanged: () => void }) {
  const [open, setOpen] = useState(false)
  const [pages, setPages] = useState<ManagedPage[]>([])
  const [hiddenPages, setHiddenPages] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const refresh = async () => { try { const [managed, hidden] = await Promise.all([loadManagedPages(), loadHiddenPages()]); setPages(managed); setHiddenPages(hidden) } catch (error) { setNotice(`Could not load pages: ${String(error)}`) } }
  useEffect(() => { if (open) void refresh() }, [open])

  const create = async (event: FormEvent) => {
    event.preventDefault()
    if (!supabase) return
    const cleanSlug = slugify(slug || title)
    if (!cleanSlug || !title.trim()) { setNotice('Enter a page title and address.'); return }
    setBusy(true)
    const { error } = await supabase.from('portfolio_pages').insert({ title: title.trim(), slug: cleanSlug, published: false })
    setBusy(false)
    if (error) { setNotice(`Could not create page: ${error.message}`); return }
    setTitle(''); setSlug(''); setNotice('Draft page created. Add sections, then publish it here.')
    await refresh(); onChanged()
  }

  const change = async (page: ManagedPage, values: Partial<ManagedPage>) => {
    if (!supabase) return
    setBusy(true)
    const { error } = await supabase.from('portfolio_pages').update(values).eq('id', page.id)
    setBusy(false)
    setNotice(error ? `Could not update page: ${error.message}` : values.deleted_at ? 'Page removed. You can restore it here.' : 'Page updated.')
    if (!error) { await refresh(); onChanged() }
  }

  const changeBuiltIn = async (path: string, hidden: boolean) => {
    if (!supabase) return
    setBusy(true)
    const updated = await supabase.from('portfolio_page_visibility').update({ hidden }).eq('path', path).select('path')
    const result = updated.error || (updated.data?.length ?? 0) > 0
      ? updated
      : await supabase.from('portfolio_page_visibility').insert({ path, hidden })
    setBusy(false)
    setNotice(result.error ? `Could not update page: ${result.error.message}` : hidden ? 'Page hidden. You can restore it here.' : 'Page restored.')
    if (!result.error) { await refresh(); onChanged() }
  }

  return <>
    <button className="page-manager-open" type="button" onClick={() => setOpen(true)}>+ Manage pages</button>
    {open && <div className="page-manager-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false) }}><section className="page-manager-dialog" role="dialog" aria-modal="true" aria-label="Manage pages">
      <div className="page-manager-head"><div><p className="admin-eyebrow">YOUR SITE</p><h2>Manage pages</h2><p>Create a page, then add sections and publish it.</p></div><button type="button" onClick={() => setOpen(false)} aria-label="Close page manager">×</button></div>
      <form className="page-manager-create" onSubmit={(event) => { void create(event) }}><label>Page name<input value={title} onChange={(event) => { setTitle(event.target.value); setSlug(slugify(event.target.value)) }} placeholder="New page" maxLength={180} required /></label><label>Page address<input value={slug} onChange={(event) => setSlug(slugify(event.target.value))} placeholder="new-page" maxLength={80} required /></label><button type="submit" disabled={busy}>Create draft page</button></form>
      {notice && <p className="admin-notice" role="status">{notice}</p>}
      <div className="page-manager-list"><h3>Your added pages</h3>{pages.length === 0 && <p>No added pages yet.</p>}{pages.map((page) => <div className="page-manager-row" key={page.id}><div><strong>{page.title}</strong><small>/p/{page.slug} · {page.deleted_at ? 'Removed' : page.published ? 'Published' : 'Draft'}</small></div><div>{page.deleted_at ? <button type="button" disabled={busy} onClick={() => { void change(page, { deleted_at: null }) }}>Restore</button> : <><button type="button" disabled={busy} onClick={() => { void change(page, { published: !page.published }) }}>{page.published ? 'Unpublish' : 'Publish'}</button><button type="button" disabled={busy} onClick={() => { void change(page, { published: false, deleted_at: new Date().toISOString() }) }}>Remove</button></>}</div></div>)}</div>
      <div className="page-manager-list"><h3>Existing pages</h3><p className="page-manager-help">Hide an existing page from the website. Its content stays saved, so you can restore it.</p>{cmsPages.filter(([path]) => path !== '/').map(([path, label]) => <div className="page-manager-row" key={path}><div><strong>{label}</strong><small>{path} · {hiddenPages.includes(path) ? 'Hidden' : 'Visible'}</small></div><div><button type="button" disabled={busy} onClick={() => { void changeBuiltIn(path, !hiddenPages.includes(path)) }}>{hiddenPages.includes(path) ? 'Restore' : 'Hide page'}</button></div></div>)}</div>
    </section></div>}
  </>
}
