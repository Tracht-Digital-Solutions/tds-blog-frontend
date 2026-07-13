import type { BlogBlock } from "@tracht-digital-solutions/tds-shared";
import { slugify } from "./renderBlock";

/**
 * Block-aware analogue of `sections.ts`: groups a block document into an intro
 * (blocks before the first level-2 heading) plus collapsible sections, each
 * started by an `h2` heading block. Keeps the TOC / collapsible / scroll-spy
 * behaviour identical to the markdown path.
 */

export interface BlockSection {
  id: string;
  heading: string;
  blocks: BlogBlock[];
}

export interface SplitBlocks {
  intro: BlogBlock[];
  sections: BlockSection[];
}

export function splitBlockSections(blocks: BlogBlock[]): SplitBlocks {
  const intro: BlogBlock[] = [];
  const sections: BlockSection[] = [];
  const seen = new Set<string>();
  let current: BlockSection | null = null;

  for (const block of blocks) {
    if (block.type === "heading" && block.level === 2) {
      let id = slugify(block.text);
      while (seen.has(id)) id = `${id}-${sections.length}`;
      seen.add(id);
      current = { id, heading: block.text, blocks: [] };
      sections.push(current);
      continue;
    }
    if (current) current.blocks.push(block);
    else intro.push(block);
  }

  return { intro, sections };
}
