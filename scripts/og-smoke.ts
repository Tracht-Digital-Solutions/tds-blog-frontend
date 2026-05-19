/**
 * Smoke test for the OG image renderer.
 *
 * Calls renderOgPng with representative data and writes the result
 * to ./scripts/og-smoke.png so a human can eyeball it. Exits non-zero
 * on render failure (CI-friendly).
 *
 * Run: `npx tsx scripts/og-smoke.ts`
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderOgPng } from "../src/og/render.ts";

const fixtures = [
  {
    title: "Warum individuelle Software oft günstiger ist als gedacht.",
    category: "Entwicklung",
    publishedAt: "2026-04-12T00:00:00Z",
    lang: "de" as const,
  },
  {
    title: "Three processes almost every mid-market business could automate today.",
    category: "Digitalization",
    publishedAt: "2026-03-01T00:00:00Z",
    lang: "en" as const,
  },
];

const outDir = fileURLToPath(new URL(".", import.meta.url));

for (const [i, fx] of fixtures.entries()) {
  const png = await renderOgPng(fx);
  const file = path.join(outDir, `og-smoke-${i + 1}-${fx.lang}.png`);
  fs.writeFileSync(file, png);
  // eslint-disable-next-line no-console
  console.log(`✓ rendered ${file} (${(png.length / 1024).toFixed(1)} KB)`);
}
