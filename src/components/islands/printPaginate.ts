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
 */

const PROSE = "prose-print";
let units: { node: Element; prose: boolean }[] | null = null;
let proseClass = PROSE;

function collectInitial(root: HTMLElement) {
  const out: { node: Element; prose: boolean }[] = [];
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

/** Lay `#print-root`'s content out into pages. Idempotent; call after any change of size, type or visibility. */
export function paginate(root: HTMLElement, pageLabel: (n: number, total: number) => string): number {
  if (!units) units = collectInitial(root);

  // Detach everything, then rebuild the pages from scratch.
  root.replaceChildren();
  root.classList.add("is-paged");

  const pages: HTMLElement[] = [];
  let inner: HTMLElement = root;
  let prose: HTMLElement | null = null;

  const newPage = () => {
    const page = document.createElement("section");
    page.className = "print-page";
    inner = document.createElement("div");
    inner.className = "print-page__inner";
    page.append(inner);
    root.append(page);
    pages.push(page);
    prose = null;
  };
  const overflows = () => inner.scrollHeight > inner.clientHeight + 1;

  newPage();
  for (const unit of units) {
    const place = () => {
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
    };
    place();
    // Hidden units (a switched-off meta line) take no room and never break.
    const current = prose as HTMLElement | null;
    if (overflows() && inner.childElementCount + (current?.childElementCount ?? 0) > 1) {
      unit.node.remove();
      const wrapper = prose as HTMLElement | null;
      if (wrapper && wrapper.childElementCount === 0) wrapper.remove();
      newPage();
      place();
    }
  }

  pages.forEach((page, i) => {
    const no = document.createElement("span");
    no.className = "print-page__no";
    no.setAttribute("aria-hidden", "true");
    no.textContent = pageLabel(i + 1, pages.length);
    page.append(no);
    page.setAttribute("aria-label", pageLabel(i + 1, pages.length));
  });
  return pages.length;
}
