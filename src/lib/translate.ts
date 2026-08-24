/**
 * Build-time DeepL translation for blog posts that lack a language version.
 * Called only during `astro build` (keeps the site static — no runtime
 * translation). Results are memoised per build so the dual DE/EN routes
 * don't translate the same content twice.
 *
 * Graceful by design: with no `DEEPL_API_KEY`, or on any API error, the
 * helpers return `null` and the caller falls back to the source-language
 * content — the build never breaks on a translation hiccup.
 */

const KEY = import.meta.env.DEEPL_API_KEY as string | undefined;

/** Free-tier keys end with `:fx` and use the api-free host. */
const ENDPOINT =
  KEY && KEY.endsWith(":fx")
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";

/** True when a key is configured — lets callers flag machine output. */
export const translationConfigured = Boolean(KEY);

type Lang = "de" | "en";

/**
 * Translation memo — deliberately NOT generation-scoped, unlike every other
 * memo on this site.
 *
 * The key contains the full source text, so an entry is content-addressed: the
 * same input always has the same translation, and a "stale" entry is a
 * contradiction in terms. Clearing it on a cache rebuild would only re-buy
 * translations we already paid DeepL for.
 *
 * What it does need is a ceiling, which a build never did: the server runs for
 * weeks, and an unbounded map of every article body it has ever translated is
 * a slow leak. Oldest-first eviction is right here because the entries that
 * matter are the ones being re-rendered now.
 */
const CACHE_LIMIT = 500;
const cache = new Map<string, string | null>();

function remember(key: string, value: string | null): void {
  if (cache.size >= CACHE_LIMIT) {
    const oldest = cache.keys().next();
    if (!oldest.done) cache.delete(oldest.value);
  }
  cache.set(key, value);
}

/** Map our locale to DeepL's target codes (regional EN required by v2). */
const target = (l: Lang) => (l === "de" ? "DE" : "EN-GB");
const source = (l: Lang) => (l === "de" ? "DE" : "EN");

async function call(
  text: string,
  to: Lang,
  from: Lang,
  html: boolean,
): Promise<string | null> {
  if (!KEY || !text.trim()) return null;
  const cacheKey = `${to}|${from}|${html ? "h" : "t"}|${text}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey) ?? null;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: [text],
        target_lang: target(to),
        source_lang: source(from),
        ...(html
          ? { tag_handling: "html", ignore_tags: ["pre", "code"] }
          : {}),
      }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) {
      console.warn(`[tds-blog] DeepL ${res.status} — falling back to source text`);
      remember(cacheKey, null);
      return null;
    }
    const data = (await res.json()) as { translations?: Array<{ text: string }> };
    const out = data.translations?.[0]?.text ?? null;
    remember(cacheKey, out);
    return out;
  } catch (err) {
    console.warn("[tds-blog] DeepL request failed — falling back to source:", err);
    remember(cacheKey, null);
    return null;
  }
}

/** Translate a plain-text field (title, excerpt). */
export function translateText(text: string, to: Lang, from: Lang): Promise<string | null> {
  return call(text, to, from, false);
}

/** Translate rendered HTML (code/pre kept verbatim). */
export function translateHtml(html: string, to: Lang, from: Lang): Promise<string | null> {
  return call(html, to, from, true);
}
