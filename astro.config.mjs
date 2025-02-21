import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import readingTime from "astro-reading-time"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  experimental: { clientPrerender: true },
  output: "static",
  server: { port: 3000 },
  site: "https://veklabs.com",
  integrations: [
    readingTime(),
    mdx(),
    sitemap(),
    react({ babel: { plugins: [["module:@preact/signals-react-transform"]] } }),
  ],
  vite: { plugins: [tailwindcss()] },
  redirects: {
    "/reports": "/reports/page/1",
  },
})
