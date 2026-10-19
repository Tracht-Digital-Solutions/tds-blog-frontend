/**
 * How many articles a tag needs before its page is worth indexing (2026-10-19).
 *
 * A tag on one article renders a page of about 65 words: a heading, one card
 * and the tag cloud. Dozens of those beside the articles read to a search
 * engine as thin, near-duplicate listings, and the geo audit flagged every one.
 * Below the threshold the page still answers (a reader following a tag chip
 * lands somewhere), but it is `noindex`, out of the sitemap and never named as
 * another tag page's hreflang alternate.
 *
 * No imports, so the sitemap, the alternates and both tag routes can share it
 * without a cycle.
 */
export const MIN_INDEXED_TAG_POSTS = 2;

export function isIndexedTag(postCount: number): boolean {
  return postCount >= MIN_INDEXED_TAG_POSTS;
}
