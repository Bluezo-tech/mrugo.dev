import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { cmsPath, safeCmsUrl } from '../lib/visualCms'
import type { PortfolioBlock } from '../lib/blocks'
import type { CSSProperties } from 'react'
import './CmsBlocks.css'

export function Block({ block }: { block: PortfolioBlock }) {
  const appearance = block.appearance || {}
  const background = appearance.background && CSS.supports('color', appearance.background) ? appearance.background : '#fff'
  const color = appearance.color && CSS.supports('color', appearance.color) ? appearance.color : '#202124'
  const padding = Math.max(12, Math.min(100, Number(appearance.padding) || 48))
  const media = block.media_url && safeCmsUrl(block.media_url, true) ? block.media_url : ''
  const link = block.link_url && safeCmsUrl(block.link_url) ? block.link_url : ''
  const external = link.startsWith('https:')
  const fontFamily = ['Inter', 'Plus Jakarta Sans', 'Arial', 'Georgia'].includes(appearance.fontFamily || '') ? appearance.fontFamily : undefined
  if (block.block_type === 'social') {
    const content = <><span className="social-icon-square" aria-hidden="true">{media ? <img src={media} alt="" loading="lazy" /> : block.title.slice(0, 1).toUpperCase()}</span><span className="social-card-text"><span className="social-name">{block.title}</span><span className="social-detail">{block.body}</span></span>{link ? <span className="social-mark" aria-hidden="true">↗</span> : <span className="social-mark is-todo-mark" aria-hidden="true">Soon</span>}</>
    return link ? <a className="social-card cms-social-card" href={link} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{content}</a> : <div className="social-card is-todo cms-social-card">{content}</div>
  }
  const mobilePadding = Math.max(12, Math.min(100, Number(appearance.mobilePadding) || padding))
  const style = { backgroundColor: background, color, textAlign: appearance.align === 'center' ? 'center' : 'left', paddingBlock: padding, fontFamily, '--cms-mobile-padding': `${mobilePadding}px` } as CSSProperties
  return <section className={`cms-block cms-block--${block.block_type}${appearance.mobileHidden ? ' cms-block--mobile-hidden' : ''}${appearance.mobileAlign === 'center' ? ' cms-block--mobile-center' : ''}`} style={style}>
    <div className="cms-block-inner">
      {media && ['split', 'image'].includes(block.block_type) && <img className="cms-block-media" src={media} alt={block.title || 'Portfolio image'} loading="lazy" />}
      <div className="cms-block-copy">
        {block.title && <h2>{block.title}</h2>}
        {block.body && <p>{block.body}</p>}
        {link && block.link_label && <a href={link} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{block.link_label} <span aria-hidden="true">↗</span></a>}
      </div>
    </div>
  </section>
}

export default function CmsBlocks({ slot }: { slot: PortfolioBlock['slot'] }) {
  const { pathname } = useLocation()
  const [blocks, setBlocks] = useState<PortfolioBlock[]>([])
  useEffect(() => {
    if (!supabase || pathname === '/admin') return
    let active = true
    void supabase.from('portfolio_blocks').select('id,page_path,slot,sort_order,block_type,title,body,media_url,link_label,link_url,appearance,published')
      .eq('page_path', slot === 'socials' ? '/' : cmsPath(pathname)).eq('slot', slot).eq('published', true).order('sort_order')
      .then(({ data }) => { if (active) setBlocks((data ?? []) as PortfolioBlock[]) })
    return () => { active = false }
  }, [pathname, slot])
  if (!blocks.length) return null
  if (slot === 'socials') return <>{blocks.map((block) => <Block key={block.id} block={block} />)}</>
  return <div className="cms-blocks">{blocks.map((block) => <Block key={block.id} block={block} />)}</div>
}
