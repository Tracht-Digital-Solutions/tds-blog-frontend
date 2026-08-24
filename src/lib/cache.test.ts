import { beforeEach, describe, expect, it, vi } from "vitest";
import { resolveEvents } from "@tracht-digital-solutions/tds-shared/cache";

const posts = [
  {
    slug: "astro-schnell",
    lang: "de",
    category: "Technik & Handwerk",
    tags: "astro, performance",
    author: { slug: "julian", name: "Julian" },
  },
  { slug: "zweiter", lang: "de", category: "Technik & Handwerk", tags: "astro", author: null },
];

vi.mock("./routes", () => ({
  corpus: vi.fn(async () => posts),
}));

const { corpus } = await import("./routes");
const { alwaysPaths, cacheEvents } = await import("./cache");

/**
 * This site's route table, as the cache sees it.
 *
 * The blog's map is the one worth testing hardest: it is the only one that
 * has to LOOK THE ARTICLE UP (an article's category, tags and author are
 * properties of the article, not of the event), and the only one whose two
 * language trees do not mirror by prefix.
 */
describe("cacheEvents", () => {
  beforeEach(() => {
    vi.mocked(corpus).mockClear();
  });

  const paths = async (events: Parameters<typeof resolveEvents>[1]) =>
    (await resolveEvents(cacheEvents, events)).paths;

  it("rebuilds the article, its print view and the pages that list it", async () => {
    const result = await paths([{ type: "post", id: "astro-schnell", lang: "de" }]);

    expect(result).toContain("/astro-schnell");
    expect(result).toContain("/astro-schnell/print");
    expect(result).toContain("/");
    expect(result).toContain("/rss.xml");
    // The "Für Sie" island reads this at runtime instead of the content API,
    // so a new article is invisible to it until this is rebuilt.
    expect(result).toContain("/interests-index.json");
    expect(result).toContain("/sitemap-0.xml");
  });

  it("rebuilds the taxonomy pages the article actually appears on", async () => {
    // The whole reason the resolver is async. Without the lookup, saving an
    // article would never refresh the category page listing it.
    const result = await paths([{ type: "post", id: "astro-schnell", lang: "de" }]);

    expect(result).toContain("/kategorie/technik-handwerk");
    expect(result).toContain("/tag/astro");
    expect(result).toContain("/tag/performance");
    expect(result).toContain("/autor/julian");
  });

  it("uses the English segment names, which are not a prefix of the German ones", async () => {
    const result = await paths([{ type: "post", id: "astro-schnell", lang: "en" }]);

    expect(result).toContain("/en/astro-schnell");
    expect(result).toContain("/en/category/technik-handwerk");
    expect(result).toContain("/en/author/julian");
    // The German spellings must not leak into the English tree.
    expect(result).not.toContain("/en/kategorie/technik-handwerk");
    expect(result).not.toContain("/en/autor/julian");
  });

  it("covers both trees when the event names no language", async () => {
    const result = await paths([{ type: "post", id: "astro-schnell" }]);
    expect(result).toContain("/astro-schnell");
    expect(result).toContain("/en/astro-schnell");
  });

  it("skips taxonomy for an article it cannot find", async () => {
    const result = await paths([{ type: "post", id: "gibt-es-nicht", lang: "de" }]);
    // The article's own paths are still rebuilt — the corpus may simply be
    // behind — but nothing is invented for a post that is not there.
    expect(result).toContain("/gibt-es-nicht");
    expect(result).not.toContain("/kategorie/technik-handwerk");
  });

  it("rebuilds only the entry points for a landing-block change", async () => {
    // The cookie banner and AdSense config live in the landingpage's blocks
    // and appear on every page here — but rebuilding the whole corpus for a
    // banner toggle would be a denial of service against our own API.
    expect(await paths([{ type: "block", id: "ads" }])).toEqual(["/", "/en/"]);
  });

  it("knows the legal documents are not its business", async () => {
    const result = await resolveEvents(cacheEvents, [{ type: "legal", id: "agb" }]);
    expect(result.paths).toEqual([]);
    // Declared, not unknown: silence here is intentional, and saying so keeps
    // a real typo in an event type visible.
    expect(result.unknown).toEqual([]);
  });

  it("reports an event type it does not know", async () => {
    const result = await resolveEvents(cacheEvents, [{ type: "tool", id: "qr" }]);
    expect(result.unknown).toEqual(["tool"]);
  });

  it("lists the entry points a cold-cache rebuild needs", async () => {
    // Articles are deliberately absent: the cache cannot know the corpus, and
    // enumerating it here would be a fourth copy of the route table.
    expect(alwaysPaths).toContain("/");
    expect(alwaysPaths).toContain("/en/");
    expect(alwaysPaths).toContain("/sitemap-index.xml");
    expect(alwaysPaths.some((p) => p.includes("/kategorie/"))).toBe(false);
  });
});
