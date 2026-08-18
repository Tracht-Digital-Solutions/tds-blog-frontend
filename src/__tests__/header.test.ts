import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Journal header posture test.
 *
 * Companion to layout.test.ts, same principle: these pin invariants whose
 * violation produces no error, no failing build and no visible symptom until
 * someone opens the page at a phone width.
 *
 * The mobile menu converged on the landingpage's docked sheet in tds-shared
 * 0.25.0. Before that this file carried a bespoke full-screen overlay at a
 * DIFFERENT breakpoint (`md`) with its own scroll lock (`body.drawer-open`)
 * and its own Escape handler — three details that had to agree with the
 * landingpage's and silently did not.
 */

const HEADER = join(process.cwd(), "src", "components", "JournalHeader.astro");
const GLOBAL_CSS = join(process.cwd(), "src", "styles", "global.css");
const raw = readFileSync(HEADER, "utf8");
const css = readFileSync(GLOBAL_CSS, "utf8");

/** This file documents the traps being pinned, so assert against code only. */
const source = raw
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
  .replace(/^\s*\/\/.*$/gm, "");

/**
 * The opening tag carrying `id="…"`. Walks back to the nearest `<` rather than
 * matching `<tag[\s\S]*?id="…"`, which happily starts at an EARLIER tag of the
 * same name and swallows everything between — the header has three buttons, so
 * that form silently asserts against the wrong element.
 */
function openingTag(id: string): string {
  const at = source.indexOf(`id="${id}"`);
  if (at === -1) return "";
  const start = source.lastIndexOf("<", at);
  const end = source.indexOf(">", at);
  return start === -1 || end === -1 ? "" : source.slice(start, end + 1);
}

describe("mobile navigation", () => {
  it("takes its mechanics from tds-shared", () => {
    expect(source).toMatch(
      /import \{ mountMobileNav \} from "@tracht-digital-solutions\/tds-shared\/nav"/,
    );
    expect(source).toContain("mountMobileNav({");
  });

  it("does not hand-roll the scroll lock", () => {
    expect(source).not.toContain("drawer-open");
    expect(source).not.toContain("body.style.overflow");
    // And the CSS half of the old lock is gone with it, rather than lingering
    // as a rule nothing sets.
    expect(css).not.toContain("drawer-open");
  });

  it("keeps Escape for the Entdecken disclosure but not for the menu", () => {
    // The desktop disclosure is a separate control with its own state and
    // legitimately keeps its handler; the menu's must come from the shared
    // module, or the two race for the same key.
    // Only the DOCUMENT-level ones: the search field's own Enter handler is
    // element-scoped and has nothing to do with either disclosure.
    const globalKeydown = source.match(/document\.addEventListener\(\s*"keydown"/g) ?? [];
    expect(globalKeydown).toHaveLength(1);
    expect(source).not.toMatch(/matchMedia\(\s*"\(min-width/);
  });

  it("wears the shared classes on the toggle and the panel", () => {
    expect(source).toMatch(/class="btn btn-ghost tds-menu-toggle"/);
    expect(source).toMatch(/class="tds-mobile-menu\b/);
    expect(source).toContain("tds-menu-bar-top");
  });

  it("hides its desktop chrome at lg, the width every public site uses", () => {
    // The panel's own breakpoint is baked into `.tds-mobile-menu`; if the bar
    // hid its nav at `md` the two would disagree for 256px of viewport, with
    // neither the desktop nav nor a hamburger on screen.
    expect(source).not.toMatch(/\bmd:(flex|hidden)\b/);
    for (const cls of ["hidden lg:flex", "flex-1 lg:hidden"]) {
      expect(source).toContain(cls);
    }
  });

  it("never hides the mobile chrome with a utility", () => {
    // `hidden` loses to unlayered `.btn { display: inline-flex }`.
    const toggle = openingTag("jnl-menu-toggle");
    const panel = openingTag("jnl-mobile-menu");
    expect(toggle).not.toBe("");
    expect(panel).not.toBe("");
    expect(toggle).not.toMatch(/\blg:hidden\b/);
    expect(panel).not.toMatch(/\blg:hidden\b/);
  });

  it("keeps the panel's docking offset and its max-height in agreement", () => {
    const panel = openingTag("jnl-mobile-menu");
    const top = panel.match(/top-\[([\d.]+rem)\]/)?.[1];
    const inset = panel.match(/--tds-mobile-menu-inset:\s*([\d.]+rem)/)?.[1];
    expect(top).toBeDefined();
    expect(inset).toBe(top);
  });

  it("no longer styles the panel container itself", () => {
    // Only the journal's editorial link optics stay local. A re-declared
    // container is how the surfaces drift apart again.
    const style = raw.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? "";
    expect(style).not.toMatch(/\.jnl-fullmenu\s*\{/);
    expect(style).not.toMatch(/\.tds-mobile-menu\s*\{/);
  });

  it("bundles the script rather than inlining it", () => {
    expect(raw).not.toMatch(/<script[^>]*\bis:inline\b/);
  });
});
