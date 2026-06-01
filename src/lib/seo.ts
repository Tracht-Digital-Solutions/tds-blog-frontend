/**
 * Shared SEO / identity config for tds-blog.
 *
 * Keeps the Organization + Person + Blog/WebSite JSON-LD in sync with
 * tds-landingpage by reusing the same field shape. When the marketing
 * site's seo.ts is updated post-launch (real address, phone, social
 * URLs from issues #5/#6/#7 over there), mirror the change here.
 */
export const siteConfig = {
  name: "Tracht Digital Solutions",
  shortName: "TDS",
  /** Production origin. Mirrors `astro.config.mjs#site`. */
  url: "https://blog.tracht-digital.de",
  /** Sister origin — used in WebSite + Organization references. */
  marketingUrl: "https://tracht-digital.de",
  defaultLocale: "de" as const,
  description: {
    de: "Notizen aus der Werkstatt — über Software, Auftraggeber und das, was zwischen den beiden passiert.",
    en: "Notes from the workshop — on software, clients, and the things that happen in between.",
  },
  blogName: {
    de: "TDS Journal",
    en: "TDS Journal",
  },
  email: "kontakt@tracht-digital.de",
  legalName: "Julian Tracht",
  founder: {
    name: "Julian Tracht",
    jobTitle: "Inhaber & Entwickler",
  },
  /**
   * Verified location is city only. Real street pending Impressum
   * cleanup (tds-landingpage#5).
   */
  address: {
    addressLocality: "Schwarzenbek",
    addressRegion: "Schleswig-Holstein",
    addressCountry: "DE",
  },
  /** Empty until tds-landingpage#7 lands real social URLs. */
  socials: {} as {
    linkedin?: string;
    github?: string;
    xing?: string;
  },
} as const;

export type SiteConfig = typeof siteConfig;
