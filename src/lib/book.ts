/**
 * Every post is drawn as a book whose page block grows with its length.
 *
 * Five thicknesses rather than a continuous value: the page block is a stack
 * of hard 1px lines (CSS `.book--1` … `.book--5` in global.css), and a
 * continuous thickness would need a generated shadow per card — an inline
 * style the hover state and the container queries could no longer override.
 *
 * The length comes from the list API (`readingMinutes`, tds-ext-blog-cms
 * 0.3.0). An older API that does not send it gets the middle-thin book and no
 * label — never a made-up page count.
 */

export type BookLevel = 1 | 2 | 3 | 4 | 5;

/** Minutes → thickness: Heft · dünn · mittel · dick · Wälzer. */
export function bookLevel(minutes: number | null | undefined): BookLevel {
  if (minutes == null || !Number.isFinite(minutes)) return 2;
  if (minutes <= 2) return 1;
  if (minutes <= 4) return 2;
  if (minutes <= 7) return 3;
  if (minutes <= 12) return 4;
  return 5;
}

/** The class pair for a book-shaped element. */
export function bookClass(minutes: number | null | undefined): string {
  return `book book--${bookLevel(minutes)}`;
}

/**
 * Printed pages the text would fill: ~250 words a page at the 220 words a
 * minute the reading time assumes. At least one.
 */
export function bookPages(minutes: number): number {
  return Math.max(1, Math.round((minutes * 220) / 250));
}

/** "~7 Min. · 6 Seiten" / "~7 min · 6 pages", or null without a length. */
export function bookLabel(minutes: number | null | undefined, lang: "de" | "en"): string | null {
  if (minutes == null || !Number.isFinite(minutes) || minutes <= 0) return null;
  const pages = bookPages(minutes);
  return lang === "de"
    ? `~${minutes} Min. · ${pages} ${pages === 1 ? "Seite" : "Seiten"}`
    : `~${minutes} min · ${pages} ${pages === 1 ? "page" : "pages"}`;
}
