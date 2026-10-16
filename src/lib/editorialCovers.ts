import covers from './editorialCovers.json';

/** Shared with the landing page; uploaded CMS artwork has priority. */
export function editorialCover(slug: string): string | null {
  const path = (covers as Record<string, string>)[slug];
  return path ? `https://tracht-digital.de/images/${path}` : null;
}

export function postCover(slug: string, uploaded?: string | null): string | null {
  return uploaded || editorialCover(slug);
}
