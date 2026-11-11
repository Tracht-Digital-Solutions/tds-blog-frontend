import { createImageCatalog } from "@tracht-digital-solutions/tds-shared/site";
import raw from "./imageCatalog.json";

const IMAGE_ORIGIN = "https://tracht-digital.de";

/** The generated editorial image catalogue (tds-shared helper). */
const catalog = createImageCatalog(raw, {
  origin: IMAGE_ORIGIN,
  about: "page",
});

export const { imageInfo, imageObject } = catalog;

/**
 * The shared helper emits a site-relative `srcset`, which is right only when the
 * images live on the same host. The blog's pictures are served by the marketing
 * site, so a relative `srcset` resolved to blog.tracht-digital.de and every
 * variant 404ed (images missing on the journal). Make each candidate absolute.
 */
export const imageHints: typeof catalog.imageHints = (src, lang, sizes) => {
  const hints = catalog.imageHints(src, lang, sizes);
  if (!hints) return hints;
  return {
    ...hints,
    srcSet: hints.srcSet
      .split(", ")
      .map((candidate) => (candidate.startsWith("/") ? IMAGE_ORIGIN + candidate : candidate))
      .join(", "),
  };
};
