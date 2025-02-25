import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import readingTime from "astro-reading-time"
import { defineConfig } from "astro/config"
import netlify from "@astrojs/netlify"
import relatinatorIntegration from "astro-relatinator"

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  experimental: { clientPrerender: true },
  output: "static",
  server: { host: true },
  site: "https://veklabs.com",
  adapter: netlify(),
  integrations: [
    relatinatorIntegration({
      paths: ["src/content/videos"],
      schema: ["title", "type"],
      similarityMethod: "bm25",
      debug: true,
    }),
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
