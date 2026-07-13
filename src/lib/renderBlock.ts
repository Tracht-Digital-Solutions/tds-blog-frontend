import { marked } from "marked";
import type { BlogBlock } from "@tracht-digital-solutions/tds-shared";
import { renderMarkdown } from "./marked";

/**
 * Build-time renderer for a single non-embed block → HTML. Text fields carry
 * inline markdown (reused via `marked.parseInline`); code blocks go through the
 * shared Shiki `renderMarkdown` so they match the markdown path's highlighting.
 *
 * Embed blocks that need a live component (`adsense`) or snippet resolution
 * (`custom`) are handled by `BlockRenderer.astro`, not here — this returns "".
 */

function inline(md: string): string {
  return marked.parseInline(md ?? "", { async: false }) as string;
}

function esc(s: string): string {
  return (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{6,})/);
  return m ? m[1] : null;
}
function vimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? m[1] : null;
}

export async function renderBlockHtml(block: BlogBlock): Promise<string> {
  switch (block.type) {
    case "heading":
      return `<h${block.level} id="${slugify(block.text)}">${inline(block.text)}</h${block.level}>`;
    case "paragraph":
      return block.text.trim() === "" ? "" : `<p>${inline(block.text)}</p>`;
    case "list": {
      const items = block.items
        .filter((i) => i.trim() !== "")
        .map((i) => `<li>${inline(i)}</li>`)
        .join("");
      if (items === "") return "";
      const tag = block.ordered ? "ol" : "ul";
      return `<${tag}>${items}</${tag}>`;
    }
    case "quote":
      return `<blockquote><p>${inline(block.text)}</p>${
        block.cite ? `<cite>${esc(block.cite)}</cite>` : ""
      }</blockquote>`;
    case "code":
      // Reuse the shared marked+Shiki pipeline so highlighting matches.
      return renderMarkdown("```" + (block.lang || "text") + "\n" + block.code + "\n```");
    case "image":
      return block.url
        ? `<figure><img src="${esc(block.url)}" alt="${esc(block.alt)}" loading="lazy" />${
            block.caption ? `<figcaption>${esc(block.caption)}</figcaption>` : ""
          }</figure>`
        : "";
    case "divider":
      return `<hr />`;
    case "callout":
      return `<div class="callout callout--${block.variant}">${inline(block.text)}</div>`;
    case "button":
      return block.href
        ? `<p class="block-button"><a class="btn btn-${block.style}" href="${esc(block.href)}">${esc(block.label || "")}</a></p>`
        : "";
    case "video": {
      const id = block.provider === "youtube" ? youtubeId(block.url) : vimeoId(block.url);
      if (!id) return "";
      const src =
        block.provider === "youtube"
          ? `https://www.youtube-nocookie.com/embed/${id}`
          : `https://player.vimeo.com/video/${id}`;
      return `<div class="video-embed"><iframe src="${src}" loading="lazy" allowfullscreen title="Video"></iframe></div>`;
    }
    default:
      return ""; // adsense / custom handled in BlockRenderer.astro
  }
}

interface SnippetLike {
  id: number;
  kind: "preset" | "embed";
  definition: Record<string, unknown>;
}

/**
 * Render a whole block document to a single HTML string (embeds inlined as
 * static markup, ads skipped). Used by the print view, which has no room for
 * live ad components.
 */
export async function renderBlocksToHtml(
  blocks: BlogBlock[],
  snippets: SnippetLike[] = [],
): Promise<string> {
  const out: string[] = [];
  for (const block of blocks) {
    if (block.type === "adsense") continue;
    if (block.type === "custom") {
      const s = snippets.find((x) => x.id === block.snippetId);
      if (!s) continue;
      if (s.kind === "embed" && typeof s.definition.html === "string") out.push(s.definition.html);
      else if (s.kind === "preset" && typeof s.definition.type === "string") {
        out.push(await renderBlockHtml(s.definition as unknown as BlogBlock));
      }
      continue;
    }
    out.push(await renderBlockHtml(block));
  }
  return out.join("\n");
}

/** Anchor id from heading text (matches sections.ts semantics). */
export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/<[^>]+>/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 64) || "abschnitt"
  );
}
