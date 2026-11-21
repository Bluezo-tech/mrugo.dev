import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { applySiteDesign, defaultSiteDesign, type SiteDesign } from '../lib/siteDesign'

export default function SiteDesignBridge() {
  useEffect(() => {
    if (!supabase) return
    let active = true
    void supabase.from('portfolio_site_settings').select('settings').eq('id', 'main').single()
      .then(({ data }) => {
        if (active && data?.settings) applySiteDesign({ ...defaultSiteDesign, ...data.settings } as SiteDesign)
      })
    return () => { active = false }
  }, [])
  return null
}
