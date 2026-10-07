/**
 * Splits the print view's article into real pages (2026-10-06).
 *
 * The preview used to be ONE sheet as wide as the paper and as long as the
 * text, so "A4" changed the width and nothing else — no page ended anywhere.
 * Now the content is laid out into `.print-page` boxes of the paper's exact
 * height (CSS, per `size-*`), block by block: a block that would overflow the
 * current page starts the next one. The same pages go to the printer with a
 * forced break between them, so what the preview shows is what prints.
 *
 * Flow units are the article's own nodes, MOVED (never cloned), so highlights
 * made with the marker survive a re-pagination. Units are the top-level
 * children of the sheet plus the children of `.prose-print`, which is
 * re-created per page so its typography still applies.
 *
 * Two rules keep the preview honest (2026-10-07):
 *  - It is measured at TRUE size. The sheet is scaled to the screen with CSS
 *    `zoom`, and text laid out at 42 % wraps (and so breaks pages) a little
 *    differently from the paper. `paginate` lifts the zoom while it measures.
 *  - A heading never ends a page. It moves to the next page with the block it
 *    introduces — the printer would do the same (`break-after: avoid`), and a
 *    preview that did not would break pages one block earlier than the paper.
 */

const PROSE = "prose-print";
type Unit = { node: Element; prose: boolean };
let units: Unit[] | null = null;
let proseClass = PROSE;

function collectInitial(root: HTMLElement) {
  const out: Unit[] = [];
  for (const child of Array.from(root.children)) {
    if (child.classList.contains(PROSE)) {
      proseClass = child.className;
      for (const inner of Array.from(child.children)) out.push({ node: inner, prose: true });
    } else {
      out.push({ node: child, prose: false });
    }
  }
  return out;
}

const isHeading = (el: Element) => /^H[1-6]$/.test(el.tagName);

/** Lay `#print-root`'s content out into pages. Idempotent; call after any change of size, type or visibility. */
export function paginate(root: HTMLElement, pageLabel: (n: number, total: number) => string): number {
  if (!units) units = collectInitial(root);

  // Measure at true size — see the note at the top.
  const zoom = root.style.getPropertyValue("--print-scale");
  root.style.setProperty("--print-scale", "1");

  // Detach everything, then rebuild the pages from scratch.
  root.replaceChildren();
  root.classList.add("is-paged");

  const pages: HTMLElement[] = [];
  let inner: HTMLElement = root;
  let prose: HTMLElement | null = null;
  let onPage: Unit[] = [];

  const newPage = () => {
    const page = document.createElement("section");
    page.className = "print-page";
    inner = document.createElement("div");
    inner.className = "print-page__inner";
    page.append(inner);
    root.append(page);
    pages.push(page);
    prose = null;
    onPage = [];
  };
  const overflows = () => inner.scrollHeight > inner.clientHeight + 1;
  const place = (unit: Unit) => {
    if (unit.prose) {
      if (!prose) {
        prose = document.createElement("div");
        prose.className = proseClass;
        inner.append(prose);
      }
      prose.append(unit.node);
    } else {
      prose = null;
      inner.append(unit.node);
    }
    onPage.push(unit);
  };
  const take = (unit: Unit) => {
    unit.node.remove();
    onPage.pop();
    const wrapper = prose as HTMLElement | null;
    if (wrapper && wrapper.childElementCount === 0) {
      wrapper.remove();
      prose = null;
    }
  };

  newPage();
  for (const unit of units) {
    place(unit);
    // A block alone on its page stays there even if it is taller than the page.
    if (!overflows() || onPage.length < 2) continue;
    take(unit);
    const carry: Unit[] = [];
    const prev = onPage[onPage.length - 1];
    if (prev && isHeading(prev.node) && onPage.length > 1) {
      take(prev);
      carry.push(prev);
    }
    newPage();
    for (const u of [...carry, unit]) place(u);
  }

  pages.forEach((page, i) => {
    const no = document.createElement("span");
    no.className = "print-page__no";
    no.setAttribute("aria-hidden", "true");
    no.textContent = pageLabel(i + 1, pages.length);
    page.append(no);
    page.setAttribute("aria-label", pageLabel(i + 1, pages.length));
  });

  if (zoom) root.style.setProperty("--print-scale", zoom);
  else root.style.removeProperty("--print-scale");
  return pages.length;
}

/* ---- Highlighter ------------------------------------------------------- */

/** Inline parents whose whitespace-only text belongs to the sentence (the space between two links). */
const INLINE_TEXT_PARENT = /^(P|LI|H[1-6]|BLOCKQUOTE|TD|TH|DD|DT|FIGCAPTION|A|STRONG|EM|B|I|U|S|SPAN|CODE|SMALL|SUB|SUP|MARK|ABBR|CITE|Q|TIME)$/;

/**
 * Wraps every piece of text the range covers in its own `<mark class="print-mark">`.
 *
 * Text node by text node, never `range.extractContents()`: a selection across
 * two paragraphs used to be pulled out whole and re-inserted INSIDE one inline
 * `<mark>`, which moved block elements into an inline one, merged the
 * paragraphs and threw off the pagination. The pieces of one selection share
 * a `data-mark` id, so one tap removes the whole highlight. Returns how many
 * pieces it made.
 */
let nextMark = 0;
export function highlightRange(range: Range, root: HTMLElement): number {
  const scope = range.commonAncestorContainer;
  const base = scope.nodeType === Node.TEXT_NODE ? scope.parentNode : scope;
  if (!base) return 0;
  const walker = document.createTreeWalker(base, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (!range.intersectsNode(n) || !root.contains(n)) return NodeFilter.FILTER_REJECT;
      const parent = n.parentElement;
      if (!parent || parent.closest("mark.print-mark, .print-page__no")) return NodeFilter.FILTER_REJECT;
      if (!/\S/.test(n.textContent ?? "") && !INLINE_TEXT_PARENT.test(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);

  // The boundaries are read ONCE: the range is live, and wrapping a node in a
  // mark moves it, which moves the range's boundaries with it.
  const { startContainer, startOffset, endContainer, endOffset } = range;
  let made = 0;
  const id = `m${++nextMark}`;
  for (let node of nodes) {
    const start = node === startContainer ? startOffset : 0;
    const end = node === endContainer ? endOffset : node.length;
    if (start >= end) continue;
    if (end < node.length) node.splitText(end);
    if (start > 0) node = node.splitText(start);
    const mark = document.createElement("mark");
    mark.className = "print-mark";
    mark.dataset.mark = id;
    node.parentNode!.insertBefore(mark, node);
    mark.appendChild(node);
    made++;
  }
  return made;
}

/** How many highlights (not pieces) there are under `root`. */
export function countHighlights(root: Element): number {
  return new Set(Array.from(root.querySelectorAll<HTMLElement>("mark.print-mark"), (m) => m.dataset.mark)).size;
}

/** Unwraps one highlight (every piece of it), or every highlight under `target`. */
export function removeHighlights(target: Element, root: Element = document.body): void {
  const id = (target as HTMLElement).dataset?.mark;
  const marks = target.matches("mark.print-mark")
    ? id
      ? Array.from(root.querySelectorAll(`mark.print-mark[data-mark="${id}"]`))
      : [target]
    : Array.from(target.querySelectorAll("mark.print-mark"));
  for (const m of marks) {
    const parent = m.parentNode;
    if (!parent) continue;
    while (m.firstChild) parent.insertBefore(m.firstChild, m);
    parent.removeChild(m);
    parent.normalize();
  }
}
