import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import NotFound from './NotFound'

export default function ManagedPage() {
  const { slug } = useParams()
  const [title, setTitle] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase || !slug) { setLoading(false); return }
    let active = true
    void supabase.from('portfolio_pages').select('title,published,deleted_at').eq('slug', slug).maybeSingle()
      .then(({ data }) => {
        if (!active) return
        setTitle(data && !data.deleted_at ? data.title : null)
        setLoading(false)
      })
    return () => { active = false }
  }, [slug])

  if (loading) return <main className="managed-page"><p>Loading page…</p></main>
  if (!title) return <NotFound />
  return <main className="managed-page"><header className="managed-page-intro"><p className="section-label">MR UGO</p><h1>{title}</h1></header></main>
}
