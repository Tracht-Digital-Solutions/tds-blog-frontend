import { afterEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { countHighlights, highlightRange, removeHighlights } from "./printPaginate";

/**
 * The print view's highlighter. A selection across two paragraphs used to be
 * pulled out with `extractContents()` and re-inserted inside ONE inline
 * `<mark>` — block elements inside an inline one, two paragraphs merged, and
 * the pagination thrown off. It now marks text node by text node.
 */

afterEach(() => {
  document.body.innerHTML = "";
});

function sheet() {
  document.body.innerHTML =
    '<article id="print-root"><div class="prose-print">' +
    "<p>Erster Absatz mit <strong>fettem</strong> Text.</p>" +
    "<p>Zweiter Absatz.</p>" +
    "</div></article>";
  return document.getElementById("print-root")!;
}

describe("highlightRange", () => {
  it("marks across paragraphs without moving a block into a mark", () => {
    const root = sheet();
    const [p1, p2] = Array.from(root.querySelectorAll("p"));
    const range = document.createRange();
    range.setStart(p1.firstChild!, 7); // "Absatz mit …"
    range.setEnd(p2.firstChild!, 7); // "Zweiter"
    highlightRange(range, root);

    expect(root.querySelectorAll("p")).toHaveLength(2);
    expect(root.querySelectorAll("mark p, mark div")).toHaveLength(0);
    const marked = Array.from(root.querySelectorAll("mark.print-mark"), (m) => m.textContent).join("");
    expect(marked).toBe("Absatz mit fettem Text.Zweiter");
    // The unmarked text is untouched.
    expect(p1.textContent).toBe("Erster Absatz mit fettem Text.");
    expect(p2.textContent).toBe("Zweiter Absatz.");
    // One selection is ONE highlight, whatever the number of pieces.
    expect(countHighlights(root)).toBe(1);
  });

  it("removes every piece of a highlight with one tap, and only that highlight", () => {
    const root = sheet();
    const [p1, p2] = Array.from(root.querySelectorAll("p"));
    const a = document.createRange();
    a.setStart(p1.firstChild!, 0);
    a.setEnd(p2.firstChild!, 7);
    highlightRange(a, root);
    const b = document.createRange();
    b.setStart(p2.lastChild!, 1);
    b.setEnd(p2.lastChild!, 7);
    highlightRange(b, root);
    expect(countHighlights(root)).toBe(2);

    removeHighlights(root.querySelector("mark.print-mark")!, root);
    expect(countHighlights(root)).toBe(1);
    expect(p1.querySelector("mark")).toBeNull();
    expect(p1.textContent).toBe("Erster Absatz mit fettem Text.");

    removeHighlights(root);
    expect(root.querySelector("mark")).toBeNull();
    expect(p2.textContent).toBe("Zweiter Absatz.");
  });

  it("does not mark text outside the sheet", () => {
    const root = sheet();
    const outside = document.createElement("p");
    outside.textContent = "Außerhalb";
    document.body.append(outside);
    const range = document.createRange();
    range.setStart(root.querySelector("p")!.firstChild!, 0);
    range.setEnd(outside.firstChild!, 4);
    highlightRange(range, root);
    expect(outside.querySelector("mark")).toBeNull();
  });
});

describe("print preview = paper", () => {
  const css = readFileSync(join(__dirname, "../../styles/global.css"), "utf8");
  it("never sizes the print sheet's type by the viewport", () => {
    // `vw` measures the screen in the preview and the paper in print, so the
    // two wrapped — and broke pages — differently.
    const rules = [...css.matchAll(/(\.print-[\w-]+|\.prose-print[^{]*)\{([^}]*)\}/g)];
    for (const [, selector, body] of rules) {
      expect(body, `${selector.trim()} uses a viewport unit`).not.toMatch(/\d(vw|vh|vmin|vmax|svh|dvh)\b/);
    }
  });
});
