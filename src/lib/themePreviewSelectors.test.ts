import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return files(path);
    return /\.(astro|css)$/.test(name) ? [path] : [];
  });
}

/*
 * The theme toggle's hover preview is a copy of the page under
 * `.tds-theme-preview__page[data-theme=…]`. A rule written as
 * `:root[data-theme="dark"] X` never reaches a dark copy and keeps applying
 * inside a light one, so text in the circle stayed in the page's theme.
 * Pattern: tds-shared docs/agents/theme-motion-app.md (same guard as the landing page).
 */
describe("dark-theme rules", () => {
  it("follow the nearest data-theme, so the hover preview shows them", () => {
    const offenders = files("src").flatMap((file) =>
      readFileSync(file, "utf8")
        .split("\n")
        .filter((line) => !/^\s*(\/\*|\*|\/\/)/.test(line))
        .filter((line) => /:root\[data-theme="dark"\]\)?\s+[.:#\w[]/.test(line))
        .map((line) => `${file}: ${line.trim()}`),
    );
    expect(offenders).toEqual([]);
  });
});
