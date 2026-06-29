import { describe, expect, it } from "vitest";
import { PAGE_SIZE, paginate } from "./pagination";

/**
 * `paginate` slices a newest-first array into a 1-indexed window and
 * computes the older/newer flags that drive the pager. The clamping and
 * boundary flags are the bug-prone bits (off-by-one pagers, negative
 * pages from a hand-typed URL), so pin them.
 */
const items = Array.from({ length: 25 }, (_, i) => i + 1);

describe("paginate", () => {
  it("returns the first window with only an older link", () => {
    const w = paginate(items, 1, 10);
    expect(w.items).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(w.page).toBe(1);
    expect(w.pageCount).toBe(3);
    expect(w.hasNewer).toBe(false);
    expect(w.hasOlder).toBe(true);
  });

  it("returns a middle window with both links", () => {
    const w = paginate(items, 2, 10);
    expect(w.items[0]).toBe(11);
    expect(w.hasNewer).toBe(true);
    expect(w.hasOlder).toBe(true);
  });

  it("returns the last (partial) window with only a newer link", () => {
    const w = paginate(items, 3, 10);
    expect(w.items).toEqual([21, 22, 23, 24, 25]);
    expect(w.hasOlder).toBe(false);
    expect(w.hasNewer).toBe(true);
  });

  it("clamps a too-large page to the last page", () => {
    const w = paginate(items, 99, 10);
    expect(w.page).toBe(3);
    expect(w.items[0]).toBe(21);
  });

  it("clamps a zero/negative page to page 1", () => {
    expect(paginate(items, 0, 10).page).toBe(1);
    expect(paginate(items, -5, 10).page).toBe(1);
  });

  it("treats an empty corpus as a single empty page", () => {
    const w = paginate([], 1, 10);
    expect(w.items).toEqual([]);
    expect(w.pageCount).toBe(1);
    expect(w.hasOlder).toBe(false);
    expect(w.hasNewer).toBe(false);
  });

  it("defaults to PAGE_SIZE when no size is given", () => {
    const w = paginate(items, 1);
    expect(w.items).toHaveLength(Math.min(PAGE_SIZE, items.length));
  });
});
