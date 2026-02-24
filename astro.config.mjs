// @ts-check
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import {
  defineConfig,
  fontProviders,
  passthroughImageService,
} from "astro/config";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Montserrat",
        cssVariable: "--font-montserrat",
        display: "swap",

        weights: [400, 500, 600, 700, 900],
        subsets: ["latin"],
      },
    ],
  },

  output: "static",

  server: { host: true },
  site: "https://veklabs.com",

  redirects: {
    "/blog": "/reports",
    "/reports/page/1": "/reports",
    "/videos": "/portfolio",
  },

  env: {
    schema: {
      PAYLOAD_USERNAME: { type: "string", access: "public", context: "server" },
      PAYLOAD_PASSWORD: { type: "string", access: "public", context: "server" },
      PAYLOAD_URL: { type: "string", access: "public", context: "server" },
      SITE_BASE_URL: { type: "string", access: "public", context: "server" },
      TURNSTILE_SECRET_KEY: {
        type: "string",
        access: "public",
        context: "server",
      },
    },
  },

  adapter: cloudflare({ imageService: "cloudflare" }),
  image: { service: passthroughImageService() },

  integrations: [react(), sitemap(), partytown()],

  vite: {
    plugins: [tailwindcss()],
  },
});