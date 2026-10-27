import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['monica-kate-jewish-controllers.trycloudflare.com'],
    watch: {
      usePolling: true,
    }
  }
})
