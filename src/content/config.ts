import { defineCollection, reference, z } from "astro:content"

const reports = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.string().optional(),
      author: z.string(),
      keywords: z.string().optional(),
      date: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      image: image(),
    }),
})

const testimonials = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subtitle: z.string(),
      image: image().optional(),
    }),
})

const services = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      page_title: z.string(),
      image: image().optional(),
      order: z.number(),
      speed: z.number(),
      summary: z.string(),
    }),
})

const offerings = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image(),
      description: z.string(),
      rel: reference("services"),
    }),
})

const team = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      image: image(),
      competencies: z.array(z.string()),
      title: z.string(),
      order: z.number().optional(),

      channel: z
        .array(
          z.object({
            name: z.string(),
            url: z.string().url(),
            icon: z.string(),
          }),
        )
        .optional(),
    }),
})

const videos = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      videoID: z.string(),
      videoURL: z.string(),
      previewURL: z.string(),
      image: image(),
      type: z.string(),
    }),
})

const features = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      category: z.string(),
      videoURL: z.string().url().startsWith("https://player.vimeo.com/"),
      videoID: z.number(),
      publishDate: z.coerce.date(),
      image: image(),
      site: z.string().url().optional(),
      meta: z.record(z.string()).optional(),
    }),
})

export const collections = {
  reports,
  videos,
  services,
  offerings,
  features,
  team,
  testimonials,
}
