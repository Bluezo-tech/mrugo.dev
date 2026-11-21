export type PaidReceipt = {
  reference: string
  title: string
  name: string
  email: string
  amount_minor: number
  currency: string
  selected_usd_amount?: number | null
  verified_at: string
  test: boolean
}

export function receiptAmount(receipt: PaidReceipt) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: receipt.currency }).format(receipt.amount_minor / 100)
}

export async function receiptPdf(receipt: PaidReceipt): Promise<File> {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595, 842])
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const ink = rgb(0.08, 0.1, 0.15)
  const muted = rgb(0.38, 0.41, 0.46)
  const accent = rgb(0.53, 0.12, 0.17)
  const draw = (label: string, x: number, y: number, size = 12, strong = false, color = ink) =>
    page.drawText(label, { x, y, size, font: strong ? bold : regular, color })
  const clean = (value: string) => value.replace(/[^\x20-\x7E]/g, ' ').slice(0, 90)
  page.drawRectangle({ x: 0, y: 806, width: 595, height: 36, color: accent })
  draw('Mr Ugo', 48, 759, 24, true)
  draw(receipt.test ? 'TEST PAYMENT CONFIRMATION' : 'PAYMENT CONFIRMATION', 48, 724, 10, true, accent)
  draw(receipt.selected_usd_amount ? `Selected USD ${receipt.selected_usd_amount.toFixed(2)}` : 'Payment amount', 48, 668, 14, true)
  if (receipt.selected_usd_amount) draw('Paid in naira', 48, 604, 11, true, muted)
  draw(`${receipt.currency} ${(receipt.amount_minor / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 48, 628, 27, true)
  page.drawLine({ start: { x: 48, y: 580 }, end: { x: 547, y: 580 }, thickness: 1, color: rgb(0.84, 0.85, 0.88) })
  const rows: [string, string][] = [
    ['For', receipt.title], ['Name', receipt.name || 'Not provided'], ['Email', receipt.email],
    ['Date', new Date(receipt.verified_at).toLocaleString('en-GB', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'short' }) + ' UTC'],
    ['Provider', 'Paystack'], ['Reference', receipt.reference],
  ]
  rows.forEach(([label, value], index) => {
    const y = 556 - index * 53
    draw(label.toUpperCase(), 48, y, 9, true, muted)
    draw(clean(value), 48, y - 20, value.length > 65 ? 9 : 12)
  })
  draw('Keep this confirmation and the reference for your records.', 48, 109, 10, false, muted)
  draw('Payment details were verified with Paystack. Card details are never stored here.', 48, 90, 9, false, muted)
  const bytes = await pdf.save()
  return new File([new Uint8Array(bytes)], `Mr-Ugo-receipt-${receipt.reference}.pdf`, { type: 'application/pdf' })
}

export function downloadReceipt(file: File) {
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
