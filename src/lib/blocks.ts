export type PortfolioBlock = {
  id: string
  page_path: string
  slot: 'before' | 'after' | 'socials'
  sort_order: number
  block_type: 'text' | 'split' | 'image' | 'cta' | 'social'
  title: string
  body: string
  media_url: string
  link_label: string
  link_url: string
  appearance: { background?: string; color?: string; align?: 'left' | 'center'; padding?: number; fontFamily?: string; mobilePadding?: number; mobileAlign?: 'left' | 'center'; mobileHidden?: boolean }
  published: boolean
}

export const newBlock = (path: string): Omit<PortfolioBlock, 'id'> => ({
  page_path: path, slot: 'after', sort_order: 0, block_type: 'text', title: '', body: '',
  media_url: '', link_label: '', link_url: '', appearance: { background: '#ffffff', color: '#202124', align: 'left', padding: 48 }, published: false,
})
