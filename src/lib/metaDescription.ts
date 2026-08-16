/**
 * Meta descriptions for the blog's GENERATED pages (category, tag, archive
 * page, author).
 *
 * Why these are built here rather than inline in each page:
 *
 *  1. **They are templated, so their length is not knowable from the source.**
 *     A category called "SEO" and one called "Prozessautomatisierung im
 *     Mittelstand" produce descriptions 40 characters apart. Every one of
 *     these was previously an inline template literal, and the long-name case
 *     ran past what Google renders — silently, because nothing measures a
 *     string that only exists at build time for one particular taxonomy row.
 *
 *  2. **They were far too thin.** The listing pages shipped descriptions of
 *     39–58 characters ("Artikel im Journal mit dem Tag „x“."), which is
 *     below the length at which a description carries any information — search
 *     engines routinely discard one that thin and synthesise their own from
 *     the page body, so the copy was doing no work at all.
 *
 * The shape of the fix is a TWO-TIER sentence, not a truncation: the rich form
 * is used whenever it fits, and a shorter complete sentence takes over when the
 * taxonomy name is long. Cutting the rich form at 160 instead would leave a
 * dangling clause in the SERP, and cutting the NAME would misreport what the
 * page lists. `clampToWord` is only the final backstop for an absurd name.
 */

/** What Google actually renders of a meta description. */
export const RENDERED_META_LENGTH = 160;

/**
 * Last-resort clamp. Cuts on a word boundary so the result never ends
 * mid-word; only reached when even the short form overflows, i.e. when a
 * taxonomy name is itself pathologically long.
 */
export function clampToWord(text: string, max = RENDERED_META_LENGTH): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const body = lastSpace > max * 0.5 ? cut.slice(0, lastSpace) : cut;
  return `${body.trimEnd().replace(/[\s.,;:—–-]+$/, "")}…`;
}

/** Pick the rich sentence when it fits, else the short one. */
function fit(rich: string, short: string): string {
  return rich.length <= RENDERED_META_LENGTH ? rich : clampToWord(short);
}

export type Lang = "de" | "en";

export function categoryDescription(name: string, lang: Lang): string {
  return lang === "de"
    ? fit(
        `Beiträge im TDS Journal zur Kategorie „${name}“: praxisnahe Artikel über Webentwicklung, Automatisierung und Software für Unternehmen.`,
        `Alle Beiträge im TDS Journal zur Kategorie „${name}“.`,
      )
    : fit(
        `Posts in the TDS Journal filed under “${name}” — hands-on articles on web development, automation and software for businesses.`,
        `All posts in the TDS Journal filed under “${name}”.`,
      );
}

export function tagDescription(tag: string, lang: Lang): string {
  return lang === "de"
    ? fit(
        `Alle Beiträge im TDS Journal mit dem Tag „${tag}“ — praxisnahe Artikel über Digitalisierung und Software-Entwicklung für Unternehmen.`,
        `Alle Beiträge im TDS Journal mit dem Tag „${tag}“.`,
      )
    : fit(
        `All posts in the TDS Journal tagged “${tag}” — hands-on articles on digitalization and software development for businesses.`,
        `All posts in the TDS Journal tagged “${tag}”.`,
      );
}

export function archiveDescription(page: number, lang: Lang): string {
  return lang === "de"
    ? `Seite ${page} des TDS-Journal-Archivs: ältere Beiträge über Digitalisierung für Unternehmen, Webentwicklung und Automatisierung im Arbeitsalltag.`
    : `Page ${page} of the TDS Journal archive: older posts on digitalization for businesses, web development and everyday automation.`;
}

/**
 * Fallback for an author with no bio. A real bio is CMS-authored and used
 * verbatim — it is the better description whenever it exists.
 */
export function authorDescription(name: string, lang: Lang): string {
  return lang === "de"
    ? fit(
        `Beiträge von ${name} im TDS Journal — Artikel über Digitalisierung für Unternehmen, Webentwicklung und Automatisierung.`,
        `Beiträge von ${name} im Journal von Tracht Digital Solutions.`,
      )
    : fit(
        `Posts by ${name} in the TDS Journal — articles on digitalization for businesses, web development and automation.`,
        `Posts by ${name} in the Tracht Digital Solutions journal.`,
      );
}
