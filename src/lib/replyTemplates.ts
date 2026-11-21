export type ReplyTemplates = { email: string; whatsapp: string }

export const defaultReplyTemplates: ReplyTemplates = {
  email: 'Hello {{name}},\n\nThank you for contacting me. I’m following up on your enquiry.\n\nBest,\nMr Ugo',
  whatsapp: 'Hello {{name}}, thank you for contacting Mr Ugo. I’m following up on your enquiry.',
}

export const replyEditKeys = { email: '#cms-reply-email', whatsapp: '#cms-reply-whatsapp' } as const

export function formatReply(template: string, name: string) {
  return template.replaceAll('{{name}}', name)
}
