// @ts-check
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { defineConfig, fontProviders } from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  prefetch: true,

  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Montserrat',
        cssVariable: '--font-montserrat',
        display: 'swap',
        subsets: ['latin'],
      },
    ],
  },

  output: 'static',
  server: { host: true },
  site: 'https://veklabs.com',

  redirects: {
    '/blog': '/reports/page/1',
    '/reports': '/reports/page/1',
    '/videos': '/portfolio',
  },

  env: {
    schema: {
      PAYLOAD_USERNAME: { type: 'string', access: 'public', context: 'server' },
      PAYLOAD_PASSWORD: { type: 'string', access: 'public', context: 'server' },
      PAYLOAD_URL: { type: 'string', access: 'public', context: 'server' },
      SITE_BASE_URL: { type: 'string', access: 'public', context: 'server' },
    },
  },

  adapter: cloudflare(),

  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
})
