import { createImageCatalog } from "@tracht-digital-solutions/tds-shared/site";
import raw from "./imageCatalog.json";

/**
 * The generated editorial image catalogue (tds-shared helper). The pictures are
 * served by the marketing site, not by this host, so the `srcset` has to be
 * absolute: a site-relative candidate resolves to blog.tracht-digital.de and 404s.
 */
export const { imageInfo, imageHints, imageObject } = createImageCatalog(raw, {
  origin: "https://tracht-digital.de",
  about: "page",
  absoluteSrcSet: true,
});
