import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { listAllPosts } from "~/lib/content-api";
import { siteConfig } from "~/lib/seo";

// English twin of /rss.xml — EN posts, /en/-prefixed links. The layout's
// autodiscovery <link> points EN pages here so feed readers get the
// language they're on. `lastBuildDate` and per-item `author` mirror the German
// feed; see the comment there for why both are present.
export async function GET(context: APIContext) {
  const posts = await listAllPosts("en").catch(() => []);

  const newest = posts
    .map((p) => p.publishedAt)
    .filter((d): d is string => typeof d === "string" && d !== "")
    .sort()
    .at(-1);

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
      author: p.author?.name
        ? `${siteConfig.email} (${p.author.name})`
        : `${siteConfig.email} (${siteConfig.name})`,
    })),
    customData: [
      `<language>en-gb</language>`,
      newest ? `<lastBuildDate>${new Date(newest).toUTCString()}</lastBuildDate>` : "",
    ].join(""),
  });
}
