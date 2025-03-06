import { OGImageRoute } from "astro-og-canvas"
import { getCollection, type CollectionEntry } from "astro:content"

const collectionEntries = await getCollection("reports")
const pages = Object.fromEntries(
  collectionEntries.map(({ slug, data }) => [slug, data]),
)

export const { getStaticPaths, GET } = OGImageRoute({
  param: "route",

  pages,

  getSlug(path) {
    return path
  },

  // For each page, this callback will be used to customize the OpenGraph image.
  getImageOptions: async (path, page: CollectionEntry<"reports">["data"]) => ({
    title: page.title,
    description: "Report by Vek Labs".toLocaleUpperCase(),
    bgImage: page.image.src.match(/\/images\/(.*)/)
      ? {
          path: `./src/images/${page.image.src.match(/\/images\/(.*)/)![1].replace(/\?.*/, "")}`,
          fit: "cover",
        }
      : undefined,
    font: {
      title: { families: ["Poppins"], weight: "Bold" },
      description: { families: ["Poppins"], weight: "Normal" },
    },
    fonts: [
      "https://cdn.jsdelivr.net/fontsource/fonts/poppins@latest/latin-400-normal.ttf",
      "https://cdn.jsdelivr.net/fontsource/fonts/poppins@latest/latin-500-normal.ttf",
      "https://cdn.jsdelivr.net/fontsource/fonts/poppins@latest/latin-600-normal.ttf",
    ],
    format: "WEBP",
    logo: {
      size: [100],
      path: "./src/images/logo-white.png",
    },
  }),
})
