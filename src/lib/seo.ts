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
  /**
   * Meta descriptions. Google renders roughly the first 155–160 characters,
   * so both stay under 160 — `metaDescription.test.ts` fails the build if
   * either grows past it or shrinks below the length at which a description
   * carries any information.
   *
   * The blog is one of the two INDEXABLE properties, so it carries the same
   * two keyword commitments as the landingpage (root CLAUDE.md): the exact
   * phrase "Digitalisierung für Unternehmen" and the local signal
   * Schwarzenbek/Hamburg. The local half was missing here entirely until
   * 2026-08-16 — the journal ranked as a generic dev blog with nothing tying
   * it to the business it belongs to. Trim the topic list before either.
   */
  description: {
    de: "Praxisnahe Artikel über Digitalisierung für Unternehmen, Webentwicklung und Automatisierung — das Journal von Tracht Digital Solutions aus Schwarzenbek.",
    en: "Hands-on articles on digitalization for businesses, web development and automation — the journal of Tracht Digital Solutions, Schwarzenbek near Hamburg.",
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
