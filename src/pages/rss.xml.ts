import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { listAllPosts } from "~/lib/content-api";

export async function GET(context: APIContext) {
  const posts = await listAllPosts("de").catch(() => []);

  return rss({
    title: "TDS Journal",
    description: "Gedanken und Artikel von Julian Tracht.",
    site: context.site ?? "https://blog.tracht-digital.de",
    items: posts.map((p) => ({
      title: p.title,
      pubDate: p.publishedAt ? new Date(p.publishedAt) : new Date(),
      description: p.excerpt,
      link: `/${p.slug}`,
      categories: [p.category],
    })),
    customData: `<language>de-de</language>`,
  });
}
