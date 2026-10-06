import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { bookClass, bookLabel, bookLevel, bookPages } from "./book";

describe("books", () => {
  it("grows the page block with the reading time", () => {
    expect([1, 3, 6, 10, 20].map(bookLevel)).toEqual([1, 2, 3, 4, 5]);
  });

  it("falls back to a neutral thin book without a length", () => {
    expect(bookLevel(undefined)).toBe(2);
    expect(bookLabel(undefined, "de")).toBeNull();
    expect(bookClass(null)).toBe("book book--2");
  });

  it("labels minutes and pages in both languages", () => {
    expect(bookPages(1)).toBe(1);
    expect(bookLabel(7, "de")).toBe("~7 Min. · 6 Seiten");
    expect(bookLabel(1, "en")).toBe("~1 min · 1 page");
  });

  it("has a CSS thickness for every level", () => {
    const css = readFileSync(join(process.cwd(), "src", "styles", "global.css"), "utf8");
    for (const level of [1, 2, 3, 4, 5]) expect(css).toContain(`.book--${level}`);
  });
});
