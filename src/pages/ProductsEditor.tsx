import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { safeCmsUrl } from '../lib/visualCms'
import { uploadPrivateProductFile, type Product } from '../lib/products'
import './ProductsEditor.css'

export default function ProductsEditor() {
  const [products, setProducts] = useState<Product[]>([])
  const [selected, setSelected] = useState<Product | null>(null)
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)

  const refresh = useCallback(async () => {
    if (!supabase) return
    const { data, error } = await supabase.from('portfolio_products')
      .select('id,kind,title,description,price_minor,currency,cover_url,published,portfolio_product_files(object_path,original_name,file_size,mime_type)')
      .order('created_at', { ascending: false })
    if (error) setNotice(`Could not load products: ${error.message}`)
    else setProducts((data ?? []).map((item) => ({
      ...item,
      portfolio_product_files: Array.isArray(item.portfolio_product_files)
        ? item.portfolio_product_files[0] ?? null
        : item.portfolio_product_files ?? null,
    })) as Product[])
  }, [])
  useEffect(() => { void refresh() }, [refresh])
  const update = (change: Partial<Product>) => setSelected((current) => current ? { ...current, ...change } : null)

  const add = async (kind: Product['kind']) => {
    if (!supabase) return
    setBusy(true)
    const { data, error } = await supabase.from('portfolio_products').insert({ kind, title: kind === 'ebook' ? 'New e-book' : 'New code package' })
      .select('id,kind,title,description,price_minor,currency,cover_url,published').single()
    setBusy(false)
    if (error || !data) { setNotice(`Could not create draft: ${error?.message || 'No row returned'}`); return }
    setSelected(data as Product); setNotice('Draft created. It is not visible to visitors.'); void refresh()
  }

  const save = async () => {
    if (!supabase || !selected) return
    if (!selected.title.trim()) { setNotice('Add a title before saving.'); return }
    if (selected.published && !selected.portfolio_product_files?.object_path) { setNotice('Upload the private file before publishing this product.'); return }
    if (selected.cover_url && !safeCmsUrl(selected.cover_url, true)) { setNotice('Use an HTTPS cover image or a path on this site.'); return }
    setBusy(true)
    const { data, error } = await supabase.from('portfolio_products').update({
      kind: selected.kind, title: selected.title.trim(), description: selected.description.trim(),
      price_minor: Math.max(0, Math.round(selected.price_minor)), currency: 'NGN',
      cover_url: selected.cover_url.trim(), published: selected.published,
    }).eq('id', selected.id).select('id').single()
    setBusy(false)
    setNotice(error || !data ? `Could not save product: ${error?.message || 'No row returned'}` : selected.published ? 'Product details are visible in the public catalog.' : 'Product draft saved.')
    if (!error) void refresh()
  }

  const uploadCover = async (file: File | undefined) => {
    if (!supabase || !file) return
    const ext: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' }
    if (!ext[file.type] || file.size > 5 * 1024 * 1024) { setNotice('Choose a JPG, PNG, WebP, or AVIF image under 5 MB.'); return }
    setBusy(true)
    const path = `${crypto.randomUUID()}.${ext[file.type]}`
    const { error } = await supabase.storage.from('portfolio-media').upload(path, file, { contentType: file.type })
    setBusy(false)
    if (error) { setNotice(`Cover upload failed: ${error.message}`); return }
    update({ cover_url: supabase.storage.from('portfolio-media').getPublicUrl(path).data.publicUrl })
    setNotice('Cover uploaded. Save the product to use it.')
  }

  const uploadFile = async (file: File | undefined) => {
    if (!selected || !file) return
    setBusy(true); setProgress(0)
    try {
      await uploadPrivateProductFile(selected.id, file, setProgress)
      setNotice('Private file uploaded. Visitors cannot download it without a verified checkout.')
      await refresh()
      const { data } = await supabase!.from('portfolio_product_files').select('object_path,original_name,file_size,mime_type').eq('product_id', selected.id).single()
      if (data) update({ portfolio_product_files: data })
    } catch (error) {
      const detail = error instanceof Error ? error.message : typeof error === 'object' && error !== null && 'message' in error ? String(error.message) : String(error)
      setNotice(`Upload failed: ${detail}`)
    }
    setBusy(false); setProgress(null)
  }

  return <div className="products-editor">
    <div className="products-editor-intro"><h2>Code packages and e-books</h2><p>Manage titles, prices, covers, and private files. Publish a product after its private file is ready.</p></div>
    {notice && <p className="admin-notice" role="status">{notice}</p>}
    <div className="products-editor-workspace"><div className="products-editor-list"><div className="products-editor-add"><button type="button" onClick={() => { void add('source') }} disabled={busy}>+ Code package</button><button type="button" onClick={() => { void add('ebook') }} disabled={busy}>+ E-book</button></div>
      {products.length === 0 && <p>No products yet. Create a draft to begin.</p>}
      {products.map((product) => <button type="button" key={product.id} className={selected?.id === product.id ? 'selected' : ''} onClick={() => setSelected(product)}><strong>{product.title}</strong><span>{product.kind === 'source' ? 'Code package' : 'E-book'} · {product.published ? 'Published' : 'Draft'}</span></button>)}
    </div><div className="products-editor-fields">{!selected ? <><h2>Select a product</h2><p>Its details and private file will appear here.</p></> : <>
      <div className="products-editor-title"><h2>{selected.kind === 'source' ? 'Code package' : 'E-book'}</h2><span>{selected.published ? 'Published' : 'Draft'}</span></div>
      <label>Title<input value={selected.title} maxLength={180} onChange={(event) => update({ title: event.target.value })} /></label>
      <label>Description<textarea value={selected.description} maxLength={2500} rows={5} onChange={(event) => update({ description: event.target.value })} /></label>
      <label>Price in naira<input type="number" min="0" step="0.01" value={selected.price_minor / 100} onChange={(event) => update({ price_minor: Math.round(Number(event.target.value) * 100) })} /></label>
      <label>Cover image<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => { void uploadCover(event.target.files?.[0]) }} /></label>
      <label>Cover address<input value={selected.cover_url} onChange={(event) => update({ cover_url: event.target.value })} /></label>
      {selected.cover_url && safeCmsUrl(selected.cover_url, true) && <img className="products-editor-cover" src={selected.cover_url} alt="Product cover preview" />}
      <div className="products-editor-preview" aria-label="Unsaved product preview"><small>UNSAVED PREVIEW · {selected.kind === 'ebook' ? 'E-BOOK' : 'SOURCE CODE'}</small>{selected.cover_url && safeCmsUrl(selected.cover_url, true) && <img src={selected.cover_url} alt="" />}<h3>{selected.title || 'Product title'}</h3><p>{selected.description || 'Add a description to preview it here.'}</p><strong>{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(selected.price_minor / 100)}</strong><span>{selected.portfolio_product_files ? 'Private download after payment' : 'Add a private file before publishing'}</span></div>
      <div className="products-editor-private"><h3>Private download file</h3><p>{selected.portfolio_product_files?.original_name || 'No file uploaded yet.'}</p><label>Upload PDF, EPUB, or ZIP (up to 50 MB)<input type="file" accept=".pdf,.epub,.zip,application/pdf,application/epub+zip,application/zip" disabled={busy} onChange={(event) => { void uploadFile(event.target.files?.[0]) }} /></label>{progress !== null && <progress value={progress} max={100}>{progress}%</progress>}</div>
      <label className="products-editor-publish"><input type="checkbox" checked={selected.published} onChange={(event) => update({ published: event.target.checked })} /> Show this product in the public catalog</label>
      <button className="products-editor-save" type="button" onClick={() => { void save() }} disabled={busy}>Save product</button>
    </>}</div></div>
  </div>
}
