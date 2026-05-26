/**
 * Schema.org JSON-LD generators for the journal.
 *
 * The Organization / Person nodes mirror tds-landingpage's so a search
 * engine that crawls both sites can stitch them into a single entity
 * graph via the @id URLs. The marketing site is the canonical home —
 * Organization @id lives at `tracht-digital.de/#organization`,
 * Person at `tracht-digital.de/#person`.
 *
 * The blog adds:
 *   - Blog (the index)
 *   - WebSite (with the journal-specific SearchAction stub)
 *   - BlogPosting (per post)
 *   - BreadcrumbList (per post)
 */
import { siteConfig } from "./seo";

type WithContext<T extends Record<string, unknown> = Record<string, unknown>> =
  T & { "@context": "https://schema.org" };

/** @id for the Organization, anchored on the marketing domain. */
const orgId = `${siteConfig.marketingUrl}/#organization`;
const personId = `${siteConfig.marketingUrl}/#person`;

/**
 * Light Organization stub. The marketing site emits the full
 * Organization graph; here we only reference it by @id so search
 * engines can resolve it without us duplicating address/founder.
 */
export function organizationRef() {
  return {
    "@type": "Organization",
    "@id": orgId,
    name: siteConfig.name,
    url: siteConfig.marketingUrl,
  };
}

export function personRef() {
  return {
    "@type": "Person",
    "@id": personId,
    name: siteConfig.founder.name,
    jobTitle: siteConfig.founder.jobTitle,
    url: siteConfig.marketingUrl,
    worksFor: { "@id": orgId },
  };
}

/**
 * WebSite for the blog with a Sgl SearchAction. Since the journal
 * has no first-class search, we point the action template at the
 * current page-based listing — AI crawlers prefer *something* over
 * nothing here.
 */
export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.blogName.de,
    description: siteConfig.description.de,
    publisher: { "@id": orgId },
    inLanguage: ["de-DE", "en-GB"],
  };
}

/**
 * Blog node — used on every index page. inLanguage matters here so
 * Google distinguishes the DE and EN landings.
 */
export function blogSchema(lang: "de" | "en") {
  const langUrl = lang === "en" ? `${siteConfig.url}/en/` : `${siteConfig.url}/`;
  return {
    "@type": "Blog",
    "@id": `${langUrl}#blog`,
    url: langUrl,
    name: siteConfig.blogName[lang],
    description: siteConfig.description[lang],
    inLanguage: lang === "de" ? "de-DE" : "en-GB",
    publisher: { "@id": orgId },
    author: { "@id": personId },
  };
}

interface BlogPostingInput {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  publishedAt: string | null;
  /** Optional — falls back to `publishedAt` if the API doesn't return one. */
  updatedAt?: string | null;
  lang: "de" | "en";
  /** Absolute URL to the OG image (1200×630). */
  imageUrl: string;
  /** Word count for `wordCount`. Computed once by the caller. */
  wordCount: number;
}

export function blogPostingSchema(post: BlogPostingInput): WithContext {
  const pageUrl = new URL(
    post.lang === "en" ? `/en/${post.slug}` : `/${post.slug}`,
    siteConfig.url,
  ).toString();

  const datePublished = post.publishedAt ?? undefined;
  const dateModified = post.updatedAt ?? post.publishedAt ?? undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${pageUrl}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    headline: post.title,
    description: post.excerpt,
    articleSection: post.category,
    inLanguage: post.lang === "de" ? "de-DE" : "en-GB",
    datePublished,
    dateModified,
    wordCount: post.wordCount,
    image: {
      "@type": "ImageObject",
      url: post.imageUrl,
      width: 1200,
      height: 630,
    },
    author: { "@id": personId },
    publisher: { "@id": orgId },
    isPartOf: {
      "@id": `${post.lang === "en" ? `${siteConfig.url}/en/` : `${siteConfig.url}/`}#blog`,
    },
  };
}

/** BreadcrumbList helper (Home → category → post). */
export function breadcrumbSchema(
  items: { name: string; url: string }[],
): WithContext {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function asGraph(...nodes: object[]): WithContext {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}
