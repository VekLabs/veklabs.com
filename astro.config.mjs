import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import tailwind from "@astrojs/tailwind"
import readingTime from "astro-reading-time"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  experimental: { clientPrerender: true },
  output: "static",
  site: "https://veklabs.com",
  integrations: [readingTime(), mdx(), sitemap(), tailwind(), react()],
})
