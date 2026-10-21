import { describe, expect, it } from "vitest";
import { toIndexPost } from "./indexPosts";

/**
 * The index serialises every post into its island props, so each field kept
 * here is paid for once per post on every index request (#28). Pin the set:
 * a new field must be a deliberate addition, not an object spread.
 */
const listed = {
  id: 7,
  slug: "excel-oder-werkzeug",
  lang: "de" as const,
  category: "Software",
  title: "Excel oder eigenes Werkzeug?",
  excerpt: "Eine Entscheidungshilfe.",
  coverHint: null,
  tags: "excel, software",
  publishedAt: "2026-09-01T08:00:00Z",
  viewCount: 12,
  authorId: 3,
  author: { id: 3, name: "Julian Tracht", slug: "julian-tracht", avatarUrl: null, bio: "Lange Biografie …" },
  adsMode: "default" as const,
  readingMinutes: 6,
};

describe("toIndexPost", () => {
  it("keeps only the fields the island reads", () => {
    expect(Object.keys(toIndexPost(listed)).sort()).toEqual(
      ["author", "category", "coverHint", "excerpt", "publishedAt", "readingMinutes", "slug", "tags", "title", "viewCount"],
    );
  });

  it("drops the author's id and bio", () => {
    expect(toIndexPost(listed).author).toEqual({ name: "Julian Tracht", slug: "julian-tracht", avatarUrl: null });
  });

  it("keeps a missing author and reading time as null", () => {
    const p = toIndexPost({ ...listed, author: null, readingMinutes: undefined });
    expect(p.author).toBeNull();
    expect(p.readingMinutes).toBeNull();
  });
});
