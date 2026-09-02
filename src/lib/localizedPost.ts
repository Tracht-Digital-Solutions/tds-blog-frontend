/**
 * Resolve a post in a target language for the static build. If the post is
 * authored in that language, it's used as-is. If not, the other language's
 * version is fetched and machine-translated (DeepL) at build time so every
 * post is readable in both DE and EN. Falls back to the source-language
 * content when translation is unavailable — never returns a broken page.
 *
 * Handles both body formats: a markdown post yields `bodyHtml`; a block post
 * (`bodyFormat = "blocks"`) yields a parsed `blocks` array (rendered by
 * `BlockRenderer.astro`). The save-time DeepL sync usually already produced a
 * translated counterpart row, so the build-time translation branch below is a
 * rarely-firing safety net — for a block post it translates title/excerpt and
 * renders the source blocks (untranslated), which is why it stays a fallback.
 */

import type { BlogBlock, BlogPost } from "@tracht-digital-solutions/tds-shared";
import { getPost, type FullPost } from "./content-api";
import { renderMarkdown } from "./marked";
import { translateHtml, translateText } from "./translate";

export interface LocalizedPost {
  /** Post metadata in the target language (translated if not authored). */
  post: FullPost;
  /** Final article HTML for a markdown post ("" for a block post). */
  bodyHtml: string;
  /** Parsed blocks for a block post (null for a markdown post). */
  blocks: BlogBlock[] | null;
  /** True when title/body were machine-translated for this page. */
  translated: boolean;
  /** The authored language a translation came from, else null. */
  sourceLang: "de" | "en" | null;
}

/** Parse a block-document body into its blocks, or null if unparseable. */
function parseBlocks(body: string): BlogBlock[] | null {
  try {
    const doc = JSON.parse(body) as { blocks?: BlogBlock[] };
    return Array.isArray(doc.blocks) ? doc.blocks : null;
  } catch {
    return null;
  }
}

function isBlocks(post: BlogPost): boolean {
  return (post as { bodyFormat?: string }).bodyFormat === "blocks";
}

export async function resolveLocalizedPost(
  slug: string,
  lang: "de" | "en",
): Promise<LocalizedPost | null> {
  // Authored in the requested language → use verbatim. A stored row the
  // content-api's save-time DeepL sync created is still machine output, so it
  // carries the same "machine-translated" notice as a build-time translation.
  const native = await getPost(slug, lang);
  if (native) {
    const machine =
      (native as { machineTranslated?: boolean }).machineTranslated === true;
    const blocks = isBlocks(native);
    return {
      post: native,
      bodyHtml: blocks ? "" : await renderMarkdown(native.body),
      blocks: blocks ? parseBlocks(native.body) : null,
      translated: machine,
      sourceLang: machine ? (lang === "de" ? "en" : "de") : null,
    };
  }

  // Otherwise translate the other language's version (if any exists).
  const other = lang === "de" ? "en" : "de";
  const src = await getPost(slug, other);
  if (!src) return null;

  // Block posts: translate only the metadata here; render the source blocks
  // (the save-time sync normally supplies a translated counterpart before this).
  if (isBlocks(src)) {
    const [title, excerpt] = await Promise.all([
      translateText(src.title, lang, other),
      translateText(src.excerpt, lang, other),
    ]);
    return {
      // `metaDescription` is dropped, not carried: it is authored in `other`,
      // and spreading it would put a German description on an English page.
      // Null makes the description fall back to the translated excerpt.
      post: {
        ...src,
        lang,
        title: title ?? src.title,
        excerpt: excerpt ?? src.excerpt,
        metaDescription: null,
      },
      bodyHtml: "",
      blocks: parseBlocks(src.body),
      translated: title !== null,
      sourceLang: other,
    };
  }

  const srcHtml = await renderMarkdown(src.body);
  const [title, excerpt, bodyHtml] = await Promise.all([
    translateText(src.title, lang, other),
    translateText(src.excerpt, lang, other),
    translateHtml(srcHtml, lang, other),
  ]);

  const ok = title !== null && bodyHtml !== null;
  return {
    post: { ...src, lang, title: title ?? src.title, excerpt: excerpt ?? src.excerpt },
    bodyHtml: bodyHtml ?? srcHtml,
    blocks: null,
    translated: ok,
    sourceLang: other,
  };
}
