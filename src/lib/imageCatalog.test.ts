import { describe, expect, it } from "vitest";
import { imageHints } from "./imageCatalog";

describe("editorial image hints", () => {
  it("points every srcset candidate at the marketing host that serves the images", () => {
    // A site-relative candidate resolved to blog.tracht-digital.de and 404ed (2026-11-11).
    const srcSet = imageHints("https://tracht-digital.de/images/editorial/backup-2026.webp", "de")?.srcSet ?? "";
    const candidates = srcSet.split(", ");
    expect(candidates.length).toBeGreaterThan(1);
    for (const c of candidates) expect(c).toMatch(/^https:\/\/tracht-digital\.de\/images\/editorial\/\S+ \d+w$/);
  });
});
