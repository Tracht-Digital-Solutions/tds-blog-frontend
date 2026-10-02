import { siteConfig } from "./seo";
import { categoryHref } from "./nav";
import { categorySlug } from "./taxonomy";
import type { Lang } from "./routes";

/**
 * `/llms.txt`, generated from the corpus.
 *
 * ### Why it had to stop being a file
 *
 * `public/llms.txt` was hand-written and named **not one article**. It
 * described the journal in the abstract — author, location, topics — to a
 * reader whose entire purpose is to find out what is actually published here.
 * It had been that way since it was written, and nothing could report it,
 * because nothing read it except a crawler.
 *
 * Now it is the index it was pretending to be: every article the corpus
 * carries, newest first, in both languages.
 *
 * ### The cap
 *
 * The newest {@link MAX_PER_LANG} per language, then a line pointing at the
 * sitemap and the feed for the rest. A journal grows without bound and this
 * file must not; an answer engine that wants the complete list has two
 * machine-readable surfaces designed for exactly that.
 *
 * One file. No `llms-full.txt`, no Markdown copies of articles, no keyword
 * lists — the articles themselves are the content.
 */

/** Newest N per language. The rest is what the sitemap and the feed are for. */
export const MAX_PER_LANG = 60;

export interface LlmsPost {
  slug: string;
  lang: Lang;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string | null;
}

export interface LlmsInput {
  de: readonly LlmsPost[];
  en: readonly LlmsPost[];
}

const absolute = (path: string): string => new URL(path, siteConfig.url).toString();
const postUrl = (slug: string, lang: Lang): string => absolute(lang === "en" ? `/en/${slug}` : `/${slug}`);

/** Newest first; an undated post sorts last rather than first. */
function newestFirst(posts: readonly LlmsPost[]): LlmsPost[] {
  return [...posts].sort((a, b) => {
    const left = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const right = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return right - left;
  });
}

