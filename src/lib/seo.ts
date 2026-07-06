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
    de: "Das Journal von Tracht Digital Solutions — Artikel über Digitalisierung für Unternehmen, Software-Entwicklung und den Alltag dazwischen.",
    en: "The Tracht Digital Solutions journal — articles on digitalization for businesses, software development and everything in between.",
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
   * Verified postal code + locality (matches the landingpage Impressum).
   * The street stays Impressum-only over on tds-landingpage.
   */
  address: {
    postalCode: "21493",
    addressLocality: "Schwarzenbek",
    addressRegion: "Schleswig-Holstein",
    addressCountry: "DE",
  },
  /** Public social URLs — mirror tds-landingpage's seo.ts. */
  socials: {
    linkedin: "https://www.linkedin.com/in/julian-tracht/",
    github: "https://github.com/Tracht-Digital-Solutions",
  } as {
    linkedin?: string;
    github?: string;
    xing?: string;
  },
} as const;

export type SiteConfig = typeof siteConfig;
