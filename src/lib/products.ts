import { supabase } from './supabase'

export type Product = {
  id: string; kind: 'source' | 'ebook'; title: string; description: string; price_minor: number
  currency: string; cover_url: string; published: boolean
  portfolio_product_files?: { object_path: string; original_name: string; file_size: number; mime_type: string } | null
}

export async function getPublishedProducts(kind: Product['kind']): Promise<Product[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('portfolio_products')
    .select('id,kind,title,description,price_minor,currency,cover_url,published')
    .eq('kind', kind).eq('published', true).order('created_at', { ascending: false })
  if (error) return []
  return (data ?? []) as Product[]
}

export function priceLabel(product: Product) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: product.currency }).format(product.price_minor / 100)
}

const formats: Record<string, string> = { pdf: 'application/pdf', epub: 'application/epub+zip', zip: 'application/zip' }

export async function uploadPrivateProductFile(productId: string, file: File, onProgress: (percent: number) => void) {
  if (!supabase) throw new Error('Storage is not configured.')
  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  const contentType = formats[extension]
  if (!contentType || file.size > 50 * 1024 * 1024) throw new Error('Choose a PDF, EPUB, or ZIP file under 50 MB.')
  const tus = await import('tus-js-client')
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) throw new Error('Sign in again before uploading.')
  const projectId = new URL(import.meta.env.VITE_SUPABASE_URL).hostname.split('.')[0]
  const objectPath = `${productId}/${crypto.randomUUID()}.${extension}`
  if (file.size <= 6 * 1024 * 1024) {
    const { error } = await supabase.storage.from('portfolio-products').upload(objectPath, file, { contentType })
    if (error) throw error
    onProgress(100)
  } else await new Promise<void>((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: `https://${projectId}.storage.supabase.co/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: { authorization: `Bearer ${session.access_token}` },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      metadata: { bucketName: 'portfolio-products', objectName: objectPath, contentType },
      chunkSize: 6 * 1024 * 1024,
      onError: reject,
      onProgress: (sent, total) => onProgress(Math.round((sent / total) * 100)),
      onSuccess: () => resolve(),
    })
    upload.start()
  })
  const { error } = await supabase.from('portfolio_product_files').upsert({
    product_id: productId, object_path: objectPath, original_name: file.name,
    file_size: file.size, mime_type: contentType,
  }, { onConflict: 'product_id' })
  if (error) throw error
  return objectPath
}
