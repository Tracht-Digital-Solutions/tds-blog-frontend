/**
 * Shared marked instance for the blog. Pre-renders fenced code blocks
 * through Shiki via a `walkTokens` hook — each `code` token is
 * rewritten to a `html` token holding Shiki's full
 * `<pre class="shiki ..." style="..."><code>...</code></pre>` output.
 * That keeps Shiki's theme background + token colours intact and
 * sidesteps the double-`<code>`-tag wrap that `marked-highlight`
 * would impose.
 *
 * Shiki is async, so the call site uses `await renderMarkdown(body)`.
 * The highlighter is created lazily and cached for the lifetime of
 * the build process.
 */
import { Marked } from "marked";
import {
  createHighlighter,
  type BundledLanguage,
  type Highlighter,
} from "shiki";

/** Languages pre-loaded into the Shiki highlighter. Anything outside
 *  this list falls back to `text` (mono-spaced, no colours). Extend
 *  freely — Shiki tree-shakes per build, so unused entries don't
 *  bloat the runtime. */
const SUPPORTED_LANGS = [
  "ts",
  "tsx",
  "js",
  "jsx",
  "json",
  "css",
  "html",
  "astro",
  "vue",
  "php",
  "bash",
  "shell",
  "sql",
  "yaml",
  "toml",
  "ini",
  "md",
  "diff",
  "python",
] satisfies BundledLanguage[];

const THEME = "github-dark-dimmed";

let highlighterPromise: Promise<Highlighter> | null = null;
function getHighlighter(): Promise<Highlighter> {
  if (highlighterPromise === null) {
    highlighterPromise = createHighlighter({
      themes: [THEME],
      langs: [...SUPPORTED_LANGS],
    });
  }
  return highlighterPromise;
}

const supported = new Set<string>(SUPPORTED_LANGS);

const blogMarked = new Marked({ async: true });
blogMarked.use({
  async: true,
  walkTokens: async (token) => {
    if (token.type !== "code") return;
    const lang = supported.has(token.lang ?? "")
      ? (token.lang as string)
      : "text";
    const hl = await getHighlighter();
    const html = hl.codeToHtml(token.text, { lang, theme: THEME });
    // Rewrite the code token as a raw-html token; marked emits
    // `type: 'html'` tokens verbatim, no escaping or re-wrapping.
    (token as { type: string; text: string }).type = "html";
    (token as { type: string; text: string }).text = html;
  },
});

/** Render markdown to HTML with Shiki-highlighted code blocks. */
export async function renderMarkdown(body: string): Promise<string> {
  return blogMarked.parse(body, { async: true });
}