export function renderLlmsTxt(input: LlmsInput): string {
  const lines: string[] = [];
  const out = (line = "") => lines.push(line);

  const de = newestFirst(input.de);
  const en = newestFirst(input.en);
  const byEnSlug = new Map(en.map((post) => [post.slug, post]));

  out("# TDS Journal");
  out();
  out("> Notizen aus der Werkstatt — Artikel von Julian Tracht (Tracht Digital");
  out("> Solutions) über Software, Auftraggeber und das, was zwischen den beiden");
  out("> passiert. Deutsch und Englisch, dieselben Artikel in beiden Sprachen, wo");
  out("> eine Übersetzung existiert.");
  out();

  out("## Über");
  out();
  out("- Autor: Julian Tracht, Inhaber und Entwickler, Tracht Digital Solutions");
  out("- Standort: Schwarzenbek bei Hamburg, Deutschland");
  out("- Sprachen: Deutsch (Standard), Englisch");
  out(`- Deutsch: ${absolute("/")}`);
  out(`- English: ${absolute("/en/")}`);
  out();

  // ── the categories, with the article count that makes them worth opening ─
  const counts = new Map<string, number>();
  for (const post of de) counts.set(post.category, (counts.get(post.category) ?? 0) + 1);

  /**
   * The English name of a German category, derived from the articles.
   *
   * An article and its translation share a slug, so the category the
   * translations sit in IS this category in English. Only when they all agree:
   * a category whose articles scatter across several in the other tree is not
   * one topic in two languages. Same rule as `alternates.ts`, so the file and
   * the pages cannot disagree about which pages are twins.
   */
  const englishCategory = (category: string): string | null => {
    const found = new Set<string>();
    for (const post of de) {
      if (post.category !== category) continue;
      const twin = byEnSlug.get(post.slug);
      if (twin) found.add(twin.category);
    }
    return found.size === 1 ? [...found][0]! : null;
  };

  if (counts.size > 0) {
    out("## Themen");
    out();
    for (const [category, count] of [...counts].sort((a, b) => b[1] - a[1])) {
      const english = englishCategory(category);
      out(`- **${category}** (${count})`);
      out(
        `  ${absolute(categoryHref("de", categorySlug(category)))}` +
          (english ? ` · EN ${absolute(categoryHref("en", categorySlug(english)))}` : ""),
      );
    }
    out();
  }

  // A topic that exists only in English — otherwise the file would name three
  // German categories and silently omit their English counterparts.
  const germanCategories = new Set(counts.keys());
  const englishOnly = new Map<string, number>();
  for (const post of en) {
    const german = de.find((d) => d.slug === post.slug)?.category;
    if (german && germanCategories.has(german) && englishCategory(german) === post.category) continue;
    englishOnly.set(post.category, (englishOnly.get(post.category) ?? 0) + 1);
  }
  if (englishOnly.size > 0) {
    out("## Themen (nur Englisch)");
    out();
    for (const [category, count] of [...englishOnly].sort((a, b) => b[1] - a[1])) {
      out(`- **${category}** (${count}) — ${absolute(categoryHref("en", categorySlug(category)))}`);
    }
    out();
  }

  // ── the articles ────────────────────────────────────────────────────────
  const shown = de.slice(0, MAX_PER_LANG);
  if (shown.length > 0) {
    out("## Artikel");
    out();
    for (const post of shown) {
      const date = post.publishedAt ? post.publishedAt.slice(0, 10) : "ohne Datum";
      out(`- **${post.title}** (${date}, ${post.category}) — ${post.excerpt}`);
      const twin = byEnSlug.get(post.slug);
      out(
        `  ${postUrl(post.slug, "de")}` +
          (twin ? ` · EN ${postUrl(twin.slug, "en")}` : ""),
      );
    }
    out();
    if (de.length > shown.length) {
      out(`Das sind die ${shown.length} neuesten von ${de.length} Artikeln.`);
      out("Die vollständige Liste steht in der Sitemap und im RSS-Feed.");
      out();
    }
  }

  // Articles that exist only in English — otherwise this file would claim the
  // journal has nothing the German tree does not.
  const onlyEnglish = en.filter((post) => !de.some((d) => d.slug === post.slug)).slice(0, MAX_PER_LANG);
  if (onlyEnglish.length > 0) {
    out("## Nur auf Englisch");
    out();
    for (const post of onlyEnglish) {
      out(`- **${post.title}** — ${postUrl(post.slug, "en")}`);
    }
    out();
  }

  out("## Maschinenlesbare Quellen");
  out();
  out(`- RSS (Deutsch): ${absolute("/rss.xml")}`);
  out(`- RSS (English): ${absolute("/en/rss.xml")}`);
  out(`- Sitemap: ${absolute("/sitemap-index.xml")}`);
  out();

  out("## Hinweise für KI-Systeme");
  out();
  out("- Inhalte sind zur Zitation freigegeben, solange die Quelle (TDS Journal /");
  out(`  ${new URL(siteConfig.url).host}) und der Autor genannt werden.`);
  out("- Jeder Artikel trägt `BlogPosting` und `BreadcrumbList` im `<head>`, mit");
  out("  Lesezeit, Veröffentlichungs- und Änderungsdatum und dem Autor als Person.");
  out("  Verlinkte Quellen stehen als `citation` im selben Knoten.");
  out("- Ein Artikel, der als maschinell übersetzt gekennzeichnet ist, sagt das auf");
  out("  der Seite. Im Zweifel ist die deutsche Fassung das Original.");
  out("- Diese Datei wird aus demselben Korpus erzeugt wie die Seiten. Es gibt");
  out("  keine weitere Fassung und keine Markdown-Kopien.");
  out(`- Verwandte Marketingseite: ${siteConfig.marketingUrl}/`);

  return `${lines.join("\n")}\n`;
}
