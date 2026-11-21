# Optional WhatsApp inbox alerts

Contact and Hire Me submissions are stored in `portfolio_inquiries` first. The notification is optional. It is sent only when all four Edge Function secrets below are configured:

- `WHATSAPP_ACCESS_TOKEN`: a Meta WhatsApp Business Platform access token with messaging permission.
- `WHATSAPP_PHONE_NUMBER_ID`: the sender phone number ID from Meta.
- `WHATSAPP_ALERT_RECIPIENT`: a separate WhatsApp number that can receive the alert, in international format without `+`.
- `WHATSAPP_INQUIRY_TEMPLATE`: an approved utility template name with four body variables in this order: source, sender name, reply email, and message summary.

`WHATSAPP_TEMPLATE_LANGUAGE` is optional and defaults to `en_US`. Configure these only in Supabase Edge Function secrets, never in Vite environment variables. The browser must not receive the access token. Meta may require the recipient to opt in and a production sender setup. The sender and recipient should be separate numbers. Confirm the approved template and test with a dedicated recipient before relying on alerts.

The CMS inbox remains authoritative. A failed WhatsApp notification is logged by inquiry ID without including the visitor's personal details; the form submission still succeeds. The admin CMS can download a PDF summary of each request. Sending the PDF itself through WhatsApp would require a separately approved media template and secure document delivery; this integration currently sends a text summary only.
