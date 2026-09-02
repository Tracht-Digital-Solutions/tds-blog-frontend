/**
 * The listing-page alternates.
 *
 * The rule under test is "ask, never assume". A prefix-swapped guess is what
 * these helpers exist to avoid: German posts are tagged `webshop` and their
 * English twins `online-shop`, so `/en/tag/webshop` is a 404 — and a single
 * dangling alternate invalidates the hreflang set on both sides.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./routes", () => ({
  byTag: vi.fn(),
  byCategory: vi.fn(),
  byAuthor: vi.fn(),
  archivePage: vi.fn(),
}));

const routes = await import("./routes");
const {
  archiveAlternate,
  authorAlternate,
  categoryAlternate,
  otherLang,
  tagAlternate,
} = await import("./alternates");

const post = { slug: "x" } as never;

beforeEach(() => {
  vi.mocked(routes.byTag).mockReset();
  vi.mocked(routes.byCategory).mockReset();
  vi.mocked(routes.byAuthor).mockReset();
  vi.mocked(routes.archivePage).mockReset();
});

describe("otherLang", () => {
  it("flips the tree", () => {
    expect(otherLang("de")).toBe("en");
    expect(otherLang("en")).toBe("de");
  });
});

describe("tagAlternate", () => {
  it("points at the other tree when that tag really exists there", async () => {
    vi.mocked(routes.byTag).mockResolvedValue({ posts: [post], allPosts: [post] });
    await expect(tagAlternate("de", "webshop")).resolves.toBe("/en/tag/webshop");
    await expect(tagAlternate("en", "webshop")).resolves.toBe("/tag/webshop");
    expect(routes.byTag).toHaveBeenCalledWith("en", "webshop");
  });

  it("returns null when the other tree has no such tag", async () => {
    vi.mocked(routes.byTag).mockResolvedValue(null);
    await expect(tagAlternate("de", "webshop")).resolves.toBeNull();
  });

  it("returns null for a tag page that exists but is empty", async () => {
    vi.mocked(routes.byTag).mockResolvedValue({ posts: [], allPosts: [post] });
    await expect(tagAlternate("de", "webshop")).resolves.toBeNull();
  });

  it("normalises and encodes the tag it emits", async () => {
    vi.mocked(routes.byTag).mockResolvedValue({ posts: [post], allPosts: [post] });
    await expect(tagAlternate("de", "  Lokaler-Handel ")).resolves.toBe(
      "/en/tag/lokaler-handel",
    );
  });
});

describe("categoryAlternate", () => {
  it("uses the other tree's segment name, not just a prefix", async () => {
    vi.mocked(routes.byCategory).mockResolvedValue({ name: "Online shop", posts: [post] });
    await expect(categoryAlternate("de", "webshop")).resolves.toBe(
      "/en/category/webshop",
    );
    await expect(categoryAlternate("en", "webshop")).resolves.toBe(
      "/kategorie/webshop",
    );
  });

  it("stays silent when the counterpart is filed under another slug", async () => {
    // The realistic case: DE "Webshop" ↔ EN "Online shop".
    vi.mocked(routes.byCategory).mockResolvedValue(null);
    await expect(categoryAlternate("de", "webshop")).resolves.toBeNull();
  });
});

describe("authorAlternate", () => {
  it("links the author's page in the other tree when they have posts there", async () => {
    vi.mocked(routes.byAuthor).mockResolvedValue({
      author: { name: "Julian Tracht", slug: "julian-tracht" } as never,
      posts: [post],
    });
    await expect(authorAlternate("de", "julian-tracht")).resolves.toBe(
      "/en/author/julian-tracht",
    );
    await expect(authorAlternate("en", "julian-tracht")).resolves.toBe(
      "/autor/julian-tracht",
    );
  });

  it("returns null for an author with nothing in the other language", async () => {
    vi.mocked(routes.byAuthor).mockResolvedValue(null);
    await expect(authorAlternate("de", "julian-tracht")).resolves.toBeNull();
  });
});

describe("archiveAlternate", () => {
  it("mirrors a page the other tree is long enough to have", async () => {
    vi.mocked(routes.archivePage).mockResolvedValue({ allPosts: [post], page: 2 });
    await expect(archiveAlternate("de", 2)).resolves.toBe("/en/page/2");
    expect(routes.archivePage).toHaveBeenCalledWith("en", "2");
  });

  it("returns null when the other tree is shorter", async () => {
    vi.mocked(routes.archivePage).mockResolvedValue(null);
    await expect(archiveAlternate("de", 7)).resolves.toBeNull();
  });

  it("never mirrors page 1 — it is the home page, not an archive URL", async () => {
    await expect(archiveAlternate("de", 1)).resolves.toBeNull();
    await expect(archiveAlternate("de", 0)).resolves.toBeNull();
    await expect(archiveAlternate("de", 2.5)).resolves.toBeNull();
    expect(routes.archivePage).not.toHaveBeenCalled();
  });
});
