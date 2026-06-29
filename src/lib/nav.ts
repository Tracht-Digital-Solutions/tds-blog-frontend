/**
 * Single source of truth for the public blog navigation, consumed by the
 * top JournalHeader (incl. its mobile drawer) and the article-page
 * ArticleSidebar so the two never drift.
 *
 * The primary nav is Journal · Entdecken ▾. "Entdecken" is a group
 * node — its three sections (Kategorien · Beliebte Tags · Aktuelle Themen)
 * are built at render time from `getTaxonomy()` (categories/tags are
 * derived from the corpus, so they can't be hard-coded here). The href
 * helpers below keep those links consistent across surfaces.
 *
 * Labels stay here as DE/EN literals to match the existing local
 * convention; promoting them into tds-shared i18n is a follow-up.
 */
export type Lang = "de" | "en";

export type BlogNavNode =
  | { kind: "link"; key: "journal"; label: string; href: string }
  | { kind: "group"; key: "entdecken"; label: string };

export function primaryNav(lang: Lang): BlogNavNode[] {
  const home = lang === "de" ? "/" : "/en/";
  return [
    { kind: "link", key: "journal", label: "Journal", href: home },
    { kind: "group", key: "entdecken", label: lang === "de" ? "Entdecken" : "Discover" },
  ];
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
