import type { SupabaseClient } from '@supabase/supabase-js'

export type EditType = 'text' | 'image' | 'video' | 'link' | 'style'
export type CmsEdit = {
  id: string
  page_path: string
  element_key: string
  edit_type: EditType
  value: Record<string, unknown>
}

const editableStyleKeys = ['color', 'backgroundColor', 'fontSize', 'fontFamily', 'fontWeight', 'padding', 'marginTop', 'marginLeft', 'width', 'borderRadius', 'textAlign', 'display', 'flexDirection', 'justifyContent', 'alignItems', 'gap', 'order', 'animation'] as const
export type CmsStyle = Partial<Record<(typeof editableStyleKeys)[number], string>>
export type ResponsiveCmsStyle = CmsStyle & { mobile?: CmsStyle }
export const fontChoices = ['Inter', 'Plus Jakarta Sans', 'Arial', 'Georgia'] as const

export function safeCmsUrl(value: string, image = false) {
  if (value.startsWith('/') && !value.startsWith('//')) return true
  if (!image && (value.startsWith('#') || value.startsWith('mailto:') || value.startsWith('tel:'))) return true
  try { return new URL(value).protocol === 'https:' } catch { return false }
}

function safeStyle(key: keyof CmsStyle, value: string) {
  if (value === '') return true
  if (key === 'animation') return ['none', 'fade', 'float'].includes(value)
  if (key === 'textAlign') return ['left', 'center', 'right'].includes(value)
  if (key === 'display') return ['block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'none'].includes(value)
  if (key === 'flexDirection') return ['row', 'column', 'row-reverse', 'column-reverse'].includes(value)
  if (key === 'justifyContent') return ['start', 'center', 'end', 'space-between', 'space-around'].includes(value)
  if (key === 'alignItems') return ['start', 'center', 'end', 'stretch'].includes(value)
  if (key === 'order') return /^-?\d{1,2}$/.test(value) && Math.abs(Number(value)) <= 20
  if (key === 'fontFamily') return fontChoices.includes(value as typeof fontChoices[number])
  if (key === 'fontWeight') return ['400', '500', '600', '700', '800'].includes(value)
  if (key === 'color' || key === 'backgroundColor') return CSS.supports('color', value) && !/url\s*\(/i.test(value)
  if (key === 'width') return /^\d{1,3}%$/.test(value) && parseFloat(value) <= 100
  if (key === 'marginTop' || key === 'marginLeft') return /^-?\d{1,3}(?:\.\d)?px$/.test(value) && Math.abs(parseFloat(value)) <= 160
  return /^\d{1,3}(?:\.\d)?px$/.test(value) && parseFloat(value) <= 160
}

function styleCss(style: Record<string, unknown>) {
  const rules: string[] = []
  for (const key of editableStyleKeys) {
    const value = style[key]
    if (typeof value !== 'string' || !value || !safeStyle(key, value) || key === 'animation') continue
    const property = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    const cssValue = key === 'fontFamily' && value.includes(' ') ? `"${value}"` : value
    rules.push(`${property}:${cssValue}!important`)
  }
  return rules.join(';')
}

export function applyResponsiveStyle(doc: Document, selector: string, mobile: Record<string, unknown> | undefined, id: string) {
  const old = doc.getElementById(id)
  if (!mobile) { old?.remove(); return }
  const css = styleCss(mobile)
  if (!css) { old?.remove(); return }
  const tag = old ?? doc.createElement('style')
  tag.id = id
  tag.textContent = `@media (max-width:700px){${selector}{${css}}}`
  if (!old) doc.head.appendChild(tag)
}

export function applyCmsStyle(element: HTMLElement, style: Record<string, unknown>) {
  for (const key of editableStyleKeys) {
    const value = style[key]
    if (typeof value !== 'string' || !safeStyle(key, value)) continue
    if (key === 'animation') element.dataset.cmsAnimation = value
    else if (element.style[key] !== value) element.style[key] = value
  }
}

export function cmsPath(pathname: string) {
  return pathname.split(/[?#]/, 1)[0].replace(/\/$/, '') || '/'
}

export function elementPath(element: Element): string {
  const owner = element.ownerDocument
  if (element.id && owner.getElementById(element.id) === element) return `#${CSS.escape(element.id)}`
  const pieces: string[] = []
  let current: Element | null = element
  while (current && current !== owner.body) {
    if (current.id && owner.getElementById(current.id) === current) {
      pieces.unshift(`#${CSS.escape(current.id)}`)
      break
    }
    const parent: Element | null = current.parentElement
    const siblings = parent ? Array.from(parent.children).filter((sibling) => sibling.tagName === current?.tagName) : []
    const index = siblings.indexOf(current) + 1
    pieces.unshift(`${current.tagName.toLowerCase()}:nth-of-type(${index})`)
    current = parent
  }
  return pieces.join(' > ')
}

export function textNodes(element: Element): Text[] {
  return Array.from(element.childNodes).filter((node): node is Text => node.nodeType === 3)
}

export function editableTextTarget(start: Element): { element: Element; index: number; text: string } | null {
  let current: Element | null = start
  while (current && current !== start.ownerDocument.body) {
    const nodes = textNodes(current)
    const index = nodes.findIndex((node) => Boolean(node.nodeValue?.trim()))
    if (index >= 0) return { element: current, index, text: nodes[index].nodeValue ?? '' }
    if (['MAIN', 'HEADER', 'FOOTER'].includes(current.tagName)) break
    current = current.parentElement
  }
  return null
}

export function pageForElement(element: Element, pathname: string) {
  return element.closest('.site-header,.site-footer') ? '*' : cmsPath(pathname)
}

export async function loadPageEdits(client: SupabaseClient, pathname: string): Promise<CmsEdit[]> {
  const { data, error } = await client.from('portfolio_edits')
    .select('id,page_path,element_key,edit_type,value')
    .in('page_path', ['*', cmsPath(pathname)])
  if (error) throw error
  return (data ?? []) as CmsEdit[]
}

export function applyPageEdits(edits: CmsEdit[]) {
  for (const edit of edits) {
    const [selector, textIndex] = edit.element_key.split('::text:')
    let element: Element | null = null
    try { element = document.querySelector(selector) } catch { continue }
    if (!element || element.closest('.admin-page')) continue
    if (edit.edit_type === 'text' && textIndex !== undefined) {
      const node = textNodes(element)[Number(textIndex)]
      const next = edit.value.text
      if (node && typeof next === 'string' && next.length <= 2000 && node.nodeValue !== next) node.nodeValue = next
    } else if (edit.edit_type === 'text' && (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
      const next = edit.value.placeholder
      if (typeof next === 'string' && next.length <= 200 && element.placeholder !== next) element.placeholder = next
    } else if (edit.edit_type === 'image' && element instanceof HTMLImageElement) {
      if (typeof edit.value.src === 'string' && safeCmsUrl(edit.value.src, true) && element.getAttribute('src') !== edit.value.src) element.setAttribute('src', edit.value.src)
      if (typeof edit.value.alt === 'string' && element.alt !== edit.value.alt) element.alt = edit.value.alt
    } else if (edit.edit_type === 'video' && element instanceof HTMLVideoElement) {
      if (typeof edit.value.src === 'string' && safeCmsUrl(edit.value.src) && element.getAttribute('src') !== edit.value.src) {
        element.setAttribute('src', edit.value.src)
        element.load()
      }
      if (typeof edit.value.poster === 'string' && safeCmsUrl(edit.value.poster, true) && element.poster !== edit.value.poster) element.poster = edit.value.poster
    } else if (edit.edit_type === 'link' && element instanceof HTMLAnchorElement) {
      if (typeof edit.value.href === 'string' && safeCmsUrl(edit.value.href) && element.getAttribute('href') !== edit.value.href) element.setAttribute('href', edit.value.href)
    } else if (edit.edit_type === 'style' && element instanceof HTMLElement) {
      applyCmsStyle(element, edit.value)
      const mobile = edit.value.mobile
      applyResponsiveStyle(document, selector, mobile && typeof mobile === 'object' ? mobile as Record<string, unknown> : undefined, `cms-style-${edit.id}`)
    }
  }
}
