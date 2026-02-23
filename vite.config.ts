import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// Injects VITE_SITE_URL for og:image and og:url (required for WhatsApp preview)
function htmlSiteUrl() {
  return {
    name: 'html-site-url',
    transformIndexHtml(html: string) {
      const url = process.env.VITE_SITE_URL || ''
      return html.replace(/__SITE_URL__/g, url)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), htmlSiteUrl()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
