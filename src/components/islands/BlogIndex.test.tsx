import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import BlogIndex, { type IndexPost } from "./BlogIndex";

/**
 * What this suite is here for: the index filters in place, and three things
 * about that were invisible to every other gate.
 *
 * - The status region. A grid that is silently replaced looks fine in a
 *   screenshot and reports nothing to a screen reader.
 * - The counted nouns in it. "1 Beiträge" and "1 results" are what a
 *   hard-coded plural produces, and a filter that matches exactly one post is
 *   the normal case on a small corpus.
 * - The <h1>. It lives in the hero, and the hero is not rendered while a
 *   search is running — so the results view shipped with none at all.
 */

const posts: IndexPost[] = [
  {
    slug: "webshop-lohnt-sich",
    category: "Webshop",
    title: "Lohnt sich ein Webshop",
    excerpt: "Eine ehrliche Rechnung.",
    publishedAt: "2026-08-01",
    coverHint: null,
    tags: "webshop",
  },
  {
    slug: "klein-anfangen",
    category: "Digitalisierung",
    title: "Klein anfangen",
    excerpt: "Ein Ablauf statt eines Großprojekts.",
    publishedAt: "2026-07-01",
    coverHint: null,
    tags: "digitalisierung",
  },
  {
    slug: "excel-oder-werkzeug",
    category: "Digitalisierung",
    title: "Excel oder eigenes Werkzeug",
    excerpt: "Wann eine Tabelle nicht mehr reicht.",
    publishedAt: "2026-06-01",
    coverHint: null,
    tags: "werkzeuge",
  },
] as IndexPost[];

// jsdom ships no matchMedia; the nested HeroSlider probes prefers-reduced-motion
// on mount. Same stub as HeroSlider.test.tsx.
window.matchMedia = ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: () => {},
  removeEventListener: () => {},
  addListener: () => {},
  removeListener: () => {},
  dispatchEvent: () => false,
})) as unknown as typeof window.matchMedia;

const status = () => document.querySelector('[role="status"]');
const search = (q: string) =>
  fireEvent(document, new CustomEvent("tds-blog-search", { detail: q }));

afterEach(() => {
  cleanup();
  // The island round-trips the query through `?q=` so a refresh keeps the
  // search — real behaviour, and it survives `cleanup()`. Without this reset
  // the next mount reads the previous test's query out of the URL and starts
  // in the search view, which quietly turns unrelated assertions green or red.
  history.replaceState(null, "", "/");
});

describe("the index status region", () => {
  it("says nothing until something is filtered", () => {
    render(<BlogIndex posts={posts} lang="de" pageSize={10} />);
    expect(status()).not.toBeNull();
    expect(status()!.textContent).toBe("");
  });

  it("reports a search, and uses the singular for a single hit", () => {
    render(<BlogIndex posts={posts} lang="de" pageSize={10} />);
    search("webshop");
    expect(status()!.textContent).toBe("1 Treffer für „webshop“");
    search("anfangen");
    expect(status()!.textContent).toBe("1 Treffer für „anfangen“");
  });

  it("counts English results with the right noun on both sides of one", () => {
    render(<BlogIndex posts={posts} lang="en" pageSize={10} />);
    search("webshop");
    expect(status()!.textContent).toBe("1 result for “webshop”");
    search("e");
    expect(status()!.textContent).toBe("3 results for “e”");
  });

  it("reports a category filter, which has no visible counterpart at all", () => {
    render(<BlogIndex posts={posts} lang="de" pageSize={10} />);
    const rail = screen.getAllByRole("button", { name: /Webshop/ })[0];
    fireEvent.click(rail);
    expect(status()!.textContent).toBe("1 Beitrag in der Kategorie Webshop");

    fireEvent.click(screen.getAllByRole("button", { name: /Digitalisierung/ })[0]);
    expect(status()!.textContent).toBe("2 Beiträge in der Kategorie Digitalisierung");
  });
});

describe("the index heading rank", () => {
  it("leaves the <h1> to the hero while the hero is on the page", () => {
    render(<BlogIndex posts={posts} lang="de" pageSize={10} />);
    // The hero owns it; the grid heading must not compete for the rank.
    const gridHeading = screen.getByText("Alle Beiträge", { selector: "h1,h2" });
    expect(gridHeading.tagName).toBe("H2");
  });

  it("takes the rank over in the search view, where the hero is gone", () => {
    render(<BlogIndex posts={posts} lang="de" pageSize={10} />);
    search("webshop");
    expect(document.querySelector("h1")).not.toBeNull();
    expect(document.querySelector("h1")!.textContent).toContain("Alle Beiträge");
  });
});

describe("the category filter's selected state", () => {
  it("is in the accessibility tree on the rail, not only in a class name", () => {
    render(<BlogIndex posts={posts} lang="de" pageSize={10} />);
    // Both controls filter the same list; only the mobile chips used to say so.
    for (const button of screen.getAllByRole("button", { name: /Webshop/ })) {
      expect(button.getAttribute("aria-pressed")).toBe("false");
    }
    fireEvent.click(screen.getAllByRole("button", { name: /Webshop/ })[0]);
    for (const button of screen.getAllByRole("button", { name: /Webshop/ })) {
      expect(button.getAttribute("aria-pressed")).toBe("true");
    }
  });
});
