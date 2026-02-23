import { getPayload } from "@/payload";
import type { Report } from "@/payload-types";
import type { Populated } from "@/utils/typeChecks";
import rss from "@astrojs/rss";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import type { AstroSharedContext } from "astro";

export async function GET(context: AstroSharedContext) {
  const payload = await getPayload();
  const reports =
    ((
      await payload.find({
        collection: "reports",
        where: { slug: { exists: true } },
        limit: 100,
      })
    ).docs as Populated<Report>[]) ?? [];

  return rss({
    title: "Vek Labs Reports",
    description: "Latest posts from Vek Labs",
    site: context.site,
    items: reports.map((post) => ({
      title: post.title,
      pubDate: new Date(post.createdAt),
      content: convertLexicalToHTML({ data: post.body }),
      description: post.meta.description || "",
      link: `/reports/${post.slug}/`,
      categories: [post.category.title],
    })),
  });
}
