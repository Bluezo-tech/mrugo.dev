import type { Inquiry } from './supabase'

export async function downloadInquiryPdf(inquiry: Inquiry) {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib')
  const pdf = await PDFDocument.create()
  let page = pdf.addPage([595, 842])
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const ink = rgb(0.09, 0.1, 0.13)
  const muted = rgb(0.39, 0.41, 0.45)
  const accent = rgb(0.47, 0.09, 0.14)
  const safe = (value: string) => value.replace(/[^\x20-\x7e]/g, ' ').trim()
  const wrap = (value: string, fontSize: number, width: number) => {
    const lines: string[] = []
    for (const paragraph of safe(value).split(/\s*\n\s*/)) {
      let line = ''
      for (const word of paragraph.split(/\s+/)) {
        const next = line ? `${line} ${word}` : word
        if (regular.widthOfTextAtSize(next, fontSize) > width && line) { lines.push(line); line = word }
        else line = next
      }
      lines.push(line)
    }
    return lines
  }
  const fitPage = (y: number) => {
    if (y >= 70) return y
    page = pdf.addPage([595, 842])
    return 790
  }
  const field = (label: string, value: string, y: number) => {
    y = fitPage(y - 30)
    page.drawText(label.toUpperCase(), { x: 48, y, size: 9, font: bold, color: muted })
    y -= 19
    for (const line of wrap(value || 'Not provided', 11, 495)) {
      y = fitPage(y)
      page.drawText(line, { x: 48, y, size: 11, font: regular, color: ink })
      y -= 16
    }
    return y - 20
  }
  page.drawRectangle({ x: 0, y: 802, width: 595, height: 40, color: accent })
  page.drawText('Mr Ugo', { x: 48, y: 757, size: 22, font: bold, color: ink })
  page.drawText(inquiry.source === 'hire' ? 'PROJECT REQUEST' : 'CONTACT MESSAGE', { x: 48, y: 730, size: 10, font: bold, color: accent })
  let y = 692
  y = field('Received', new Date(inquiry.created_at).toLocaleString('en-GB'), y)
  y = field('Name', inquiry.name, y)
  y = field('Email', inquiry.email, y)
  if (inquiry.source === 'hire') y = field('Project type', inquiry.project_type || '', y)
  else y = field('Subject', inquiry.subject || '', y)
  if (inquiry.phone) y = field('Phone', inquiry.phone, y)
  if (inquiry.whatsapp) y = field('WhatsApp', inquiry.whatsapp, y)
  if (inquiry.preferred_contact.length) y = field('Preferred reply', inquiry.preferred_contact.join(', '), y)
  y = fitPage(y - 30)
  page.drawText('MESSAGE', { x: 48, y, size: 9, font: bold, color: muted })
  y -= 20
  for (const line of wrap(inquiry.message, 11, 495)) {
    y = fitPage(y)
    page.drawText(line, { x: 48, y, size: 11, font: regular, color: ink })
    y -= 16
  }
  const bytes = await pdf.save()
  const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `Mr-Ugo-${inquiry.source}-request-${inquiry.id}.pdf`
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
