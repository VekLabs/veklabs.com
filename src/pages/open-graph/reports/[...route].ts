import { getPayload } from "@/payload";
import type { Report } from "@/payload-types";
import type { Populated } from "@/utils/typeChecks";
import { OGImageRoute } from "astro-og-canvas";

const payload = await getPayload();
const reports =
  ((
    await payload.find({
      collection: "reports",
      where: { slug: { exists: true } },
      limit: 100,
    })
  ).docs as Populated<Report>[]) ?? [];

const pages = Object.fromEntries(
  reports.map(({ slug, ...data }) => [slug, data]),
);

export const { getStaticPaths, GET } = OGImageRoute({
  param: "route",

  pages,

  getSlug(path) {
    return path;
  },

  // For each page, this callback will be used to customize the OpenGraph image.
  getImageOptions: async (_path, page: Populated<Report>) => ({
    title: page.title,
    description: page.author?.name
      ? `${page.category.title.toUpperCase()} | ${page.author?.name}`
      : "",
    // dark gray to black gradient
    bgGradient: [
      [0, 0, 0],
      [25, 25, 25],
    ],
    font: {
      title: { families: ["Montserrat"], weight: "Bold" },
      description: { families: ["Montserrat"], weight: "Normal" },
    },
    fonts: [
      "https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-400-normal.ttf",
      "https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-500-normal.ttf",
      "https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-600-normal.ttf",
    ],
    format: "WEBP",
    logo: {
      size: [100],
      path: "./src/images/logo-white.png",
    },
  }),
});
