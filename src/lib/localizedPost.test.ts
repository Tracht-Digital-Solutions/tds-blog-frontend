import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./content-api", () => ({ getPost: vi.fn() }));
vi.mock("./marked", () => ({ renderMarkdown: vi.fn(async (md: string) => `<p>${md}</p>`) }));
vi.mock("./translate", () => ({ translateText: vi.fn(), translateHtml: vi.fn() }));

import { getPost } from "./content-api";
import { translateHtml, translateText } from "./translate";
import { resolveLocalizedPost } from "./localizedPost";

/**
 * Build-time localisation of a blog post.
 *
 * This runs during `astro build`, so its governing rule is the one the whole
 * content pipeline shares: **the build never breaks on an API hiccup.** A
 * missing translation, a DeepL outage or a malformed block document must
 * degrade to readable source-language content, never to a thrown error or a
 * half-rendered page.
 *
 * The other thing worth pinning is the `translated` flag. It drives the
 * "machine-translated" notice shown to readers, and it has to be true for a
 * row the save-time DeepL sync produced as well as for a build-time
 * translation — otherwise machine output is presented as if a human wrote it.
 */

const post = (over: Record<string, unknown> = {}) => ({
  slug: "hallo-welt",
  lang: "de",
  title: "Hallo Welt",
  excerpt: "Ein Auszug.",
  body: "# Überschrift",
  ...over,
});

const mockGet = vi.mocked(getPost);
const mockText = vi.mocked(translateText);
const mockHtml = vi.mocked(translateHtml);

/** `getPost(slug, lang)` answering from a per-language map. */
const serve = (byLang: Record<string, unknown>) =>
  mockGet.mockImplementation(async (_slug: string, lang: string) => (byLang[lang] ?? null) as never);

beforeEach(() => {
  vi.clearAllMocks();
  mockText.mockResolvedValue(null);
  mockHtml.mockResolvedValue(null);
});

describe("a post authored in the requested language", () => {
  it("is used verbatim, with no translation call", async () => {
    serve({ de: post() });
    const result = await resolveLocalizedPost("hallo-welt", "de");

    expect(result?.post.title).toBe("Hallo Welt");
    expect(result?.translated).toBe(false);
    expect(result?.sourceLang).toBeNull();
    expect(mockText).not.toHaveBeenCalled();
    expect(mockHtml).not.toHaveBeenCalled();
  });

  it("renders its markdown body to HTML", async () => {
    serve({ de: post({ body: "# Titel" }) });
    const result = await resolveLocalizedPost("hallo-welt", "de");

    expect(result?.bodyHtml).toBe("<p># Titel</p>");
    expect(result?.blocks).toBeNull();
  });

  it("STILL flags a stored row the save-time sync machine-translated", async () => {
    // The row is native to this language but is machine output; presenting it
    // as human-written is the thing the notice exists to prevent.
    serve({ de: post({ machineTranslated: true }) });
    const result = await resolveLocalizedPost("hallo-welt", "de");

    expect(result?.translated).toBe(true);
    expect(result?.sourceLang).toBe("en");
  });

  it("names the opposite language as the source of a machine row", async () => {
    serve({ en: post({ lang: "en", machineTranslated: true }) });
    const result = await resolveLocalizedPost("hallo-welt", "en");

    expect(result?.sourceLang).toBe("de");
  });

  it("does not flag a hand-authored row", async () => {
    serve({ de: post({ machineTranslated: false }) });
    expect((await resolveLocalizedPost("hallo-welt", "de"))?.translated).toBe(false);
  });
});

describe("a post that exists only in the other language", () => {
  it("translates the title, excerpt and body", async () => {
    serve({ en: post({ lang: "en", title: "Hello", excerpt: "An excerpt.", body: "# Heading" }) });
    mockText.mockResolvedValueOnce("Hallo").mockResolvedValueOnce("Ein Auszug.");
    mockHtml.mockResolvedValue("<p>Überschrift</p>");

    const result = await resolveLocalizedPost("hallo-welt", "de");

    expect(result?.post.title).toBe("Hallo");
    expect(result?.post.excerpt).toBe("Ein Auszug.");
    expect(result?.bodyHtml).toBe("<p>Überschrift</p>");
    expect(result?.translated).toBe(true);
    expect(result?.sourceLang).toBe("en");
  });

  it("relabels the post with the requested language", async () => {
    // The page renders `lang` into <html lang>; leaving the source language
    // there tells a screen reader (and Google) the wrong thing.
    serve({ en: post({ lang: "en" }) });
    mockText.mockResolvedValue("Hallo");
    mockHtml.mockResolvedValue("<p>x</p>");

    expect((await resolveLocalizedPost("hallo-welt", "de"))?.post.lang).toBe("de");
  });

  it("translates FROM the language it actually found", async () => {
    serve({ en: post({ lang: "en", title: "Hello" }) });
    mockText.mockResolvedValue("Hallo");
    mockHtml.mockResolvedValue("<p>x</p>");

    await resolveLocalizedPost("hallo-welt", "de");
    expect(mockText).toHaveBeenCalledWith("Hello", "de", "en");
  });
});

