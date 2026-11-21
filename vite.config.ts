import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

const publicRoutes = ['/', '/about', '/experience', '/projects', '/source-code', '/ebooks', '/classes', '/socials', '/hire']

function publicSiteMetadata(siteUrl: string, indexable: boolean): Plugin {
  const base = siteUrl.replace(/\/$/, '')
  return {
    name: 'public-site-metadata',
    transformIndexHtml(html) {
      if (!base) return html.replace('"url":"PUBLIC_PERSON_URL",', '')
      return html.replace('PUBLIC_PERSON_URL', `${base}/`).replace('<!-- PUBLIC_SITE_METADATA -->', [
        `<meta property="og:url" content="${base}/" />`,
        `<meta property="og:image" content="${base}/share-card.svg" />`,
        `<meta name="twitter:image" content="${base}/share-card.svg" />`,
      ].join('\n    '))
    },
    generateBundle() {
      const robots = indexable && base
        ? `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /payment/return\nSitemap: ${base}/sitemap.xml\n`
        : 'User-agent: *\nDisallow: /\n'
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots })
      if (indexable && base) {
        const urls = publicRoutes.map((path) => `  <url><loc>${base}${path}</loc></url>`).join('\n')
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n` })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const configuredUrl = env.VITE_PUBLIC_SITE_URL?.trim()
  const vercelUrl = process.env.VERCEL_ENV === 'production' ? process.env.VERCEL_PROJECT_PRODUCTION_URL : undefined
  const siteUrl = configuredUrl || (vercelUrl ? `https://${vercelUrl}` : '')
  const indexable = Boolean(siteUrl) && (Boolean(configuredUrl) || process.env.VERCEL_ENV === 'production')
  return {
  plugins: [react(), publicSiteMetadata(siteUrl, indexable)],
  server: {
    allowedHosts: true,
    watch: {
      usePolling: true,
    }
  }

}})
