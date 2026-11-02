/**
 * Single source of truth for the public blog navigation, consumed by the
 * top JournalHeader (incl. its mobile drawer) and the article-page
 * ArticleSidebar so the two never drift.
 *
 * The primary nav is tds-shared's property list — Journal · Tools · Shop ·
 * Tracht Digital, the same list, names and order the tools site's and the
 * shop's bars show — with the journal's own "Entdecken" group after its own
 * entry. "Entdecken" is a group node: its three sections (Kategorien · Beliebte
 * Tags · Aktuelle Themen) are built at render time from `getTaxonomy()`
 * (categories/tags are derived from the corpus, so they can't be hard-coded
 * here). The href helpers below keep those links consistent across surfaces.
 *
 * The Entdecken labels stay here as DE/EN literals to match the existing local
 * convention; promoting them into tds-shared i18n is a follow-up.
 */
import { PROPERTY_ORIGINS, propertyNav } from "@tracht-digital-solutions/tds-shared/nav";

export type Lang = "de" | "en";

export type BlogNavNode =
  | {
      kind: "link";
      key: "journal" | "tools" | "shop" | "main";
      label: string;
      href: string;
      external?: boolean;
    }
  | { kind: "group"; key: "entdecken"; label: string };

/**
 * The public tools site. A sibling first-party property, so it opens in the
 * SAME tab — forcing `target="_blank"` on a link within one's own group of
 * sites takes a decision away from the reader for no reason.
 */
export const TOOLS_URL = PROPERTY_ORIGINS.tools;

/**
 * The shop. Same rule as `TOOLS_URL`, same tab, for the same reason.
 *
 * The label is "Shop" in both languages: it is the property's name here, and
 * translating it to "Store" for the English edition would name a second site
 * that does not exist.
 */
export const SHOP_URL = PROPERTY_ORIGINS.shop;

export function primaryNav(lang: Lang): BlogNavNode[] {
  const home = lang === "de" ? "/" : "/en/";
  // Sibling links are absolute and keep the reader's language (`/en/` on an
  // English page). `isActiveNav` never matches an absolute URL, so they are
  // permanently inactive — which is correct: you are never "on" them here.
  return propertyNav("journal", lang, home).flatMap((property): BlogNavNode[] => {
    const link: BlogNavNode = {
      kind: "link",
      key: property.key,
      label: property.label,
      href: property.href,
      ...(property.current ? {} : { external: true }),
    };
    return property.current
      ? [link, { kind: "group", key: "entdecken", label: entdeckenLabels(lang).group }]
      : [link];
  });
}

/** Section labels inside the Entdecken group. */
export function entdeckenLabels(lang: Lang) {
  return {
    group: lang === "de" ? "Entdecken" : "Discover",
    categories: lang === "de" ? "Kategorien" : "Categories",
    tags: lang === "de" ? "Beliebte Tags" : "Popular tags",
    topics: lang === "de" ? "Aktuelle Themen" : "Current topics",
  };
}

/* ---- Link helpers (kept in sync with the page routes) ---- */
export function categoryHref(lang: Lang, slug: string): string {
  return lang === "de" ? `/kategorie/${slug}` : `/en/category/${slug}`;
}
export function tagHref(lang: Lang, tag: string): string {
  return lang === "de" ? `/tag/${tag}` : `/en/tag/${tag}`;
}
export function topicsHref(lang: Lang): string {
  return lang === "de" ? "/aktuelles" : "/en/aktuelles";
}
export function authorHref(lang: Lang, slug: string): string {
  return lang === "de" ? `/autor/${slug}` : `/en/author/${slug}`;
}

const norm = (p: string) => p.replace(/\/+$/, "") || "/";

/**
 * Active-state helper for a plain link nav item (Journal).
 */
export function isActiveNav(href: string, pathname: string): boolean {
  return norm(href) === norm(pathname);
}

/**
 * The Entdecken group reads as active whenever the visitor is on any of the
 * browse surfaces it leads to: category pages, tag pages or the topics page
 * (both language variants).
 */
export function isEntdeckenActive(pathname: string): boolean {
  const p = norm(pathname);
  return (
    /^\/(en\/)?kategorie\//.test(p) ||
    /^\/en\/category\//.test(p) ||
    /^\/(en\/)?tag\//.test(p) ||
    p === "/aktuelles" ||
    p === "/en/aktuelles"
  );
}
