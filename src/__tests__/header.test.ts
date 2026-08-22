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

describe("the desktop search field", () => {
  it("leaves its own display to the `hidden lg:flex` on the element", () => {
    // This file is unlayered and Tailwind's utilities live in
    // `@layer utilities`, so a `display: flex` in the rule beats `.hidden`
    // outright — the search field rendered at EVERY width and nobody noticed,
    // because nothing overflowed and `body { overflow-x: hidden }` would have
    // clipped it if it had. It cost 168px in a 375px bar, and the hamburger
    // went off the right edge the moment the account menu joined the row.
    const rule = css.match(/\.nav-search \{([^}]*)\}/)?.[1] ?? "";
    expect(rule).not.toBe("");
    expect(rule).not.toMatch(/^\s*display:/m);
    expect(source).toContain('class="nav-search hidden lg:flex"');
  });
});

describe("the account menu", () => {
  /**
   * The shared session, visible in the header. The blog had no auth code at
   * all before this, so every assertion here is about a thing that fails
   * quietly: a mount inside the desktop-only cluster is invisible on a phone,
   * a utility on the island itself does nothing, and a caret pin that never
   * resolved the new version type-checks perfectly against the OLD one.
   */

  it("comes from tds-shared, not from a local copy", () => {
    expect(source).toMatch(
      /import \{[^}]*\bAccountMenu\b[^}]*\} from "@tracht-digital-solutions\/tds-shared\/components"/,
    );
  });

  it("is mounted with the page language", () => {
    expect(source).toMatch(/<AccountMenu\s+client:idle\s+lang=\{lang\}\s*\/>/);
  });

  it("says nothing to a signed-out reader", () => {
    // The blog is public and its header already carries a contact CTA; a
    // sign-in link beside it would be noise. `loggedOut` stays at its default.
    expect(source).not.toMatch(/<AccountMenu[^>]*loggedOut=/);
  });

  it("sits OUTSIDE the desktop-only cluster and before the hamburger", () => {
    // Inside `hidden lg:flex` it would vanish on a phone — where it is the
    // only control beside the hamburger, so its absence is total rather than
    // partial.
    const desktopCluster = source.indexOf('class="hidden lg:flex items-center gap-2"');
    // The cluster's own closing tag: the first `</div>` after the CTA anchor
    // that lives inside it. `lastIndexOf("btn-flat")` would find the mobile
    // sheet's copy of the same CTA, further down the file.
    const clusterEnd = source.indexOf("</div>", source.indexOf("btn-flat", desktopCluster));
    const mount = source.indexOf("<AccountMenu");
    const toggle = source.indexOf('id="jnl-menu-toggle"');

    expect(desktopCluster).toBeGreaterThan(-1);
    expect(mount).toBeGreaterThan(clusterEnd);
    expect(mount).toBeLessThan(toggle);
  });

  it("carries no visibility utility of its own", () => {
    // tds-shared's CSS is unlayered and Tailwind's utilities are layered, so
    // `hidden` on `.tds-dropdown` loses outright — it would look like the
    // island simply chose to render.
    const tag = source.slice(source.indexOf("<AccountMenu"));
    const opening = tag.slice(0, tag.indexOf(">") + 1);
    expect(opening).not.toMatch(/\bhidden\b/);
    expect(opening).not.toMatch(/\blg:hidden\b/);
  });

  it("resolves in the INSTALLED tds-shared, not just in this repo's source", () => {
    // A 0.x caret is minor-locked and `npm install --no-package-lock`
    // re-resolves every range on each build. A pin that cannot reach the
    // version carrying this export produces a build error at deploy time and
    // nothing at all before it.
    const dts = join(
      process.cwd(),
      "node_modules",
      "@tracht-digital-solutions",
      "tds-shared",
      "dist",
      "components",
      "index.d.ts",
    );
    expect(readFileSync(dts, "utf8")).toMatch(/declare const AccountMenu|AccountMenu\b/);
  });
});
