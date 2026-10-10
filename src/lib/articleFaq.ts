/**
 * The questions a markdown article answers in its FAQ section, for `FAQPage`.
 *
 * Built from the RENDERED sections, never from a separate field: Google
 * withdraws a FAQ rich result when the structured answer differs from the
 * visible one, and an answer engine quotes what the page shows. So the markup
 * is exactly the article's own `## Häufige Fragen` section — each `###` is a
 * question, the text below it up to the next `###` its answer.
 *
 * An article without such a section yields nothing, and gets no node.
 */

export interface FaqEntry {
  q: string;
  a: string;
}

const FAQ_HEADING = /^(häufige fragen|fragen und antworten|faq|frequently asked questions|common questions)$/i;

const text = (html: string): string =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

/** Questions and answers from the article's FAQ section, if it has one. */
export function faqFromSections(sections: readonly { heading: string; html: string }[]): FaqEntry[] {
  const section = sections.find((s) => FAQ_HEADING.test(s.heading.trim()));
  if (!section) return [];

  const out: FaqEntry[] = [];
  const pieces = section.html.split(/<h3\b[^>]*>/i).slice(1);
  for (const piece of pieces) {
    const end = piece.search(/<\/h3>/i);
    if (end < 0) continue;
    const q = text(piece.slice(0, end));
    const a = text(piece.slice(end + 5));
    if (q !== "" && a !== "") out.push({ q, a });
  }
  return out;
}
