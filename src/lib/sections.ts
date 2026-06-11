/**
 * Split rendered article HTML at <h2> boundaries so the page can wrap
 * each section in a collapsible block with a TOC entry. Runs at build
 * time on the output of renderMarkdown().
 */

export interface ArticleSection {
  /** Anchor id, derived from the heading text (unique per article). */
  id: string;
  /** Heading text with inline tags stripped. */
  heading: string;
  /** Section body HTML (everything up to the next h2). */
  html: string;
}

export interface SplitArticle {
  /** HTML before the first h2 — rendered open, carries the drop-cap. */
  intro: string;
  sections: ArticleSection[];
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || "abschnitt"
  );
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

export function splitSections(html: string): SplitArticle {
  const h2 = /<h2[^>]*>([\s\S]*?)<\/h2>/g;
  const matches = [...html.matchAll(h2)];
  if (matches.length === 0) return { intro: html, sections: [] };

  const intro = html.slice(0, matches[0].index);
  const sections: ArticleSection[] = [];
  const seen = new Set<string>();

  matches.forEach((m, i) => {
    const heading = stripTags(m[1]);
    let id = slugify(heading);
    while (seen.has(id)) id = `${id}-${i}`;
    seen.add(id);

    const bodyStart = (m.index ?? 0) + m[0].length;
    const bodyEnd = i + 1 < matches.length ? matches[i + 1].index : html.length;
    sections.push({ id, heading, html: html.slice(bodyStart, bodyEnd) });
  });

  return { intro, sections };
}
