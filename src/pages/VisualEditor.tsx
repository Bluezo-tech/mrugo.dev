import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import { cmsPages, loadManagedPages } from '../lib/cmsPages'
import PageManager from './PageManager'
import { applyCmsStyle, applyResponsiveStyle, cmsPath, editableTextTarget, elementPath, fontChoices, loadPageEdits, pageForElement, safeCmsUrl, type CmsEdit, type CmsStyle, type EditType } from '../lib/visualCms'
import './VisualEditor.css'

type Selection = {
  pagePath: string
  selector: string
  tag: string
  textIndex: number | null
  text: string
  placeholder: string
  imageSrc: string
  imageAlt: string
  videoPoster: string
  linkSelector: string
  linkHref: string
  style: CmsStyle
  mobileStyle: CmsStyle
}

function rgbToHex(value: string) {
  if (/^#[a-f\d]{6}$/i.test(value)) return value
  const parts = value.match(/\d+/g)?.slice(0, 3).map(Number)
  return parts?.length === 3 ? `#${parts.map((part) => part.toString(16).padStart(2, '0')).join('')}` : '#202124'
}

export default function VisualEditor() {
  const successPages: [string, string][] = [['/?cms-success=1', 'Contact sent screen'], ['/hire?cms-success=1', 'Hire Me sent screen']]
  const [path, setPath] = useState<string>('/')
  const [pageOptions, setPageOptions] = useState<[string, string][]>([...cmsPages.map(([url, label]): [string, string] => [url, label]), ...successPages])
  const [width, setWidth] = useState<'desktop' | 'phone'>('desktop')
  const [canvasWidth, setCanvasWidth] = useState(900)
  const [selection, setSelection] = useState<Selection | null>(null)
  const [draft, setDraft] = useState<Selection | null>(null)
  const [styleChanges, setStyleChanges] = useState<string[]>([])
  const [styleScope, setStyleScope] = useState<'desktop' | 'phone'>('desktop')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState('')
  const [edits, setEdits] = useState<CmsEdit[]>([])
  const [areas, setAreas] = useState<{ selector: string; label: string }[]>([])
  const frame = useRef<HTMLIFrameElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const outlined = useRef<HTMLElement | null>(null)
  const clearPreview = useRef<(() => void) | null>(null)
  const areaObserver = useRef<MutationObserver | null>(null)

  const refreshEdits = useCallback(async (page: string) => {
    if (!supabase) return
    try { setEdits(await loadPageEdits(supabase, page)) }
    catch { setNotice('Could not load saved edits for this page.') }
  }, [])

  useEffect(() => { void refreshEdits(path) }, [path, refreshEdits])
  const refreshPages = useCallback(() => { void loadManagedPages().then((pages) => setPageOptions([...cmsPages.map(([url, label]): [string, string] => [url, label]), ...successPages, ...pages.filter((page) => !page.deleted_at).map((page): [string, string] => [`/p/${page.slug}`, `${page.title}${page.published ? '' : ' (draft)'}`])])).catch(() => {}) }, [])
  useEffect(() => { refreshPages() }, [refreshPages])

  useEffect(() => {
    if (!canvas.current) return
    const observer = new ResizeObserver(([entry]) => setCanvasWidth(entry.contentRect.width))
    observer.observe(canvas.current)
    return () => observer.disconnect()
  }, [])

  const selectElement = useCallback((element: Element, page: string, styleOnly = false) => {
    clearPreview.current?.()
    const image = !styleOnly && element.tagName === 'IMG' ? element as HTMLImageElement : null
    const video = !styleOnly && element.tagName === 'VIDEO' ? element as HTMLVideoElement : null
    const input = !styleOnly && ['INPUT', 'TEXTAREA'].includes(element.tagName) ? element as HTMLInputElement | HTMLTextAreaElement : null
    const target = styleOnly || image || video || input ? null : editableTextTarget(element)
    const chosen = target?.element ?? element
    const anchor = chosen.closest('a') as HTMLAnchorElement | null
    const win = chosen.ownerDocument.defaultView
    const computed = win?.getComputedStyle(chosen)
    const savedStyle = edits.find((edit) => edit.page_path === pageForElement(chosen, page) && edit.element_key === elementPath(chosen) && edit.edit_type === 'style')
    const savedMobile = savedStyle?.value.mobile
    if (outlined.current) outlined.current.style.outline = ''
    if (chosen instanceof HTMLElement || chosen.ownerDocument.defaultView?.HTMLElement.prototype.isPrototypeOf(chosen)) {
      const highlighted = chosen as HTMLElement
      highlighted.style.outline = '3px solid #d99724'
      outlined.current = highlighted
    }
    const next: Selection = {
      pagePath: pageForElement(chosen, page), selector: elementPath(chosen), tag: chosen.tagName.toLowerCase(),
      textIndex: target?.index ?? null, text: target?.text ?? '', placeholder: input?.placeholder ?? '',
      imageSrc: image?.getAttribute('src') ?? video?.getAttribute('src') ?? '', imageAlt: image?.alt ?? '', videoPoster: video?.getAttribute('poster') ?? '',
      linkSelector: anchor ? elementPath(anchor) : '', linkHref: anchor?.getAttribute('href') ?? '',
      style: {
        color: rgbToHex(computed?.color ?? ''), backgroundColor: computed?.backgroundColor === 'rgba(0, 0, 0, 0)' ? '' : rgbToHex(computed?.backgroundColor ?? ''),
        fontSize: String(Math.round(parseFloat(computed?.fontSize ?? '16'))),
        fontFamily: fontChoices.find((font) => computed?.fontFamily.toLowerCase().includes(font.toLowerCase())) ?? 'Inter',
        fontWeight: ['400', '500', '600', '700', '800'].includes(computed?.fontWeight ?? '') ? computed?.fontWeight : '400',
        padding: String(Math.round(parseFloat(computed?.paddingTop ?? '0'))),
        marginTop: String(Math.round(parseFloat(computed?.marginTop ?? '0'))),
        marginLeft: String(Math.round(parseFloat(computed?.marginLeft ?? '0'))),
        width: String(Math.round(parseFloat(computed?.width ?? '0') / Math.max(1, parseFloat(win?.getComputedStyle(chosen.parentElement ?? chosen).width ?? '1')) * 100)),
        borderRadius: String(Math.round(parseFloat(computed?.borderTopLeftRadius ?? '0'))),
        textAlign: computed?.textAlign || 'left', gap: String(Math.round(parseFloat(computed?.gap ?? '0')) || 0), order: computed?.order || '0',
        flexDirection: ['row', 'column', 'row-reverse', 'column-reverse'].includes(computed?.flexDirection ?? '') ? computed!.flexDirection : 'row',
        justifyContent: ['start', 'center', 'end', 'space-between'].includes(computed?.justifyContent ?? '') ? computed!.justifyContent : 'start', alignItems: computed?.alignItems || 'stretch',
        animation: (chosen as HTMLElement).dataset?.cmsAnimation || 'none',
      },
      mobileStyle: savedMobile && typeof savedMobile === 'object' ? Object.fromEntries(Object.entries(savedMobile).map(([key, value]) => [key, typeof value === 'string' && value.endsWith('px') ? value.slice(0, -2) : typeof value === 'string' && value.endsWith('%') ? value.slice(0, -1) : value])) as CmsStyle : {},
    }
    setSelection(next)
    setDraft(next)
    setStyleChanges([])
    setStyleScope('desktop')
    setNotice('')
  }, [edits])

  const onFrameLoad = useCallback(() => {
    const document = frame.current?.contentDocument
    if (!document) return
    areaObserver.current?.disconnect()
    clearPreview.current?.()
    document.body.dataset.cmsPreview = 'false'
    const collectAreas = () => {
      const candidates = Array.from(document.querySelectorAll('.site-header, main > section, main section, main > article, main article, main, .site-footer'))
      const unique = candidates.filter((element, index) => candidates.indexOf(element) === index)
      setAreas(unique.slice(0, 100).map((element) => {
        const title = element.querySelector('h1,h2,h3')?.textContent?.trim() || element.getAttribute('aria-label') || element.id || element.className || element.tagName.toLowerCase()
        return { selector: elementPath(element), label: `${element.tagName.toLowerCase()} · ${String(title).slice(0, 70)}` }
      }))
    }
    collectAreas()
    window.setTimeout(collectAreas, 600)
    let scheduled = false
    const observer = new MutationObserver(() => {
      if (scheduled) return
      scheduled = true
      window.requestAnimationFrame(() => { scheduled = false; collectAreas() })
    })
    observer.observe(document.body, { childList: true, subtree: true })
    areaObserver.current = observer
    const listener = (event: MouseEvent) => {
      const element = event.target as Element | null
      if (!element || !element.closest('body')) return
      event.preventDefault()
      event.stopPropagation()
      const media = element.closest('img,video')
      selectElement(media ?? element, cmsPath(frame.current?.contentWindow?.location.pathname || path))
    }
    document.addEventListener('click', listener, true)
  }, [path, selectElement])

  const update = (change: Partial<Selection>) => setDraft((current) => current ? { ...current, ...change } : null)
  const updateStyle = (key: keyof CmsStyle, value: string) => {
    setStyleChanges((current) => [...new Set([...current, `${styleScope}:${key}`])])
    setDraft((current) => current ? styleScope === 'phone'
      ? { ...current, mobileStyle: { ...current.mobileStyle, [key]: value } }
      : { ...current, style: { ...current.style, [key]: value } } : null)
  }

  useEffect(() => {
    clearPreview.current?.()
    if (!draft || !selection) return
    const doc = frame.current?.contentDocument
    if (!doc) return
    let element: Element | null = null
    try { element = doc.querySelector(draft.selector) } catch { return }
    if (!element) return
    const textNode = draft.textIndex !== null ? Array.from(element.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE)[draft.textIndex] : null
    const originalText = textNode?.nodeValue
    const html = element.namespaceURI === 'http://www.w3.org/1999/xhtml' ? element as HTMLElement : null
    const originalStyle = html?.style.cssText ?? ''
    const originalAnimation = html?.dataset.cmsAnimation
    const input = ['INPUT', 'TEXTAREA'].includes(element.tagName) ? element as HTMLInputElement | HTMLTextAreaElement : null
    const originalPlaceholder = input?.placeholder
    const image = element.tagName === 'IMG' ? element as HTMLImageElement : null
    const video = element.tagName === 'VIDEO' ? element as HTMLVideoElement : null
    const originalSrc = image?.getAttribute('src') ?? video?.getAttribute('src')
    const originalAlt = image?.alt
    const originalPoster = video?.getAttribute('poster')
    const link = draft.linkSelector ? doc.querySelector(draft.linkSelector) as HTMLAnchorElement | null : null
    const originalHref = link?.getAttribute('href')
    const previewStyleId = 'cms-draft-responsive-style'
    const savedStyle = edits.find((edit) => edit.page_path === draft.pagePath && edit.element_key === draft.selector && edit.edit_type === 'style')
    doc.body.dataset.cmsPreview = 'true'
    if (textNode && draft.textIndex !== null) textNode.nodeValue = draft.text
    if (input) input.placeholder = draft.placeholder
    if (image && draft.imageSrc && safeCmsUrl(draft.imageSrc, true)) image.src = draft.imageSrc
    if (image) image.alt = draft.imageAlt
    if (video && draft.imageSrc && safeCmsUrl(draft.imageSrc)) video.src = draft.imageSrc
    if (video && draft.videoPoster && safeCmsUrl(draft.videoPoster, true)) video.poster = draft.videoPoster
    if (link && draft.linkHref && safeCmsUrl(draft.linkHref)) link.setAttribute('href', draft.linkHref)
    if (html) {
      const desktop: Record<string, string> = {}
      const mobile: Record<string, string> = { ...(savedStyle?.value.mobile as Record<string, string> | undefined) }
      for (const change of styleChanges) {
        const [scope, key] = change.split(':') as ['desktop' | 'phone', keyof CmsStyle]
        const raw = (scope === 'phone' ? draft.mobileStyle : draft.style)[key] ?? ''
        const value = ['fontSize', 'padding', 'marginTop', 'marginLeft', 'borderRadius', 'gap'].includes(key) && raw ? `${raw}px` : key === 'width' && raw ? `${raw}%` : raw
        if (scope === 'phone') mobile[key] = value
        else desktop[key] = value
      }
      applyCmsStyle(html, desktop)
      applyResponsiveStyle(doc, draft.selector, mobile, previewStyleId)
    }
    const restore = () => {
      if (textNode) textNode.nodeValue = originalText ?? ''
      if (input) input.placeholder = originalPlaceholder ?? ''
      if (image) { if (originalSrc === null) image.removeAttribute('src'); else image.setAttribute('src', originalSrc ?? ''); image.alt = originalAlt ?? '' }
      if (video) { if (originalSrc === null) video.removeAttribute('src'); else video.setAttribute('src', originalSrc ?? ''); if (originalPoster === null) video.removeAttribute('poster'); else video.setAttribute('poster', originalPoster ?? '') }
      if (link) { if (originalHref === null) link.removeAttribute('href'); else link.setAttribute('href', originalHref ?? '') }
      if (html) { html.style.cssText = originalStyle; if (originalAnimation === undefined) delete html.dataset.cmsAnimation; else html.dataset.cmsAnimation = originalAnimation }
      doc.getElementById(previewStyleId)?.remove()
      doc.body.dataset.cmsPreview = 'false'
    }
    clearPreview.current = restore
    return () => { restore(); if (clearPreview.current === restore) clearPreview.current = null }
  }, [draft, selection, styleChanges, edits])

  const uploadImage = async (file: File | undefined) => {
    if (!supabase || !file) return
    const extensions: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' }
    const extension = extensions[file.type]
    if (!extension || file.size > 5 * 1024 * 1024) { setNotice('Choose a JPG, PNG, WebP, GIF, or AVIF image under 5 MB.'); return }
    setUploading(true)
    const name = `${crypto.randomUUID()}.${extension}`
    const { error } = await supabase.storage.from('portfolio-media').upload(name, file, { contentType: file.type, upsert: false })
    if (error) setNotice(`Image upload failed: ${error.message}`)
    else {
      const { data } = supabase.storage.from('portfolio-media').getPublicUrl(name)
      update({ imageSrc: data.publicUrl })
      setNotice('Image uploaded. Save this element to use it on the page.')
    }
    setUploading(false)
  }

  const save = async () => {
    if (!supabase || !draft) return
    if (draft.imageSrc !== selection?.imageSrc && draft.imageSrc && !safeCmsUrl(draft.imageSrc, true)) { setNotice('Use an HTTPS image address or a path on this site.'); return }
    if (draft.videoPoster && draft.videoPoster !== selection?.videoPoster && !safeCmsUrl(draft.videoPoster, true)) { setNotice('Use an HTTPS poster image address or a path on this site.'); return }
    if (draft.linkHref !== selection?.linkHref && draft.linkHref && !safeCmsUrl(draft.linkHref)) { setNotice('Use an HTTPS link or a path on this site.'); return }
    const rows: { page_path: string; element_key: string; edit_type: EditType; value: Record<string, unknown> }[] = []
    if (draft.textIndex !== null && draft.text !== selection?.text) rows.push({ page_path: draft.pagePath, element_key: `${draft.selector}::text:${draft.textIndex}`, edit_type: 'text', value: { text: draft.text } })
    if (['input', 'textarea'].includes(draft.tag) && draft.placeholder !== selection?.placeholder) rows.push({ page_path: draft.pagePath, element_key: draft.selector, edit_type: 'text', value: { placeholder: draft.placeholder } })
    if (draft.tag === 'img' && (draft.imageSrc !== selection?.imageSrc || draft.imageAlt !== selection?.imageAlt)) rows.push({ page_path: draft.pagePath, element_key: draft.selector, edit_type: 'image', value: { src: draft.imageSrc, alt: draft.imageAlt } })
    if (draft.tag === 'video' && (draft.imageSrc !== selection?.imageSrc || draft.videoPoster !== selection?.videoPoster)) rows.push({ page_path: draft.pagePath, element_key: draft.selector, edit_type: 'video', value: { src: draft.imageSrc, poster: draft.videoPoster } })
    if (draft.linkSelector && draft.linkHref !== selection?.linkHref) rows.push({ page_path: draft.pagePath, element_key: draft.linkSelector, edit_type: 'link', value: { href: draft.linkHref } })
    if (styleChanges.length) {
      const saved = edits.find((edit) => edit.page_path === draft.pagePath && edit.element_key === draft.selector && edit.edit_type === 'style')
      const value: Record<string, unknown> = { ...saved?.value }
      const mobile: Record<string, unknown> = { ...(saved?.value.mobile as Record<string, unknown> | undefined) }
      for (const change of styleChanges) {
        const [scope, key] = change.split(':') as ['desktop' | 'phone', keyof CmsStyle]
        const raw = (scope === 'phone' ? draft.mobileStyle : draft.style)[key] ?? ''
        const formatted = ['fontSize', 'padding', 'marginTop', 'marginLeft', 'borderRadius', 'gap'].includes(key) && raw ? `${raw}px` : key === 'width' && raw ? `${raw}%` : raw
        if (scope === 'phone') mobile[key] = formatted
        else value[key] = formatted
      }
      value.mobile = mobile
      rows.push({ page_path: draft.pagePath, element_key: draft.selector, edit_type: 'style', value })
    }
    if (!rows.length) { setNotice('Change a field first, then save.'); return }
    setSaving(true)
    let error: { message: string } | null = null
    for (const row of rows) {
      const existing = edits.some((edit) => edit.page_path === row.page_path && edit.element_key === row.element_key && edit.edit_type === row.edit_type)
      const result = existing
        ? await supabase.from('portfolio_edits').update({ value: row.value }).eq('page_path', row.page_path).eq('element_key', row.element_key).eq('edit_type', row.edit_type)
        : await supabase.from('portfolio_edits').insert(row)
      if (result.error) { error = result.error; break }
    }
    setSaving(false)
    if (error) { setNotice(`Could not save: ${error.message}`); return }
    setNotice('Saved. The page preview is refreshing.')
    setSelection(null); setDraft(null); setStyleChanges([])
    frame.current?.contentWindow?.location.reload()
    void refreshEdits(path)
  }

  const reset = async () => {
    if (!supabase || !selection) return
    const keys = [selection.selector, `${selection.selector}::text:${selection.textIndex}`, selection.linkSelector].filter(Boolean)
    const { error } = await supabase.from('portfolio_edits').delete().eq('page_path', selection.pagePath).in('element_key', keys)
    if (error) { setNotice(`Could not reset: ${error.message}`); return }
    setNotice('Saved edits for this element removed.')
    setSelection(null); setDraft(null)
    frame.current?.contentWindow?.location.reload()
    void refreshEdits(path)
  }

  const hiddenEdits = edits.filter((edit) => edit.edit_type === 'style' && (edit.value.display === 'none' || (edit.value.mobile as CmsStyle | undefined)?.display === 'none'))
  const restoreHidden = async (edit: CmsEdit) => {
    if (!supabase) return
    const value = { ...edit.value }
    const mobile = { ...(value.mobile as Record<string, unknown> | undefined) }
    delete value.display
    delete mobile.display
    value.mobile = mobile
    const { error } = await supabase.from('portfolio_edits').update({ value }).eq('page_path', edit.page_path).eq('element_key', edit.element_key).eq('edit_type', 'style')
    if (error) { setNotice(`Could not restore this item: ${error.message}`); return }
    setNotice('Item restored on the site.')
    frame.current?.contentWindow?.location.reload()
    void refreshEdits(path)
  }

  const activeStyle = draft ? { ...draft.style, ...(styleScope === 'phone' ? draft.mobileStyle : {}) } : {}
  const isHidden = Boolean(draft && (styleChanges.includes('desktop:display') && styleChanges.includes('phone:display')
    ? draft.style.display === 'none' && draft.mobileStyle.display === 'none'
    : edits.some((edit) => edit.page_path === draft.pagePath && edit.element_key === draft.selector && edit.edit_type === 'style' && edit.value.display === 'none' && (edit.value.mobile as CmsStyle | undefined)?.display === 'none')))
  const toggleHidden = () => {
    if (!draft) return
    const display = isHidden ? '' : 'none'
    setDraft((current) => current ? { ...current, style: { ...current.style, display }, mobileStyle: { ...current.mobileStyle, display } } : null)
    setStyleChanges((current) => [...new Set([...current, 'desktop:display', 'phone:display'])])
    setNotice(isHidden ? 'This item will return after you save.' : 'This item will be hidden on desktop and phone after you save. You can restore it later.')
  }
  const previewWidth = width === 'phone' ? 390 : 1280
  const previewScale = Math.min(1, Math.max(0.25, (canvasWidth - 24) / previewWidth))

  return <div className="visual-editor">
    <div className="visual-editor-toolbar">
      <label className="visual-editor-page-select">Page <select value={path} onChange={(event) => { setPath(event.target.value); setSelection(null); setDraft(null); setNotice('') }}>{pageOptions.map(([url, label]) => <option key={url} value={url}>{label}</option>)}</select></label>
      <label>Area <select value="" onChange={(event) => {
        const element = frame.current?.contentDocument?.querySelector(event.target.value)
        if (element) { element.scrollIntoView({ block: 'center', behavior: 'smooth' }); selectElement(element, path, true) }
      }}><option value="">Choose an area…</option>{areas.map((area) => <option value={area.selector} key={area.selector}>{area.label}</option>)}</select></label>
      <div className="visual-editor-width" role="group" aria-label="Preview width"><button type="button" className={width === 'desktop' ? 'active' : ''} onClick={() => setWidth('desktop')}>Desktop</button><button type="button" className={width === 'phone' ? 'active' : ''} onClick={() => setWidth('phone')}>Phone</button></div>
      <PageManager onChanged={() => { refreshPages(); if (path.startsWith('/p/')) setPath('/') }} />
      <a href={path} target="_blank" rel="noreferrer">Open page ↗</a>
    </div>
    <p className="visual-editor-hint">Select an area or click the preview to edit it. Changes appear before you save.</p>
    {notice && <p className="admin-notice" role="status">{notice}</p>}
    <div className="visual-editor-workspace">
      <aside className="visual-editor-pages" aria-label="Site pages"><p>YOUR PAGES</p>{pageOptions.map(([url, label]) => <button key={url} type="button" className={path === url ? 'active' : ''} onClick={() => { setPath(url); setSelection(null); setDraft(null); setNotice('') }}><span>{url === '/' ? '⌂' : '▤'}</span>{label}</button>)}</aside>
      <div className="visual-editor-canvas" ref={canvas}><div className="visual-editor-frame-holder" style={{ width: previewWidth * previewScale, height: 900 * previewScale }}><iframe ref={frame} title={`${pageOptions.find(([url]) => url === path)?.[1]} preview`} src={path} onLoad={onFrameLoad} style={{ width: previewWidth, height: 900, transform: `scale(${previewScale})` }} /></div></div>
      <aside className="visual-editor-inspector" aria-label="Selected element editor">
        {!draft ? <div className="visual-editor-empty"><h2>Select something to edit</h2><p>The page is live in the preview. Click a heading, paragraph, image, link, or section.</p><p>{edits.length} saved edit{edits.length === 1 ? '' : 's'} on this page and shared site areas.</p>{hiddenEdits.length > 0 && <div className="visual-editor-hidden-list"><h3>Hidden items</h3>{hiddenEdits.map((edit) => <div key={`${edit.page_path}:${edit.element_key}`}><span>{frame.current?.contentDocument?.querySelector(edit.element_key)?.textContent?.trim().slice(0, 60) || edit.element_key}</span><button type="button" onClick={() => { void restoreHidden(edit) }}>Restore</button></div>)}</div>}</div> : <>
          <p className="admin-eyebrow">SELECTED ELEMENT</p><h2>{draft.tag.toUpperCase()}</h2><p className="visual-editor-location">{draft.pagePath === '*' ? 'Shared across pages' : draft.pagePath}</p>
          {draft.textIndex !== null && <label>Text<textarea value={draft.text} maxLength={2000} onChange={(event) => update({ text: event.target.value })} rows={4} /></label>}
          {['input', 'textarea'].includes(draft.tag) && <label>Placeholder<input value={draft.placeholder} maxLength={200} onChange={(event) => update({ placeholder: event.target.value })} /></label>}
          {draft.tag === 'img' && <><label>Upload a replacement image<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" disabled={uploading} onChange={(event) => { void uploadImage(event.target.files?.[0]) }} /></label>{uploading && <p role="status">Uploading image…</p>}<label>Image address<input value={draft.imageSrc} onChange={(event) => update({ imageSrc: event.target.value })} /></label><label>Image description<input value={draft.imageAlt} onChange={(event) => update({ imageAlt: event.target.value })} /></label></>}
          {draft.tag === 'video' && <><label>Video address<input value={draft.imageSrc} onChange={(event) => update({ imageSrc: event.target.value })} /></label><label>Poster image address<input value={draft.videoPoster} onChange={(event) => update({ videoPoster: event.target.value })} /></label></>}
          {draft.linkSelector && <label>Link destination<input value={draft.linkHref} onChange={(event) => update({ linkHref: event.target.value })} /></label>}
          <button type="button" className="visual-editor-section-button" onClick={() => {
            const doc = frame.current?.contentDocument
            const el = doc?.querySelector(selection?.selector ?? '')
            const section = el?.closest('section, article, header, footer, nav, main, .site-header, .site-footer')
            if (section) selectElement(section, path, true)
          }}>Edit containing section</button>
          <button type="button" className="visual-editor-section-button" onClick={toggleHidden}>{isHidden ? 'Restore on site' : 'Hide from site'}</button>
          <div className="visual-editor-scope" role="group" aria-label="Appearance for device"><button type="button" className={styleScope === 'desktop' ? 'active' : ''} onClick={() => setStyleScope('desktop')}>Base / desktop</button><button type="button" className={styleScope === 'phone' ? 'active' : ''} onClick={() => { setStyleScope('phone'); setWidth('phone') }}>Phone override</button></div>
          <details className="visual-editor-style" open><summary>Appearance and position</summary>
            <div className="visual-editor-style-grid">
              <label>Text color<input type="color" value={activeStyle.color || '#202124'} onChange={(event) => updateStyle('color', event.target.value)} /></label>
              <label>Background<input type="color" value={activeStyle.backgroundColor || '#ffffff'} onChange={(event) => updateStyle('backgroundColor', event.target.value)} /></label>
              <label>Font style<select value={activeStyle.fontFamily || 'Inter'} onChange={(event) => updateStyle('fontFamily', event.target.value)}>{fontChoices.map((font) => <option value={font} key={font}>{font}</option>)}</select></label>
              <label>Font weight<select value={activeStyle.fontWeight || '400'} onChange={(event) => updateStyle('fontWeight', event.target.value)}><option value="400">Regular</option><option value="500">Medium</option><option value="600">Semibold</option><option value="700">Bold</option><option value="800">Extra bold</option></select></label>
              <label>Font size (px)<input type="number" min="10" max="100" value={activeStyle.fontSize || ''} onChange={(event) => updateStyle('fontSize', event.target.value)} /></label>
              <label>Move down / up (px)<input type="number" min="-160" max="160" value={activeStyle.marginTop || '0'} onChange={(event) => updateStyle('marginTop', event.target.value)} /></label>
              <label>Move right / left (px)<input type="number" min="-160" max="160" value={activeStyle.marginLeft || '0'} onChange={(event) => updateStyle('marginLeft', event.target.value)} /></label>
              <label>Width (%)<input type="number" min="10" max="100" value={activeStyle.width || ''} onChange={(event) => updateStyle('width', event.target.value)} /></label>
              <label>Inner spacing (px)<input type="number" min="0" max="160" value={activeStyle.padding || '0'} onChange={(event) => updateStyle('padding', event.target.value)} /></label>
              <label>Corner radius (px)<input type="number" min="0" max="80" value={activeStyle.borderRadius || '0'} onChange={(event) => updateStyle('borderRadius', event.target.value)} /></label>
              <label>Alignment<select value={activeStyle.textAlign || 'left'} onChange={(event) => updateStyle('textAlign', event.target.value)}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label>
              <label>Visibility<select value={styleScope === 'phone' ? draft.mobileStyle.display || '' : draft.style.display || ''} onChange={(event) => updateStyle('display', event.target.value)}><option value="">Keep page layout</option><option value="block">Show as block</option><option value="inline-flex">Show as button</option><option value="flex">Show as row or column</option><option value="grid">Show as grid</option><option value="none">Hide</option></select></label>
              <label>Order within a row or grid<input type="number" min="-20" max="20" value={activeStyle.order || '0'} onChange={(event) => updateStyle('order', event.target.value)} /></label>
              <label>Items direction<select value={activeStyle.flexDirection || 'row'} onChange={(event) => updateStyle('flexDirection', event.target.value)}><option value="row">Across</option><option value="column">Stacked</option><option value="row-reverse">Across reversed</option><option value="column-reverse">Stacked reversed</option></select></label>
              <label>Items spacing (px)<input type="number" min="0" max="160" value={activeStyle.gap || '0'} onChange={(event) => updateStyle('gap', event.target.value)} /></label>
              <label>Items position<select value={activeStyle.justifyContent || 'start'} onChange={(event) => updateStyle('justifyContent', event.target.value)}><option value="start">Start</option><option value="center">Center</option><option value="end">End</option><option value="space-between">Spread out</option></select></label>
              <label>Motion<select value={activeStyle.animation || 'none'} onChange={(event) => updateStyle('animation', event.target.value)}><option value="none">None</option><option value="fade">Fade in</option><option value="float">Gentle float</option></select></label>
            </div>
          </details>
          <div className="visual-editor-actions"><button type="button" onClick={() => { void save() }} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button><button type="button" onClick={() => { void reset() }}>Reset element</button></div>
        </>}
      </aside>
    </div>
  </div>
}
