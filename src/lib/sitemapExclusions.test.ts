import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { groupExcluded, hreflangGroup, matchesPattern } from "./sitemapExclusions";

/**
 * The comparison this site performs against the list the panel maintains.
 *
 * It has to agree, rule for rule, with `SitemapExclusions::matches()` in
 * `tds-core-frontend-api` — the API validates what an operator may type, so a
 * looser matcher here would accept a pattern the panel rejects, and a stricter
 * one would silently ignore a pattern it accepted. Either way the only symptom
 * is a page that stayed indexed when somebody asked for it to go.
 */
describe("matchesPattern", () => {
  it("matches an exact path either way around the trailing slash", () => {
    expect(matchesPattern("/mein-artikel", "/mein-artikel")).toBe(true);
    expect(matchesPattern("/mein-artikel/", "/mein-artikel")).toBe(true);
    expect(matchesPattern("/mein-artikel", "/mein-artikel/")).toBe(true);
  });

  it("does not match a longer path that merely starts the same", () => {
    expect(matchesPattern("/mein-artikel-2", "/mein-artikel")).toBe(false);
  });

  it("treats a trailing star as a prefix", () => {
    expect(matchesPattern("/tag/steuern", "/tag/*")).toBe(true);
    expect(matchesPattern("/tag/a/b", "/tag/*")).toBe(true);
    expect(matchesPattern("/tag", "/tag/*")).toBe(false);
  });

  it("is case-sensitive, because URL paths are", () => {
    expect(matchesPattern("/Mein-Artikel", "/mein-artikel")).toBe(false);
  });

  it("ignores an empty pattern instead of matching everything", () => {
    expect(matchesPattern("/mein-artikel", "")).toBe(false);
    expect(matchesPattern("/mein-artikel", "   ")).toBe(false);
  });
});

/**
 * The part that is specific to this site: the two trees are NOT a prefix pair.
 * Articles and tags mirror; categories and authors are translated segments.
 */
describe("hreflangGroup", () => {
  it("pairs an article with its English twin", () => {
    expect(hreflangGroup("/mein-artikel")).toEqual(["/mein-artikel", "/en/mein-artikel"]);
  });

  it("returns the same pair when handed the English article URL", () => {
    // The group is a property of the PAGE. Without this, excluding via the
    // English URL would leave the German article in the sitemap, still naming
    // an alternate that is gone.
    expect(hreflangGroup("/en/mein-artikel")).toEqual(["/mein-artikel", "/en/mein-artikel"]);
  });

  it("translates the category segment across the trees", () => {
    expect(hreflangGroup("/kategorie/recht")).toEqual([
      "/kategorie/recht",
      "/en/category/recht",
    ]);
    expect(hreflangGroup("/en/category/recht")).toEqual([
      "/kategorie/recht",
      "/en/category/recht",
    ]);
  });

  it("translates the author segment across the trees", () => {
    expect(hreflangGroup("/autor/julian")).toEqual(["/autor/julian", "/en/author/julian"]);
    expect(hreflangGroup("/en/author/julian")).toEqual(["/autor/julian", "/en/author/julian"]);
  });

  it("leaves the tag segment alone — it is the same word in both trees", () => {
    expect(hreflangGroup("/tag/steuern")).toEqual(["/tag/steuern", "/en/tag/steuern"]);
  });

  it("pairs the two home pages", () => {
    expect(hreflangGroup("/")).toEqual(["/", "/en/"]);
    expect(hreflangGroup("/en/")).toEqual(["/", "/en/"]);
  });

  it("does not mistake an article whose slug starts with 'en' for the English tree", () => {
    // `/energie` must not be read as `/en` + `/ergie`.
    expect(hreflangGroup("/energie")).toEqual(["/energie", "/en/energie"]);
  });
});

describe("groupExcluded", () => {
  it("drops the whole group from either side of an article", () => {
    expect(groupExcluded(hreflangGroup("/mein-artikel"), ["/mein-artikel"])).toBe(true);
    expect(groupExcluded(hreflangGroup("/mein-artikel"), ["/en/mein-artikel"])).toBe(true);
  });

  it("drops a category from either tree's spelling", () => {
    expect(groupExcluded(hreflangGroup("/kategorie/recht"), ["/en/category/recht"])).toBe(true);
  });

  it("keeps a group no pattern names", () => {
    expect(groupExcluded(hreflangGroup("/mein-artikel"), ["/tag/*"])).toBe(false);
  });

  it("keeps everything when the list is empty", () => {
    expect(groupExcluded(hreflangGroup("/mein-artikel"), [])).toBe(false);
  });
});

/**
 * The fetch is fail-soft in ONE direction on purpose: unreachable means
 * "nothing excluded". The opposite default would empty the sitemap on a hiccup,
 * and because the API's own route is fail-soft too, neither end would go red.
 */
describe("exclusionPatterns", () => {
  const original = globalThis.fetch;

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    globalThis.fetch = original;
  });

  async function patternsWith(fetchImpl: typeof globalThis.fetch): Promise<string[]> {
    globalThis.fetch = fetchImpl;
    const mod = await import("./sitemapExclusions");
    return mod.exclusionPatterns();
  }

  it("reads the list the API returns", async () => {
    const patterns = await patternsWith((async () =>
      new Response(JSON.stringify({ site: "blog", paths: ["/tag/*"] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })) as typeof globalThis.fetch);
    expect(patterns).toEqual(["/tag/*"]);
  });

  it("asks for THIS site by name", async () => {
    let seen = "";
    await patternsWith((async (input: RequestInfo | URL) => {
      seen = String(input);
      return new Response(JSON.stringify({ paths: [] }), { status: 200 });
    }) as typeof globalThis.fetch);
    expect(seen).toContain("site=blog");
    expect(seen).toContain("/sitemap-exclusions");
  });

  it("excludes nothing when the API is unreachable", async () => {
    const patterns = await patternsWith((() =>
      Promise.reject(new Error("ECONNREFUSED"))) as typeof globalThis.fetch);
    expect(patterns).toEqual([]);
  });

  it("excludes nothing on a non-OK response", async () => {
    const patterns = await patternsWith((async () =>
      new Response("nope", { status: 500 })) as typeof globalThis.fetch);
    expect(patterns).toEqual([]);
  });

  it("excludes nothing when the payload is the wrong shape", async () => {
    const patterns = await patternsWith((async () =>
      new Response(JSON.stringify({ paths: "everything" }), {
        status: 200,
      })) as typeof globalThis.fetch);
    expect(patterns).toEqual([]);
  });

  it("drops blank entries rather than treating them as a match-all", async () => {
    const patterns = await patternsWith((async () =>
      new Response(JSON.stringify({ paths: ["", "  ", "/keep", 7] }), {
        status: 200,
      })) as typeof globalThis.fetch);
    expect(patterns).toEqual(["/keep"]);
  });
});
