// Vercel supplies the visitor's country from their network location.
export default {
  fetch(request: Request) {
    const country = request.headers.get('x-vercel-ip-country')
    return Response.json({ country: country && /^[A-Z]{2}$/.test(country) ? country : null }, { headers: { 'Cache-Control': 'no-store' } })
  },
}
