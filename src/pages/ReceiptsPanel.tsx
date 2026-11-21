import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { safeCmsUrl } from '../lib/visualCms'
import { downloadReceipt, receiptPdf } from '../lib/receipt'

type Receipt = {
  id: string; provider: string; provider_reference: string; item_title: string; buyer_email: string; buyer_name: string
  amount_minor: number; currency: string; status: 'paid' | 'refunded'; verified_at: string; receipt_url: string; test_mode: boolean
}

export default function ReceiptsPanel() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return
    let active = true
    void supabase.from('portfolio_receipts')
      .select('id,provider,provider_reference,item_title,buyer_email,buyer_name,amount_minor,currency,status,verified_at,receipt_url,test_mode')
      .order('verified_at', { ascending: false }).limit(100)
      .then(({ data, error: queryError }) => {
        if (!active) return
        if (queryError) setError('Could not load receipts. Please try again.')
        else setReceipts((data ?? []) as Receipt[])
        setLoading(false)
      })
    return () => { active = false }
  }, [])

  if (loading) return <div className="admin-panel"><p>Loading receipts…</p></div>
  if (error) return <div className="admin-panel"><p>{error}</p></div>
  if (!receipts.length) return <div className="admin-panel"><h2>No receipts yet</h2><p>Verified payments will appear here once checkout and its server verification are connected.</p></div>
  return <div className="admin-inquiries">{receipts.map((receipt) => {
    const amount = new Intl.NumberFormat('en-NG', { style: 'currency', currency: receipt.currency }).format(receipt.amount_minor / 100)
    return <article className="admin-panel admin-receipt" key={receipt.id}>
      <div className="admin-inquiry-top"><span className={`admin-badge admin-badge--${receipt.status}`}>{receipt.test_mode ? 'Test · ' : ''}{receipt.status}</span><time dateTime={receipt.verified_at}>{new Date(receipt.verified_at).toLocaleString()}</time></div>
      <h2>{receipt.item_title || 'Support payment'}</h2><strong className="admin-receipt-amount">{amount}</strong>
      <p className="admin-sender">{receipt.buyer_name || 'Name not provided'} · {receipt.buyer_email}</p><p className="admin-contact-details">{receipt.provider} · {receipt.provider_reference}</p>
      <button type="button" onClick={() => void receiptPdf({ reference: receipt.provider_reference, title: receipt.item_title,
        name: receipt.buyer_name, email: receipt.buyer_email, amount_minor: receipt.amount_minor, currency: receipt.currency,
        verified_at: receipt.verified_at, test: receipt.test_mode }).then(downloadReceipt)}>Download PDF</button>
      {receipt.receipt_url && safeCmsUrl(receipt.receipt_url) && <a href={receipt.receipt_url} target="_blank" rel="noopener noreferrer">Open provider receipt ↗</a>}
    </article>
  })}</div>
}
