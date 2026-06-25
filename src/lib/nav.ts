/**
 * Single source of truth for the public blog navigation, consumed by both
 * the top JournalHeader (incl. its mobile panel) and the article-page
 * ArticleSidebar so the two never drift. "Kundenportal" deliberately lives
 * only in the footer, not the primary nav.
 */
export interface BlogNavItem {
  key: "journal" | "aktuelles" | "rss";
  label: string;
  href: string;
}

export function navItems(lang: "de" | "en"): BlogNavItem[] {
  const home = lang === "de" ? "/" : "/en/";
  const aktuelles = lang === "de" ? "/aktuelles" : "/en/aktuelles";
  return [
    { key: "journal", label: "Journal", href: home },
    { key: "aktuelles", label: lang === "de" ? "Aktuelles" : "Latest", href: aktuelles },
    { key: "rss", label: "RSS", href: "/rss.xml" },
  ];
}

/**
 * Active-state helper: matches a nav item's href against the current path
 * (trailing slash normalised). RSS never reads as the active page.
 */
export function isActiveNav(href: string, pathname: string): boolean {
  if (href === "/rss.xml") return false;
  const norm = (p: string) => p.replace(/\/+$/, "") || "/";
  return norm(href) === norm(pathname);
}
