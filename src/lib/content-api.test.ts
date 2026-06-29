import { afterEach, describe, expect, it, vi } from "vitest";
import { listAllPosts, listPopular } from "./content-api";
import { demoPostList } from "./demoContent";

/**
 * Build-time data layer. The resilience contract is the point: a build-
 * time outage must NOT break `astro build` — listAllPosts/listPopular fall
 * back to demo posts so the blog never ships empty. Also pins the cursor
 * pagination that walks the content-api in pages of 50.
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
