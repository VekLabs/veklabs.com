import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import readingTime from "astro-reading-time"
import { defineConfig } from "astro/config"
import netlify from "@astrojs/netlify"

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  experimental: {
    responsiveImages: true,
    clientPrerender: true,
    contentIntellisense: true,
  },
  output: "static",
  server: { host: true },
  site: "https://veklabs.com",
  adapter: netlify(),
  integrations: [readingTime(), sitemap(), react()],
  vite: { plugins: [tailwindcss()] },
  redirects: {
    "/reports": "/reports/page/1",
    "/videos": "/portfolio",
  },
})
