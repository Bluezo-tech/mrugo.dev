import { useCallback, useEffect, useRef, useState } from 'react'
import { cmsPages, loadManagedPages } from '../lib/cmsPages'
import { newBlock, type PortfolioBlock } from '../lib/blocks'
import { Block } from '../components/CmsBlocks'
import { supabase } from '../lib/supabase'
import { fontChoices, safeCmsUrl } from '../lib/visualCms'
import './BlocksEditor.css'
import './BlocksEditorPremium.css'

export default function BlocksEditor() {
  const [page, setPage] = useState('/')
  const [pageOptions, setPageOptions] = useState<[string, string][]>(cmsPages.map(([url, label]) => [url, label]))
  const [blocks, setBlocks] = useState<PortfolioBlock[]>([])
  const [selected, setSelected] = useState<PortfolioBlock | null>(null)
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [previewWidth, setPreviewWidth] = useState<'desktop' | 'phone'>('desktop')
  const [removeArmed, setRemoveArmed] = useState(false)
  const requestId = useRef(0)

  const refresh = useCallback(async (path: string) => {
    if (!supabase) return
    const currentRequest = ++requestId.current
    const { data, error } = await supabase.from('portfolio_blocks')
      .select('id,page_path,slot,sort_order,block_type,title,body,media_url,link_label,link_url,appearance,published')
      .eq('page_path', path).order('slot').order('sort_order')
    if (currentRequest !== requestId.current) return
    if (error) setNotice(`Could not load sections: ${error.message}`)
    else setBlocks((data ?? []) as PortfolioBlock[])
  }, [])

  useEffect(() => { setBlocks([]); setSelected(null); setRemoveArmed(false); void refresh(page) }, [page, refresh])
  useEffect(() => { void loadManagedPages().then((pages) => setPageOptions([...cmsPages.map(([url, label]): [string, string] => [url, label]), ...pages.filter((item) => !item.deleted_at).map((item): [string, string] => [`/p/${item.slug}`, item.title])])).catch(() => {}) }, [])
  const update = (change: Partial<PortfolioBlock>) => setSelected((current) => current ? { ...current, ...change } : null)
  const appearance = (change: Partial<PortfolioBlock['appearance']>) => setSelected((current) => current ? { ...current, appearance: { ...current.appearance, ...change } } : null)

  const add = async (social = false) => {
    if (!supabase) return
    setBusy(true)
    const starter = { ...newBlock(page), slot: social ? 'socials' as const : 'after' as const, block_type: social ? 'social' as const : 'text' as const, sort_order: (Math.max(0, ...blocks.map((item) => item.sort_order)) + 100) }
    const { data, error } = await supabase.from('portfolio_blocks').insert(starter).select('id,page_path,slot,sort_order,block_type,title,body,media_url,link_label,link_url,appearance,published').single()
    setBusy(false)
    if (error || !data) { setNotice(`Could not add section: ${error?.message || 'No row returned'}`); return }
    setSelected(data as PortfolioBlock)
    setNotice('New draft section created. Add content, then publish it when ready.')
    void refresh(page)
  }

  const save = async () => {
    if (!supabase || !selected) return
    if (selected.media_url && !safeCmsUrl(selected.media_url, true)) { setNotice('Use an HTTPS image address or a path on this site.'); return }
    if (selected.link_url && !safeCmsUrl(selected.link_url)) { setNotice('Use an HTTPS link or a path on this site.'); return }
    if (selected.published && !selected.title.trim() && !selected.body.trim() && !selected.media_url) { setNotice('Add content before publishing.'); return }
    setBusy(true)
    const { data, error } = await supabase.from('portfolio_blocks').update({
      slot: selected.slot, sort_order: selected.sort_order, block_type: selected.block_type,
      title: selected.title.trim(), body: selected.body.trim(), media_url: selected.media_url.trim(),
      link_label: selected.link_label.trim(), link_url: selected.link_url.trim(),
      appearance: selected.appearance, published: selected.published,
    }).eq('id', selected.id).select('id').single()
    setBusy(false)
    setNotice(error || !data ? `Could not save section: ${error?.message || 'No row returned'}` : selected.published ? 'Section is saved and visible on the page.' : 'Draft saved. It is visible only in the CMS.')
    if (!error) void refresh(page)
  }

  const move = async (block: PortfolioBlock, direction: -1 | 1) => {
    if (!supabase) return
    const siblings = blocks.filter((item) => item.slot === block.slot).sort((a, b) => a.sort_order - b.sort_order)
    const index = siblings.findIndex((item) => item.id === block.id)
    const other = siblings[index + direction]
    if (!other) return
    const first = await supabase.from('portfolio_blocks').update({ sort_order: other.sort_order }).eq('id', block.id)
    const second = first.error ? null : await supabase.from('portfolio_blocks').update({ sort_order: block.sort_order }).eq('id', other.id)
    if (first.error || second?.error) setNotice('Could not reorder the sections. Please try again.')
    else { setNotice('Section order updated.'); if (selected?.id === block.id) update({ sort_order: other.sort_order }) }
    void refresh(page)
  }

  const upload = async (file: File | undefined) => {
    if (!supabase || !file) return
    const formats: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' }
    if (!formats[file.type] || file.size > 5 * 1024 * 1024) { setNotice('Choose an image under 5 MB.'); return }
    setBusy(true)
    const name = `${crypto.randomUUID()}.${formats[file.type]}`
    const { error } = await supabase.storage.from('portfolio-media').upload(name, file, { contentType: file.type })
    setBusy(false)
    if (error) { setNotice(`Upload failed: ${error.message}`); return }
    update({ media_url: supabase.storage.from('portfolio-media').getPublicUrl(name).data.publicUrl })
    setNotice('Image uploaded. Save the section to use it.')
  }

  const remove = async () => {
    if (!supabase || !selected) return
    if (!removeArmed) { setRemoveArmed(true); setNotice('Select Confirm removal to delete this section.'); return }
    const { error } = await supabase.from('portfolio_blocks').delete().eq('id', selected.id)
    if (error) { setNotice(`Could not remove section: ${error.message}`); return }
    setSelected(null); setRemoveArmed(false); setNotice('Section removed.'); void refresh(page)
  }

  return <div className="blocks-editor">
    <div className="blocks-editor-head"><div><span className="blocks-editor-kicker">CONTENT / SECTIONS</span><label>Editing page<select value={page} onChange={(event) => { setPage(event.target.value); setNotice('') }}>{pageOptions.map(([path, name]) => <option key={path} value={path}>{name}</option>)}</select></label></div><a href={page} target="_blank" rel="noreferrer">View page <span aria-hidden="true">↗</span></a></div>
    {notice && <p className="admin-notice" role="status">{notice}</p>}
    <div className="blocks-editor-grid"><div className="blocks-editor-list"><div className="blocks-editor-list-head"><div><span className="blocks-editor-kicker">PAGE STRUCTURE</span><h2>Sections <small>{blocks.length}</small></h2></div></div>
      <div className="blocks-editor-create"><button type="button" onClick={() => { void add() }} disabled={busy}><span aria-hidden="true">＋</span> Add section</button>{page === '/' && <button type="button" onClick={() => { void add(true) }} disabled={busy}><span aria-hidden="true">＋</span> Social card</button>}</div>
      {blocks.length === 0 && <div className="blocks-editor-muted"><strong>No added sections yet</strong><span>Add text, images, or a call to action to this page.</span></div>}
      {blocks.map((block, index) => <div className={`blocks-editor-row${selected?.id === block.id ? ' selected' : ''}`} key={block.id}><span className="blocks-editor-index">{String(index + 1).padStart(2, '0')}</span><button type="button" onClick={() => { setSelected(block); setRemoveArmed(false) }}><strong>{block.title || 'Untitled section'}</strong><span>{block.slot === 'before' ? 'Top of page' : block.slot === 'socials' ? 'Social grid' : 'Bottom of page'} <span aria-hidden="true">·</span> {block.published ? 'Live' : 'Draft'}</span></button><div><button type="button" aria-label={`Move ${block.title || 'section'} up`} onClick={() => { void move(block, -1) }}>↑</button><button type="button" aria-label={`Move ${block.title || 'section'} down`} onClick={() => { void move(block, 1) }}>↓</button></div></div>)}
    </div>
    <div className="blocks-editor-fields">{!selected ? <div className="blocks-editor-empty"><div className="blocks-editor-empty-art" aria-hidden="true"><div className="blocks-editor-empty-art-bar" /><div className="blocks-editor-empty-art-body"><span /><span /><span /></div><div className="blocks-editor-empty-art-image" /></div><span className="blocks-editor-kicker">READY WHEN YOU ARE</span><h2>Shape this page.</h2><p>Select a section on the left to edit it, or add a new one to build out the page.</p><button type="button" onClick={() => { void add() }} disabled={busy}>Add a section <span aria-hidden="true">↗</span></button></div> : <>
      <div className="blocks-editor-fields-head"><h2>Edit section</h2><span className={selected.published ? 'is-published' : ''}>{selected.published ? 'Published' : 'Draft'}</span></div>
      <div className="blocks-editor-pair"><label>Layout<select value={selected.block_type} onChange={(event) => update({ block_type: event.target.value as PortfolioBlock['block_type'] })}><option value="text">Text</option><option value="split">Image and text</option><option value="image">Large image</option><option value="cta">Call to action</option>{page === '/' && <option value="social">Social card</option>}</select></label><label>Position<select value={selected.slot} onChange={(event) => update({ slot: event.target.value as PortfolioBlock['slot'], block_type: event.target.value === 'socials' ? 'social' : selected.block_type === 'social' ? 'text' : selected.block_type })}><option value="before">Before page</option><option value="after">After page</option>{page === '/' && <option value="socials">Inside social grid</option>}</select></label></div>
      <label>Heading<input maxLength={180} value={selected.title} onChange={(event) => update({ title: event.target.value })} /></label>
      <label>Text<textarea maxLength={5000} rows={6} value={selected.body} onChange={(event) => update({ body: event.target.value })} /></label>
      {['split', 'image', 'social'].includes(selected.block_type) && <><label>{selected.block_type === 'social' ? 'Platform icon (optional)' : 'Image file'}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={(event) => { void upload(event.target.files?.[0]) }} /></label><label>Image address<input value={selected.media_url} onChange={(event) => update({ media_url: event.target.value })} /></label>{selected.media_url && safeCmsUrl(selected.media_url, true) && <img className="blocks-editor-image-preview" src={selected.media_url} alt="Section preview" />}</>}
      <div className="blocks-editor-pair"><label>Button text<input maxLength={100} value={selected.link_label} onChange={(event) => update({ link_label: event.target.value })} /></label><label>Button link<input value={selected.link_url} onChange={(event) => update({ link_url: event.target.value })} /></label></div>
      <details open><summary>Colors and spacing</summary><div className="blocks-editor-pair"><label>Background<input type="color" value={selected.appearance.background || '#ffffff'} onChange={(event) => appearance({ background: event.target.value })} /></label><label>Text<input type="color" value={selected.appearance.color || '#202124'} onChange={(event) => appearance({ color: event.target.value })} /></label><label>Font style<select value={selected.appearance.fontFamily || 'Inter'} onChange={(event) => appearance({ fontFamily: event.target.value })}>{fontChoices.map((font) => <option key={font}>{font}</option>)}</select></label><label>Text alignment<select value={selected.appearance.align || 'left'} onChange={(event) => appearance({ align: event.target.value as 'left' | 'center' })}><option value="left">Left</option><option value="center">Center</option></select></label><label>Vertical padding<input type="number" min="12" max="100" value={selected.appearance.padding ?? 48} onChange={(event) => appearance({ padding: Number(event.target.value) })} /></label><label>Phone padding<input type="number" min="12" max="100" value={selected.appearance.mobilePadding ?? selected.appearance.padding ?? 48} onChange={(event) => appearance({ mobilePadding: Number(event.target.value) })} /></label><label>Phone alignment<select value={selected.appearance.mobileAlign || selected.appearance.align || 'left'} onChange={(event) => appearance({ mobileAlign: event.target.value as 'left' | 'center' })}><option value="left">Left</option><option value="center">Center</option></select></label></div><label className="blocks-editor-publish"><input type="checkbox" checked={Boolean(selected.appearance.mobileHidden)} onChange={(event) => appearance({ mobileHidden: event.target.checked })} /> Hide this section on phones</label></details>
      <div className="blocks-editor-preview-head"><strong>Unsaved preview</strong><div role="group" aria-label="Section preview width"><button type="button" className={previewWidth === 'desktop' ? 'active' : ''} onClick={() => setPreviewWidth('desktop')}>Desktop</button><button type="button" className={previewWidth === 'phone' ? 'active' : ''} onClick={() => setPreviewWidth('phone')}>Phone</button></div></div>
      <div className={`blocks-editor-preview blocks-editor-preview--${previewWidth}`} onClickCapture={(event) => { if ((event.target as HTMLElement).closest('a')) event.preventDefault() }}><Block block={selected} /></div>
      <label className="blocks-editor-publish"><input type="checkbox" checked={selected.published} onChange={(event) => update({ published: event.target.checked })} /> Publish on the website</label>
      <div className="blocks-editor-actions"><button type="button" onClick={() => { void save() }} disabled={busy}>Save section</button><button type="button" onClick={() => { void remove() }} disabled={busy}>{removeArmed ? 'Confirm removal' : 'Remove'}</button>{removeArmed && <button type="button" onClick={() => { setRemoveArmed(false); setNotice('Removal cancelled.') }}>Cancel</button>}</div>
    </>}</div></div>
  </div>
}
