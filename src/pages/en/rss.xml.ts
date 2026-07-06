import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { listAllPosts } from "~/lib/content-api";
import { siteConfig } from "~/lib/seo";

// English twin of /rss.xml — EN posts, /en/-prefixed links. The layout's
// autodiscovery <link> points EN pages here so feed readers get the
// language they're on.
export async function GET(context: APIContext) {
  const posts = await listAllPosts("en").catch(() => []);

  return rss({
    title: "TDS Journal (English)",
    description: siteConfig.description.en,
    site: context.site ?? "https://blog.tracht-digital.de",
    items: posts.map((p) => ({
      title: p.title,
      pubDate: p.publishedAt ? new Date(p.publishedAt) : new Date(),
      description: p.excerpt,
      link: `/en/${p.slug}`,
      categories: [p.category],
    })),
    customData: `<language>en-gb</language>`,
  });
}
