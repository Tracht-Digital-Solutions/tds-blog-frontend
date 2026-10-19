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
import { defineSitemapSections } from "@tracht-digital-solutions/tds-shared/site";

const sections = defineSitemapSections(["pages", "posts", "categories", "tags", "authors"] as const);

export const SITEMAP_SECTIONS = sections.sections;
export type SitemapSection = (typeof SITEMAP_SECTIONS)[number];
export const isSitemapSection = sections.isSection;
/** `/sitemap-<section>.xml`. */
export const sectionPath = sections.sectionPath;
/** Every sitemap document the page cache rebuilds: index, legacy `sitemap-0.xml`, each section. */
export const SITEMAP_PATHS = sections.paths;
