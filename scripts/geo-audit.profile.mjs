/**
 * This site's profile for `tds-geo-audit` (the search and answer-engine
 * audit tds-shared ships since 0.59). The checks are shared; what a page here
 * must declare, refuse or close is decided below.
 *
 *   npm run audit:geo -- http://127.0.0.1:4321
 */
export default {
  /** The origin the markup names in canonicals, alternates and the sitemap. */
  site: "https://blog.tracht-digital.de",
  defaultBase: "http://localhost:4321",
  sitemapIndexPath: "/sitemap-index.xml",
  langs: ["de", "en"],
  titleMax: 65,
  /** Headlines come from the CMS: report an over-long one, do not fail on it. */
  titleMaxHard: false,
  descriptionRange: [80, 160],
  minWords: 300,

  /**
   * robots.txt must name every one of these and keep `requiredDisallow`
   * closed in each group. Blocking a search or fetch agent removes the site
   * from that engine's answers without producing any error, so the list is a
   * contract, not a preference. Tier A are answer engines, tier B retired
   * names kept so an old crawler reads the same rules, tier C newer answer
   * surfaces. Dataset-only crawlers (CCBot, Bytespider, Amazonbot, …) are
   * deliberately absent: they have no answer surface for this audience and
   * every added group has to repeat the whole Disallow set.
   */
  agents: [
    "*",
    // A — OpenAI, Anthropic, Perplexity, Google, Apple
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
    // B — retired names
    "Claude-Web",
    "anthropic-ai",
    // C — Meta AI, DuckDuckGo, Mistral
    "meta-externalagent",
    "meta-externalfetcher",
    "DuckAssistBot",
    "MistralAI-User",
  ],
  /**
   * A listed page may legitimately have no counterpart — a tag that exists in
   * one language only, a product published in one tree. No hreflang is then
   * the honest answer, so its absence warns and reciprocity still fails.
   */
  hreflangRequired: false,

  requiredDisallow: ["/install/", "/tds/"],

  /**
   * `@id` values a reference may point at although no node on the page
   * declares them.
   *
   * The organisation and the person are one business across four properties,
   * anchored on the marketing origin. `#blog` is this site's own and is
   * declared by `blogSchema` on every listing page; an article references it
   * as `isPartOf`.
   */
  entityAnchors: [
    "https://tracht-digital.de/#organization",
    "https://tracht-digital.de/#person",
    "https://blog.tracht-digital.de/#website",
    "https://blog.tracht-digital.de/#blog",
    "https://blog.tracht-digital.de/en/#blog",
  ],

  /**
   * Types and properties this site refuses.
   *
   * No `SearchAction`: there is no search route, and AGENTS.md forbids
   * describing one that does not exist. No `HowTo` — an article is prose, not
   * a set of instructions. No ratings: nobody reviews a journal.
   */
  forbiddenTypes: ["SearchAction", "HowTo", "Review", "AggregateRating"],
  forbiddenProps: ["openingHoursSpecification", "aggregateRating", "review"],

  /**
   * The journal's copy rules. Article bodies are CMS content and are not
   * governed from here, so this is the short list that must hold whatever an
   * editor writes: no free initial consultation anywhere on the properties,
   * and no customer named or described as a case study.
   */
  bannedWords: /kostenlos\w*\s+(erst)?(gespräch|beratung)|unverbindlich\w*\s+(erst)?gespräch|referenzkunde|fallstudie/i,

  llmsBudgetBytes: 24 * 1024,

  /**
   * `/llms.txt` indexes the ARTICLES and the two front pages, not the
   * taxonomy. The journal's sitemap also lists every tag, category, author and
   * archive page — two dozen URLs that are navigation, not content. Requiring
   * them in the file would bury the articles under their own index, for a
   * reader whose only question is what is published here. Categories are named
   * anyway, with their article counts; the sitemap and the feeds carry the
   * complete list, and the file points at both.
   */
  llmsCovers(path) {
    return !/^\/(en\/)?(tag|autor|author|aktuelles|page|seite|rss)(\/|$)/.test(path);
  },

  /** Nothing to skip. */
  skipPaths: [],

  /**
   * Which structured data a page of this kind has to carry, and whether it
   * must name a date.
   *
   * The article route is the root one (`/<slug>`), so it is matched LAST —
   * every listing route has to be recognised before a bare segment can be
   * treated as a slug.
   */
  pageKind(path) {
    if (path === "/" || path === "/en/") {
      return { kind: "index", requiredTypes: ["WebSite", "Blog", "Organization", "ItemList"] };
    }
    if (/^\/(en\/)?(aktuelles|page\/\d+|seite\/\d+)$/.test(path)) {
      return { kind: "archive", requiredTypes: ["WebSite", "Blog", "CollectionPage", "BreadcrumbList"] };
    }
    if (/^\/(kategorie|en\/category|tag|en\/tag)\/[^/]+$/.test(path)) {
      return { kind: "taxonomy", requiredTypes: ["WebSite", "Blog", "CollectionPage", "BreadcrumbList"] };
    }
    if (/^\/(autor|en\/author)\/[^/]+$/.test(path)) {
      return { kind: "author", requiredTypes: ["WebSite", "Blog", "ProfilePage", "ItemList", "BreadcrumbList"] };
    }
    if (/^\/(en\/)?rss$/.test(path)) {
      return { kind: "feed-info", requiredTypes: ["WebSite", "BreadcrumbList"] };
    }
    if (/^\/(en\/)?[^/]+$/.test(path)) {
      // An article. `requireDate` is the point of this whole profile: the
      // graph has always carried `dateModified` while the page showed only a
      // publication date in plain text.
      return {
        kind: "article",
        requiredTypes: ["BlogPosting", "Organization", "BreadcrumbList"],
        requireDate: true,
      };
    }
    return { kind: "other", requiredTypes: [] };
  },

  /** No checks beyond the universal set. */
  extraCheckIds: [],
};
