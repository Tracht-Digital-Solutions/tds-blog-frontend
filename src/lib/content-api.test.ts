import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  adsConfig,
  cookieBannerEnabled,
  listAllPosts,
  listPopular,
  resolveCoverHint,
} from "./content-api";
import { contentCache } from "./cache";
import { demoPostList } from "./demoContent";

/**
 * The data layer. The resilience contract is the point: an API outage must
 * neither break `astro build` nor 500 a request — listAllPosts/listPopular
 * fall back to demo posts so the blog never renders empty. Also pins the
 * cursor pagination that walks the content API in pages of 50, and the shared
 * memoised read behind the two landing-block settings.
 */
function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("listAllPosts", () => {
  it("returns the posts from a single page when nextCursor is null", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({ posts: [{ id: 1, slug: "a", title: "A" }], nextCursor: null }),
      ),
    );

    const posts = await listAllPosts("de");
    expect(posts.map((p) => p.id)).toEqual([1]);
  });

  it("follows the cursor across multiple pages", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ posts: [{ id: 1, slug: "a" }], nextCursor: 1 }))
      .mockResolvedValueOnce(jsonResponse({ posts: [{ id: 2, slug: "b" }], nextCursor: null }));
    vi.stubGlobal("fetch", fetchMock);

    const posts = await listAllPosts("de");
    expect(posts.map((p) => p.id)).toEqual([1, 2]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("falls back to demo posts on a non-OK response (build stays green)", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, 502)));

    const posts = await listAllPosts("de");
    expect(posts).toEqual(demoPostList("de"));
    expect(posts.length).toBeGreaterThan(0);
  });

  it("falls back to demo posts when fetch throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ENOTFOUND")));

    const posts = await listAllPosts("en");
    expect(posts).toEqual(demoPostList("en"));
  });
});

describe("resolveCoverHint", () => {
  it("prefixes a storage-relative /uploads path with the content-API base", () => {
    expect(resolveCoverHint("/uploads/a/pic.png")).toMatch(/^https?:\/\/.+\/content\/uploads\/a\/pic\.png$/);
  });

  it("leaves an absolute URL untouched", () => {
    expect(resolveCoverHint("https://cdn.example/x.png")).toBe("https://cdn.example/x.png");
  });

  it("passes null/empty through", () => {
    expect(resolveCoverHint(null)).toBeNull();
    expect(resolveCoverHint(undefined)).toBeNull();
    expect(resolveCoverHint("")).toBeNull();
  });
});

describe("listAllPosts cover resolution", () => {
  it("makes a relative coverHint absolute in the returned posts", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({ posts: [{ id: 1, slug: "a", coverHint: "/uploads/a/c.png" }], nextCursor: null }),
      ),
    );
    const posts = await listAllPosts("de");
    expect(posts[0].coverHint).toMatch(/\/content\/uploads\/a\/c\.png$/);
  });
});

describe("listPopular", () => {
  it("returns the popular posts on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ posts: [{ id: 5, slug: "hot" }] })),
    );

    const posts = await listPopular("de", 6);
    expect(posts[0].id).toBe(5);
  });

  it("falls back to a sliced demo list on an outage", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("down")));

    const posts = await listPopular("de", 3);
    expect(posts).toEqual(demoPostList("de").slice(0, 3));
  });
});

/**
 * The cookie-banner switch and the AdSense config are two blocks of ONE
 * payload, and `Layout.astro` reads both on every render. They share a single
 * memoised load — these pin that, because the natural way to write either
 * function is its own fetch, and reverting to that costs an extra request per
 * page render with nothing to show for it.
 */
describe("landing blocks (cookie banner + ads)", () => {
  const blocks = {
    cookie_banner: { enabled: true },
    ads: {
      enabled: true,
      publisherId: "ca-pub-1",
      defaultMode: "manual",
      slotInArticle: "111",
      slotEndArticle: "222",
    },
  };

  beforeEach(() => contentCache.invalidate());

  it("reads /landing once for both settings", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ blocks }));
    vi.stubGlobal("fetch", fetchMock);

    // Sequential on purpose: concurrent calls would only prove the in-flight
    // coalescing, not that the resolved value is kept for the generation.
    expect(await cookieBannerEnabled()).toBe(true);
    const ads = await adsConfig();

    expect(ads).toMatchObject({ enabled: true, publisherId: "ca-pub-1", defaultMode: "manual" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not remember a transport failure — the next read retries", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("ENOTFOUND"))
      .mockResolvedValue(jsonResponse({ blocks }));
    vi.stubGlobal("fetch", fetchMock);

    // The outage degrades to the safe default …
    expect(await cookieBannerEnabled()).toBe(false);
    // … but must not pin "off" onto every later page in this generation.
    expect((await adsConfig()).enabled).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("remembers a reachable API with nothing configured", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}, 404));
    vi.stubGlobal("fetch", fetchMock);

    expect(await cookieBannerEnabled()).toBe(false);
    expect((await adsConfig()).enabled).toBe(false);
    // A persistent condition, so it is a state to remember rather than a
    // fetch to repeat for every page.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
