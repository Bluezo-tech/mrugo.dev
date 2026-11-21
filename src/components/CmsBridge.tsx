import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { applyPageEdits, loadPageEdits } from '../lib/visualCms'

export default function CmsBridge() {
  const { pathname } = useLocation()

  useEffect(() => {
    if (!supabase || pathname === '/admin') return
    let active = true
    let applying = false
    let edits: Awaited<ReturnType<typeof loadPageEdits>> = []
    const apply = () => {
      if (applying || !active || document.body.dataset.cmsPreview === 'true') return
      applying = true
      applyPageEdits(edits)
      applying = false
    }
    void loadPageEdits(supabase, pathname).then((data) => {
      if (!active) return
      edits = data
      apply()
    }).catch(() => {})
    const observer = new MutationObserver(apply)
    observer.observe(document.body, { subtree: true, childList: true, characterData: true })
    return () => { active = false; observer.disconnect() }
  }, [pathname])

  return null
}
