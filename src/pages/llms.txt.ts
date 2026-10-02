import type { APIRoute } from "astro";
import { renderLlmsTxt, type LlmsPost } from "~/lib/llmsTxt";
import { corpus } from "~/lib/routes";

/**
 * `/llms.txt`, derived from the corpus.
 *
 * It replaced `public/llms.txt`, which had to be DELETED rather than left
 * behind: a static asset shadows a route of the same path, so the file would
 * keep winning and this endpoint would never answer. `llmsTxt.test.ts`
 * asserts the absence.
 *
 * Server-rendered like the sitemap — the corpus is editorial state that
 * changes without a deploy, and the whole point of generating this file is
 * that it cannot fall behind what is published.
 *
 * NOT on a cache event and not warmed: the page cache stores no `text/plain`,
 * so a hit is impossible and warming it would render a document per rebuild
 * and discard it. `corpus()` itself is memoised, which is where the cost
 * actually is.
 */
export const prerender = false;

const toLlms = (lang: "de" | "en") => (post: Awaited<ReturnType<typeof corpus>>[number]): LlmsPost => ({
  slug: post.slug,
  lang,
  title: post.title,
  excerpt: post.excerpt,
  category: post.category,
  publishedAt: post.publishedAt ?? null,
});

export const GET: APIRoute = async () => {
  const [de, en] = await Promise.all([corpus("de"), corpus("en")]);

  return new Response(renderLlmsTxt({ de: de.map(toLlms("de")), en: en.map(toLlms("en")) }), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
};
