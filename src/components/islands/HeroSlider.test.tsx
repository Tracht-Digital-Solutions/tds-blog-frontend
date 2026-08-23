import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import HeroSlider, { type SliderPost } from "./HeroSlider";

/**
 * The hero slider's links were unclickable in production and nothing here
 * could have seen it: jsdom implements `setPointerCapture` as a no-op and does
 * not reproduce the retargeting that broke them. So this suite guards the
 * mechanism from BOTH sides — a source assertion on where capture is taken,
 * plus behaviour for the click-suppression that surrounds it.
 */

const source = readFileSync(join(__dirname, "HeroSlider.tsx"), "utf8");

/** Comments here NAME the trap, so they would satisfy every match below. */
const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^[ \t]*\/\/.*$/gm, "");

const posts: SliderPost[] = [
  { slug: "erster-beitrag", category: "Praxis", title: "Erster Beitrag", excerpt: "Kurz.", publishedAt: "2026-08-01", coverHint: null },
  { slug: "zweiter-beitrag", category: "Praxis", title: "Zweiter Beitrag", excerpt: "Kurz.", publishedAt: "2026-07-01", coverHint: null },
  { slug: "dritter-beitrag", category: "Praxis", title: "Dritter Beitrag", excerpt: "Kurz.", publishedAt: "2026-06-01", coverHint: null },
] as SliderPost[];

// jsdom ships no matchMedia; the island probes prefers-reduced-motion on mount.
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

/**
 * `fireEvent.pointerDown` builds a plain Event when jsdom has no PointerEvent
 * constructor, and a plain Event carries no `clientX` — the drag maths then
 * runs on NaN and every gesture silently reads as "did not move", which is a
 * test that passes by doing nothing. A MouseEvent named `pointerdown` has the
 * coordinates and React dispatches it to onPointerDown all the same.
 */
function pointer(el: Element, type: string, clientX: number) {
  fireEvent(el, new MouseEvent(type, { bubbles: true, cancelable: true, clientX, button: 0 }));
}

afterEach(cleanup);

describe("HeroSlider — pointer capture", () => {
  /**
   * The defect: `setPointerCapture` on pointerdown makes the browser dispatch
   * the trailing `click` at the capture element instead of the element under
   * the pointer, so every `<a>` inside the stage stops navigating. The gesture
   * still needs capture once it IS a drag (a release outside the band has to
   * land in endDrag) — so the rule is *where*, not *whether*.
   */
  it("does not take the pointer on pointerdown", () => {
    const down = code.slice(code.indexOf("const onPointerDown"), code.indexOf("const onPointerMove"));
    expect(down).not.toContain("setPointerCapture");
  });

  it("takes it once the gesture passes the drag threshold", () => {
    const move = code.slice(code.indexOf("const onPointerMove"), code.indexOf("const endDrag"));
    expect(move).toContain("setPointerCapture");
  });

  /**
   * Capture on pointerdown was also suppressing the browser's native
   * drag-and-drop for free. The slide is links plus an image, so without it a
   * horizontal press-and-move starts a link drag, Chrome fires `pointercancel`
   * on the FIRST move, and the carousel stops responding to the gesture
   * entirely — arrows and tabs still work, nothing errors, and jsdom fires no
   * pointercancel, so only a browser shows it.
   */
  it("refuses the native link drag", () => {
    expect(code).toContain("onDragStart={(e) => e.preventDefault()}");
  });
});

describe("HeroSlider — links", () => {
  it("points the headline, the cover and the CTA at the article", () => {
    render(<HeroSlider latest={posts} popular={[]} lang="de" />);
    const hrefs = Array.from(document.querySelectorAll<HTMLAnchorElement>("a")).map((a) => a.getAttribute("href"));
    // headline + cover + "Artikel lesen" all resolve to the lead post
    expect(hrefs.filter((h) => h === "/erster-beitrag").length).toBeGreaterThanOrEqual(3);
    // the two secondary titles keep their own targets
    expect(hrefs).toContain("/zweiter-beitrag");
    expect(hrefs).toContain("/dritter-beitrag");
  });

  it("prefixes /en for the English tree", () => {
    render(<HeroSlider latest={posts} popular={[]} lang="en" />);
    expect(document.querySelector('a[href="/en/erster-beitrag"]')).not.toBeNull();
  });

  it("lets a plain press-and-release click through", () => {
    render(<HeroSlider latest={posts} popular={[]} lang="de" />);
    const stage = document.querySelector(".hero-stage") as HTMLElement;
    const cta = screen.getAllByText("Artikel lesen")[0].closest("a") as HTMLAnchorElement;

    pointer(stage, "pointerdown", 200);
    pointer(stage, "pointerup", 200);

    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    cta.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(false);
  });

  it("swallows the click that ends a real drag", () => {
    render(<HeroSlider latest={posts} popular={posts} lang="de" />);
    const stage = document.querySelector(".hero-stage") as HTMLElement;
    const cta = screen.getAllByText("Artikel lesen")[0].closest("a") as HTMLAnchorElement;

    pointer(stage, "pointerdown", 300);
    pointer(stage, "pointermove", 120);
    pointer(stage, "pointerup", 120);

    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    cta.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
  });
});
