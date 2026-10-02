import {
  emptyPlacement,
  type ShopPlacement,
  type ShopProductRef,
} from "@tracht-digital-solutions/tds-shared/schemas";

import { contentApiBase } from "./connection";
import { memoisedOr, readContentJson } from "./contentFetch";

/**
 * TDShop reads — the journal's half of product placement.
 *
 * Same fail-soft contract as `content-api.ts`: an unreachable shop must never
 * take an article down. The difference is what "fallback" means here. An
 * article's own content has a demo fallback because a page with no article is
 * not a page; an advertising slot with nothing in it is simply an article
 * without advertising, which is a perfectly good article. So these return
 * **nothing** rather than substituting anything, and the callers render no
 * section at all.
 *
 * ### The site-key scope, and the failure it causes
 *
 * These routes live under `/content/shop`, which is a DIFFERENT prefix from the
 * journal's own `/content/blog`. `SiteConnectionIdentity::allows()` lets a key
 * with no scopes through, but a key that carries scopes only passes the
 * prefixes it lists. So a blog site key scoped to `/content/blog` + a rejected
 * `/content/shop` read fails — and because everything here is fail-soft, the
 * symptom is a product block that silently renders nothing.
 *
 * If embedded products are blank in production, check the blog connection's
 * scopes before anything else.
 */

/**
 * Memoised per cache generation (one article often embeds the same product
 * twice), and only on success.
 *
 * A rejected site key is swallowed like every other failure, as it is in
 * `content-api.ts`: `assertKeyAccepted` has already counted it, and the
 * middleware refuses to store the page. It used to be rethrown here, which
 * took the whole ARTICLE down for a product box — the opposite of the contract
 * above.
 */
function read<T>(path: string, fallback: T, label: string): Promise<T> {
  return memoisedOr(
    `shop:${path}`,
    () => readContentJson<T>(`${contentApiBase()}${path}`),
    fallback,
    `shop ${label} (rendering nothing)`,
  );
}

/** One product for an inline block. Null when it does not exist or is unreachable. */
export function getShopProduct(
  slug: string,
  lang: "de" | "en",
): Promise<ShopProductRef | null> {
  return read<ShopProductRef | null>(`/shop/${encodeURIComponent(slug)}?lang=${lang}`, null, `product ${slug}`);
}

/**
 * A resolved advertising slot.
 *
 * `category` passes the article's own category so an automatic slot can match
 * the piece it sits in — the API treats the caller's context as the more
 * specific signal and prefers it over the placement's stored selector.
 */
export function getShopPlacement(
  key: string,
  lang: "de" | "en",
  category?: string,
): Promise<ShopPlacement> {
  const params = new URLSearchParams({ lang });
  if (category) params.set("category", category);
  return read<ShopPlacement>(
    `/shop/placement/${encodeURIComponent(key)}?${params}`,
    emptyPlacement(key, lang),
    `placement ${key}`,
  );
}

/**
 * Point an offer's link at the shop's click redirect with this surface's
 * attribution.
 *
 * `offer.url` already IS the redirect — the API builds it — so this only adds
 * the query. Never rebuild the URL here: the partner tag belongs in one
 * database row, not in the journal.
 */
export function attributeOffers<T extends { offers: ShopProductRef["offers"] }>(
  product: T,
  lang: "de" | "en",
  placement?: string,
): T {
  return {
    ...product,
    offers: product.offers.map((offer) => {
      const params = new URLSearchParams({ source: "blog", lang });
      if (placement) params.set("placement", placement);
      return { ...offer, url: `${offer.url}?${params}` };
    }),
  };
}
