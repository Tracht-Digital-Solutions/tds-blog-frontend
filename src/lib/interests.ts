import { consentGranted, onConsentChange } from "@tracht-digital-solutions/tds-shared/consent/store";

/**
 * The reader's topic weights behind "Für dich" and the hero's personal tab.
 *
 * A profile of what someone reads is not something the journal needs to work,
 * so it is stored only with the "Komfort" (`functional`) consent (§ 25 Abs. 1
 * TDDDG). Without it — and the moment it is withdrawn — the cookie is deleted
 * and the recommendations fall back to the generic order, which is what
 * `ForYou` and `HeroSlider` already do when the cookie is missing.
 */
export const INTERESTS_COOKIE = "tds-interests";
const MAX_AGE_S = 180 * 24 * 3600;
const MAX_TOPICS = 12;
const MAX_WEIGHT = 50;

export function readInterests(cookie: string): Record<string, number> {
  const match = cookie.match(/(?:^|; )tds-interests=([^;]*)/);
  if (!match) return {};
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1] ?? "")) as unknown;
    if (typeof parsed !== "object" || parsed === null) return {};
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(parsed)) if (typeof v === "number") out[k] = v;
    return out;
  } catch {
    return {};
  }
}

/** Add one read of each topic, keep the strongest twelve. */
export function bumpInterests(weights: Record<string, number>, topics: readonly string[]): Record<string, number> {
  const next = { ...weights };
  for (const t of topics) next[t] = Math.min((next[t] ?? 0) + 1, MAX_WEIGHT);
  return Object.fromEntries(
    Object.entries(next)
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_TOPICS),
  );
}

function clear(): void {
  try {
    document.cookie = `${INTERESTS_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
  } catch {
    /* cookies disabled — nothing stored either */
  }
}

/**
 * Count this article's topics — only with consent. Called once per article
 * page; re-runs when consent arrives later on the same page, and clears the
 * cookie when it is withdrawn.
 */
export function trackInterests(topics: readonly string[]): () => void {
  if (typeof document === "undefined") return () => {};
  let counted = false;
  const apply = () => {
    if (!consentGranted("functional")) {
      clear();
      return;
    }
    if (counted) return;
    counted = true;
    try {
      const value = encodeURIComponent(JSON.stringify(bumpInterests(readInterests(document.cookie), topics)));
      document.cookie = `${INTERESTS_COOKIE}=${value}; Max-Age=${MAX_AGE_S}; Path=/; SameSite=Lax`;
    } catch {
      /* cookies disabled — recommendations simply stay generic */
    }
  };
  apply();
  return onConsentChange(apply);
}