describe("the build never breaks", () => {
  it("returns null when the post exists in NEITHER language", async () => {
    serve({});
    expect(await resolveLocalizedPost("nope", "de")).toBeNull();
  });

  it("falls back to the SOURCE body when translation fails", async () => {
    // A DeepL outage must yield a readable English page, not an empty one.
    serve({ en: post({ lang: "en", title: "Hello", body: "# Heading" }) });
    mockText.mockResolvedValue(null);
    mockHtml.mockResolvedValue(null);

    const result = await resolveLocalizedPost("hallo-welt", "de");

    expect(result).not.toBeNull();
    expect(result?.bodyHtml).toBe("<p># Heading</p>");
    expect(result?.post.title).toBe("Hello");
  });

  it("does NOT claim a translation that failed", async () => {
    // The notice would otherwise tell a reader the English text they are
    // looking at was translated into German.
    serve({ en: post({ lang: "en" }) });
    mockText.mockResolvedValue(null);
    mockHtml.mockResolvedValue(null);

    expect((await resolveLocalizedPost("hallo-welt", "de"))?.translated).toBe(false);
  });

  it("does not claim success when only the BODY failed", async () => {
    serve({ en: post({ lang: "en", title: "Hello" }) });
    mockText.mockResolvedValue("Hallo");
    mockHtml.mockResolvedValue(null);

    const result = await resolveLocalizedPost("hallo-welt", "de");
    expect(result?.translated).toBe(false);
    expect(result?.post.title).toBe("Hallo"); // the part that worked is kept
  });

  it("does not claim success when only the TITLE failed", async () => {
    serve({ en: post({ lang: "en", title: "Hello" }) });
    mockText.mockResolvedValue(null);
    mockHtml.mockResolvedValue("<p>Übersetzt</p>");

    const result = await resolveLocalizedPost("hallo-welt", "de");
    expect(result?.translated).toBe(false);
    expect(result?.bodyHtml).toBe("<p>Übersetzt</p>");
  });

  it("keeps the source excerpt when only the excerpt failed", async () => {
    serve({ en: post({ lang: "en", excerpt: "An excerpt." }) });
    mockText.mockResolvedValueOnce("Hallo").mockResolvedValueOnce(null);
    mockHtml.mockResolvedValue("<p>x</p>");

    expect((await resolveLocalizedPost("hallo-welt", "de"))?.post.excerpt).toBe("An excerpt.");
  });
});

describe("block posts", () => {
  const blockBody = JSON.stringify({ blocks: [{ type: "text", value: "Hallo" }] });

  it("parses the blocks and renders no markdown body", async () => {
    serve({ de: post({ bodyFormat: "blocks", body: blockBody }) });
    const result = await resolveLocalizedPost("hallo-welt", "de");

    expect(result?.blocks).toEqual([{ type: "text", value: "Hallo" }]);
    expect(result?.bodyHtml).toBe("");
  });

  it("survives a block document that is not valid JSON", async () => {
    // A malformed row must not throw and take the whole static build with it.
    serve({ de: post({ bodyFormat: "blocks", body: "{ not json" }) });
    const result = await resolveLocalizedPost("hallo-welt", "de");

    expect(result).not.toBeNull();
    expect(result?.blocks).toBeNull();
  });

  it("survives a block document with no blocks array", async () => {
    serve({ de: post({ bodyFormat: "blocks", body: JSON.stringify({ nope: true }) }) });
    expect((await resolveLocalizedPost("hallo-welt", "de"))?.blocks).toBeNull();
  });

  it("rejects a blocks member that is PRESENT but not an array", async () => {
    // A missing key and a wrong-typed key both have to end up null: only the
    // second distinguishes an `Array.isArray` guard from a plain `?? null`,
    // and handing BlockRenderer a string would throw during the build.
    for (const blocks of ['"text"', "42", "{}", "null"]) {
      serve({ de: post({ bodyFormat: "blocks", body: `{"blocks":${blocks}}` }) });
      const result = await resolveLocalizedPost("hallo-welt", "de");
      expect(result?.blocks, blocks).toBeNull();
    }
  });

  it("translates only the METADATA of a cross-language block post", async () => {
    // Documented behaviour: the blocks themselves stay in the source
    // language, because the save-time sync normally supplies a counterpart.
    serve({ en: post({ lang: "en", bodyFormat: "blocks", body: blockBody, title: "Hello" }) });
    mockText.mockResolvedValue("Hallo");

    const result = await resolveLocalizedPost("hallo-welt", "de");

    expect(result?.post.title).toBe("Hallo");
    expect(result?.blocks).toEqual([{ type: "text", value: "Hallo" }]);
    expect(mockHtml).not.toHaveBeenCalled();
  });

  it("still returns readable blocks when the metadata translation fails", async () => {
    serve({ en: post({ lang: "en", bodyFormat: "blocks", body: blockBody, title: "Hello" }) });
    mockText.mockResolvedValue(null);

    const result = await resolveLocalizedPost("hallo-welt", "de");

    expect(result?.post.title).toBe("Hello");
    expect(result?.translated).toBe(false);
    expect(result?.blocks).not.toBeNull();
  });

  it("treats a markdown post as markdown even if its body looks like JSON", async () => {
    // `bodyFormat` decides, not the shape of the body.
    serve({ de: post({ body: blockBody }) });
    const result = await resolveLocalizedPost("hallo-welt", "de");

    expect(result?.blocks).toBeNull();
    expect(result?.bodyHtml).toContain(blockBody);
  });
});
