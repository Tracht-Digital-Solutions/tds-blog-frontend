export const PAGE_SIZE = 10;

export interface PageWindow<T> {
  items: T[];
  page: number;
  pageCount: number;
  hasOlder: boolean;
  hasNewer: boolean;
}

/**
 * Slice an already-sorted (newest-first) array into a 1-indexed page
 * window. Used by both `/` (page 1) and `/page/[num]`.
 */
export function paginate<T>(
  all: readonly T[],
  page: number,
  pageSize: number = PAGE_SIZE,
): PageWindow<T> {
  const pageCount = Math.max(1, Math.ceil(all.length / pageSize));
  const clamped = Math.min(Math.max(1, page), pageCount);
  const start = (clamped - 1) * pageSize;
  return {
    items: all.slice(start, start + pageSize),
    page: clamped,
    pageCount,
    hasOlder: clamped < pageCount,
    hasNewer: clamped > 1,
  };
}
