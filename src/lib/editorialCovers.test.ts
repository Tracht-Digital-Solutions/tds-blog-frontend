import {describe, expect, it} from 'vitest';
import covers from './editorialCovers.json';
import {editorialCover, postCover} from './editorialCovers';

describe('editorial covers', () => {
  const slug = 'datensicherung-3-2-1-regel-kleine-betriebe';
  it('assigns known posts without overriding uploaded images', () => {
    expect(Object.keys(covers)).toHaveLength(15);
    expect(postCover(slug, null)).toBe('https://tracht-digital.de/images/editorial/backup-2026.webp');
    expect(postCover(slug, 'https://example.com/upload.webp')).toBe('https://example.com/upload.webp');
  });
  it('keeps unknown posts on the abstract fallback', () => {
    expect(editorialCover('future-article')).toBeNull();
  });
});
