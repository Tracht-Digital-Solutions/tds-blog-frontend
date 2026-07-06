/**
 * Resolve a post in a target language for the static build. If the post is
 * authored in that language, it's used as-is. If not, the other language's
 * version is fetched and machine-translated (DeepL) at build time so every
 * post is readable in both DE and EN. Falls back to the source-language
 * content when translation is unavailable — never returns a broken page.
 */

import type { BlogPost } from "@tracht-digital-solutions/tds-shared";
import { getPost } from "./content-api";
import { renderMarkdown } from "./marked";
import { translateHtml, translateText } from "./translate";

export interface LocalizedPost {
  /** Post metadata in the target language (translated if not authored). */
  post: BlogPost;
  /** Final article HTML to render (translated when not authored). */
  bodyHtml: string;
  /** True when title/body were machine-translated for this page. */
  translated: boolean;
  /** The authored language a translation came from, else null. */
  sourceLang: "de" | "en" | null;
}

export async function resolveLocalizedPost(
  slug: string,
  lang: "de" | "en",
): Promise<LocalizedPost | null> {
  // Authored in the requested language → use verbatim. A stored row the
  // content-api's save-time DeepL sync created is still machine output,
  // so it carries the same "machine-translated" notice as a build-time
  // translation. (machineTranslated ships with tds-shared ≥ 0.8.7 — the
  // cast keeps older installed type versions green.)
  const native = await getPost(slug, lang);
  if (native) {
    const machine =
      (native as { machineTranslated?: boolean }).machineTranslated === true;
    return {
      post: native,
      bodyHtml: await renderMarkdown(native.body),
      translated: machine,
      sourceLang: machine ? (lang === "de" ? "en" : "de") : null,
    };
  }

  // Otherwise translate the other language's version (if any exists).
  const other = lang === "de" ? "en" : "de";
  const src = await getPost(slug, other);
  if (!src) return null;

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
    translated: ok,
    sourceLang: other,
  };
}
