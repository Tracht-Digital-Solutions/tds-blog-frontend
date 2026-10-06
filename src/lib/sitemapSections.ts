/**
 * The sections of the sitemap (2026-10-06).
 *
 * One child sitemap per kind of page, listed by `/sitemap-index.xml` with each
 * child's own newest date. A crawler re-reads only the section that moved, and
 * Search Console reports indexing coverage per section — "the tag pages are not
 * indexed" is a finding, "12 of 140 URLs" is not.
 *
 * Its own module, with no imports, because `cache.ts` needs the paths too and
 * must not pull the corpus readers in with them.
 */
export const SITEMAP_SECTIONS = ["pages", "posts", "categories", "tags", "authors"] as const;
export type SitemapSection = (typeof SITEMAP_SECTIONS)[number];

export function isSitemapSection(value: string | undefined): value is SitemapSection {
  return (SITEMAP_SECTIONS as readonly string[]).includes(value ?? "");
}

/** `/sitemap-posts.xml` etc. */
export function sectionPath(section: SitemapSection): string {
  return `/sitemap-${section}.xml`;
}

/**
 * Every sitemap document the page cache has to rebuild when the corpus moves:
 * the index, each section, and the legacy single `sitemap-0.xml` (still served
 * with every URL, for anything that bookmarked it before the split).
 */
export const SITEMAP_PATHS: readonly string[] = [
  "/sitemap-index.xml",
  "/sitemap-0.xml",
  ...SITEMAP_SECTIONS.map(sectionPath),
];
