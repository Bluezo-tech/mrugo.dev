// Vercel supplies the visitor's country from their network location.
export default {
  fetch(request: Request) {
    const country = request.headers.get('x-vercel-ip-country')
    const currency = country && /^[A-Z]{2}$/.test(country)
      ? country === 'NG' ? 'NGN' : 'USD'
      : null
    return Response.json({ currency }, { headers: { 'Cache-Control': 'no-store' } })
  },
}
