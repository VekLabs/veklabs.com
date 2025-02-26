import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { SITE_TITLE, SITE_DESCRIPTION } from "../consts"
import { getExcerpt } from "../utils/getExcerpt"

export async function GET(context) {
  const posts = await getCollection("reports")

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      title: post.data.title,
      description: getExcerpt(post.body),
      pubDate: new Date(post.data.date).toUTCString(),
      date: new Date(post.data.date),
      keywords: post.data.keywords,
      category: post.data.category,
      content: post.rendered.html,
      image: post.data.image,
      link: `/reports/${post.slug}/`,
    })),
  })
}
