import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { paidReceiptFromStatus, paymentDownload, paymentStatus } from '../lib/payments'
import { downloadReceipt, receiptAmount, receiptPdf, type PaidReceipt } from '../lib/receipt'

export default function PaymentReturn() {
  const [params] = useSearchParams()
  const reference = params.get('reference') || ''
  const [status, setStatus] = useState('Checking your payment…')
  const [paid, setPaid] = useState(false)
  const [downloadable, setDownloadable] = useState(false)
  const [receipt, setReceipt] = useState<PaidReceipt | null>(null)
  const access = reference ? sessionStorage.getItem(`payment:${reference}`) : null

  useEffect(() => {
    if (!reference || !access) { setStatus('We could not find this checkout on this device. If you paid, contact us with your payment reference.'); return }
    let active = true
    void paymentStatus(reference, access).then((result) => {
      if (!active) return
      if (result.status === 'paid') {
        setPaid(true)
        setDownloadable(result.kind === 'source' || result.kind === 'ebook')
        const confirmedReceipt = paidReceiptFromStatus(reference, result)
        setReceipt(confirmedReceipt)
        setStatus(confirmedReceipt?.selected_usd_amount
          ? `You selected $${confirmedReceipt.selected_usd_amount}; paid ${receiptAmount(confirmedReceipt)}.`
          : `Payment confirmed${result.title ? ` for ${result.title}` : ''}.`)
      } else setStatus('Payment is not confirmed yet. If you completed checkout, wait a moment and check again.')
    }).catch((error) => { if (active) setStatus(error instanceof Error ? error.message : 'Could not check payment yet.') })
    return () => { active = false }
  }, [reference, access])

  async function download() {
    if (!access) return
    try {
      const result = await paymentDownload(reference, access)
      if (!result.url?.startsWith('https://')) throw new Error('Download unavailable.')
      window.location.assign(result.url)
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Download unavailable. Please try again.') }
  }

  async function saveReceipt() {
    if (!receipt) return
    try { downloadReceipt(await receiptPdf(receipt)) }
    catch { setStatus('Could not prepare the receipt. Please try again.') }
  }

  async function shareReceipt() {
    if (!receipt) return
    try {
      const file = await receiptPdf(receipt)
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Mr Ugo payment receipt' })
      } else {
        downloadReceipt(file)
        setStatus('Receipt downloaded. You can share the PDF from your device.')
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') setStatus('Could not share the receipt. Please try downloading it.')
    }
  }

  return <main className="page-section payment-return" id="content">
    <div className="section-head payment-return-content">
      <p className="section-label">PAYMENT</p>
      <h1>{paid ? 'Thank you for your support.' : 'Payment status'}</h1>
      <p className="section-intro" role="status">{status}</p>
      {receipt && <div className="payment-receipt-card">
        <div className="payment-receipt-top"><strong>Mr Ugo</strong><span>{receipt.test ? 'Test payment · Paid' : 'Paid'}</span></div>
        <p className="payment-receipt-label">{receipt.selected_usd_amount ? `You selected $${receipt.selected_usd_amount}` : 'Payment confirmation'}</p>
        {receipt.selected_usd_amount && <p className="payment-receipt-paid-label">Paid in naira</p>}
        <strong className="payment-receipt-amount">{receiptAmount(receipt)}</strong>
        <dl>
          <div><dt>For</dt><dd>{receipt.title}</dd></div>
          <div><dt>Name</dt><dd>{receipt.name || 'Not provided'}</dd></div>
          <div><dt>Email</dt><dd>{receipt.email}</dd></div>
          <div><dt>Date</dt><dd>{new Date(receipt.verified_at).toLocaleString()}</dd></div>
          <div><dt>Reference</dt><dd>{receipt.reference}</dd></div>
        </dl>
        <div className="payment-receipt-actions">
          <button type="button" onClick={saveReceipt}>Download PDF</button>
          <button type="button" onClick={shareReceipt}>Share receipt</button>
        </div>
      </div>}
      {!receipt && reference && <p>Reference: <strong>{reference}</strong></p>}
      <div className="hero-actions">
        {downloadable && <button type="button" className="contact-button" onClick={download}>Download your file</button>}
        {!paid && access && <button type="button" className="hero-secondary-button" onClick={() => window.location.reload()}>Check again</button>}
        <Link className="hero-secondary-button" to="/">Back to home</Link>
      </div>
    </div>
  </main>
}
