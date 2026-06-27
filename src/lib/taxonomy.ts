/**
 * Build-time taxonomy for the blog chrome. The header dropdown, article
 * sidebar and footer all need the same derived view of the corpus
 * (categories + popular tags), so they read it from here rather than each
 * re-deriving it from `listAllPosts`.
 *
 * The module-level `cache` persists for the whole `astro build`, so the
 * chrome components can call `getTaxonomy(lang)` on every page render and
 * `listAllPosts` walks the content-api cursor at most once per language.
 * `listAllPosts` already falls back to demo content / [] on a build-time
 * outage, so the chrome never breaks the build — categories just go empty.
 */
import { listAllPosts } from "~/lib/content-api";

export interface CatEntry {
  name: string;
  slug: string;
  count: number;
}
export interface TagEntry {
  name: string;
  count: number;
}
export interface Taxonomy {
  categories: CatEntry[];
  topTags: TagEntry[];
}

/** How many tags the "Beliebte Tags" shortlist surfaces. */
export const TOP_TAGS_LIMIT = 8;

const cache = new Map<"de" | "en", Taxonomy>();

/**
 * URL-safe slug for a category name. Categories are free-text on the post,
 * so transliterate the German umlauts first, then collapse everything else
 * to single hyphens (matching the lowercase tag-slug convention).
 */
export function categorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getTaxonomy(lang: "de" | "en"): Promise<Taxonomy> {
  const cached = cache.get(lang);
  if (cached) return cached;

  let posts: Awaited<ReturnType<typeof listAllPosts>> = [];
  try {
    posts = await listAllPosts(lang);
  } catch {
    posts = [];
  }

  // Categories: unique by name, deduped on slug (first name wins on a
  // slug collision), alpha-sorted, with post counts.
  const catCounts = new Map<string, { name: string; count: number }>();
  for (const p of posts) {
    const name = p.category?.trim();
    if (!name) continue;
    const slug = categorySlug(name);
    if (!slug) continue;
    const entry = catCounts.get(slug);
    if (entry) entry.count += 1;
    else catCounts.set(slug, { name, count: 1 });
  }
  const categories: CatEntry[] = Array.from(catCounts.entries())
    .map(([slug, { name, count }]) => ({ name, slug, count }))
    .sort((a, b) => a.name.localeCompare(b.name, lang));

  // Tags: split the comma-separated field, count frequency, take the most
  // common. Ordered by count desc, then alpha for a stable build.
  const tagCounts = new Map<string, number>();
  for (const p of posts) {
    if (!p.tags) continue;
    for (const t of p.tags.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)) {
      tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
    }
  }
  const topTags: TagEntry[] = Array.from(tagCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, TOP_TAGS_LIMIT);

  const tax: Taxonomy = { categories, topTags };
  cache.set(lang, tax);
  return tax;
}
