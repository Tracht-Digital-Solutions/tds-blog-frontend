/**
 * `hreflang` for the LISTING pages — tag, category, author and archive.
 *
 * ### Why they had none
 *
 * Every listing route passes `altUrl={null}` to the layout, so only articles,
 * the two home pages, `/aktuelles` and `/rss` ever carried alternates. The
 * reason was sound: the two trees do not mirror by prefix. `/kategorie/…`
 * becomes `/en/category/…`, `/autor/…` becomes `/en/author/…`, and — the part
 * that actually bites — the *content* differs. German posts are tagged
 * `webshop`, their English twins `online-shop`. A prefix-swapped alternate on
 * a tag page would have pointed at a 404 on most tags, and one dangling
 * alternate invalidates the whole set on both sides.
 *
 * ### What this does instead
 *
 * It asks. Each helper looks the counterpart page up in the other language's
 * corpus and returns its path only when that page really exists. The corpus is
 * fetched once per render generation and cached, so the check costs nothing
 * beyond a list scan.
 *
 * The result is deliberately CONSERVATIVE. A German category whose English
 * twin is filed under a different name gets no alternate — there genuinely is
 * no page at the mirrored URL, and inventing a link to the nearest equivalent
 * would be a claim this module cannot verify. Tags, authors and archive pages,
 * whose keys really are identical across trees, gain the alternates they
 * should always have had.
 */

import { archivePage, byAuthor, byCategory, byTag, type Lang } from "./routes";

/** The other tree. */
export function otherLang(lang: Lang): Lang {
  return lang === "de" ? "en" : "de";
}

const PREFIX: Record<Lang, string> = { de: "", en: "/en" };
const SEGMENTS: Record<Lang, { category: string; author: string }> = {
  de: { category: "kategorie", author: "autor" },
  en: { category: "category", author: "author" },
};

/** `/en/tag/x` for `/tag/x`, when the other tree really has that tag. */
export async function tagAlternate(lang: Lang, tag: string): Promise<string | null> {
  const other = otherLang(lang);
  const group = await byTag(other, tag);
  if (!group || group.posts.length === 0) return null;
  return `${PREFIX[other]}/tag/${encodeURIComponent(tag.trim().toLowerCase())}`;
}

/**
 * `/en/category/x` for `/kategorie/x`, when a category with the SAME slug
 * exists in the other tree. Usually it does not — see the module comment.
 */
export async function categoryAlternate(lang: Lang, slug: string): Promise<string | null> {
  const other = otherLang(lang);
  const group = await byCategory(other, slug);
  if (!group || group.posts.length === 0) return null;
  return `${PREFIX[other]}/${SEGMENTS[other].category}/${slug.trim().toLowerCase()}`;
}

/** `/en/author/x` for `/autor/x`, when that author has posts in the other tree. */
export async function authorAlternate(lang: Lang, slug: string): Promise<string | null> {
  const other = otherLang(lang);
  const group = await byAuthor(other, slug);
  if (!group || group.posts.length === 0) return null;
  return `${PREFIX[other]}/${SEGMENTS[other].author}/${slug.trim()}`;
}

/**
 * `/en/page/N` for `/page/N`, when the other tree is long enough to have that
 * page. Both trees hold the same articles today, but a page count is derived
 * from a live list and must not be assumed.
 */
export async function archiveAlternate(lang: Lang, page: number): Promise<string | null> {
  if (!Number.isInteger(page) || page < 2) return null;
  const other = otherLang(lang);
  // `archivePage` already refuses page 1 and anything past the last page, so a
  // non-null result is exactly the guarantee needed here.
  const found = await archivePage(other, String(page));
  return found ? `${PREFIX[other]}/page/${page}` : null;
}
