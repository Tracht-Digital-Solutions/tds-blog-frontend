/**
 * Shop products inside a MARKDOWN article.
 *
 * Block articles place a product with a `product` block. The blog-CMS editor
 * writes markdown, so a markdown article names a product with a line of its
 * own:
 *
 *     {{produkt:fritzbox-7690}}
 *     {{produkt:fritzbox-7690 inline}}
 *
 * (`{{product:…}}` works too; the variant is `card` — the default —, `inline`
 * or `list`, exactly as in the block.) The slug is the product's slug in the
 * ARTICLE's language: DE and EN shop slugs may differ, and each language row
 * of an article is written separately.
 *
 * Markdown renders the line as a paragraph of its own. `splitProductShortcodes`
 * cuts the rendered section HTML at those paragraphs, so `Article.astro` can
 * render `ProductEmbed` between the prose parts — outside `.tds-prose`, like a
 * block embed, so the card never inherits article typography. A slug the shop
 * does not serve (unknown, or not yet released) renders nothing, and the
 * article reads on.
 */

export type ProductVariant = "card" | "inline" | "list";

export type ArticlePart =
  | { kind: "html"; html: string }
  | { kind: "product"; slug: string; variant: ProductVariant };

/** One shortcode paragraph as markdown renders it, with any attributes on `<p>`. */
const SHORTCODE = /<p\b[^>]*>\s*\{\{\s*(?:produkt|product):([a-z0-9-]{2,120})(?:\s+(card|inline|list))?\s*\}\}\s*<\/p>/g;

/** Split rendered HTML into prose parts and product embeds, in order. */
export function splitProductShortcodes(html: string): ArticlePart[] {
  const parts: ArticlePart[] = [];
  let last = 0;
  for (const match of html.matchAll(SHORTCODE)) {
    const before = html.slice(last, match.index);
    if (before.trim() !== "") parts.push({ kind: "html", html: before });
    parts.push({ kind: "product", slug: match[1]!, variant: (match[2] as ProductVariant | undefined) ?? "card" });
    last = match.index! + match[0].length;
  }
  const rest = html.slice(last);
  if (rest.trim() !== "") parts.push({ kind: "html", html: rest });
  return parts;
}

/**
 * The same HTML without the shortcode paragraphs — for word counts, plain-text
 * extracts and the print view, where `{{produkt:…}}` would read as gibberish.
 */
export function stripProductShortcodes(html: string): string {
  return html.replace(SHORTCODE, "");
}
