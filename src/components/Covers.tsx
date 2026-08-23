/**
 * The flat brand-geometry covers moved into `tds-shared` (0.29.0) when the
 * landingpage's Journal row needed the SAME artwork: the variant is a hash of
 * the slug, so a second copy of this file would silently draw a different
 * picture for the same article on the two properties.
 *
 * This module stays as the blog's import path — nothing else changed, and the
 * component/prop names are identical.
 */
export {
  AbstractCover,
  PostCover,
  coverVariant,
  hasPhotoCover,
  type AbstractCoverProps,
  type PostCoverProps,
} from "@tracht-digital-solutions/tds-shared/components";
