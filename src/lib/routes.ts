/**
 * The corpus queries the dynamic routes used to express as `getStaticPaths`.
 *
 * ### Why they moved here
 *
 * Under `output: "static"` each dynamic route enumerated its own pages and
 * handed the matching subset in as props. Server-rendered, that inverts:
 * **`getStaticPaths` is not allowed on an on-demand route** — the page reads
 * `Astro.params` and has to answer 404 itself. Twelve routes needed the same
 * shape, so the grouping lives here, once, and each page is left with a
 * lookup and a guard.
 *
 * Every function returns `null` for "no such page", which is the signal to
 * answer 404. Returning an empty list instead would render a category page
 * for a category nobody wrote — indexable, empty and permanently 200.
 */

import { listAllPosts } from "./content-api";
import { PAGE_SIZE, paginate } from "./pagination";
import { categorySlug } from "./taxonomy";

export type Lang = "de" | "en";

/**
 * A post as the LIST endpoint returns it — a Pick of the full BlogPost, not
 * the whole row. Derived from the function rather than restated, so a field
 * added to the list response reaches these helpers without an edit.
 */
export type PostSummary = Awaited<ReturnType<typeof listAllPosts>>[number];

/** A post's author, as the corpus carries it. */
type Author = NonNullable<PostSummary["author"]>;

/**
 * Every published post in a language.
 *
 * Thin wrapper so a failure is a failure: `listAllPosts` is fail-soft and
 * answers `[]` when the API is unreachable, which for an index page is the
 * right thing (an empty journal beats a 500) and for a *detail* page is not —
 * see the individual lookups below, which cannot tell "no such tag" from
 * "the API is down" and deliberately treat both as 404.
 */
export async function corpus(lang: Lang): Promise<PostSummary[]> {
  return listAllPosts(lang);
}

/** Posts in one category, plus the original (unslugged) name. */
export async function byCategory(
  lang: Lang,
  slug: string,
): Promise<{ name: string; posts: PostSummary[] } | null> {
  const wanted = slug.trim().toLowerCase();
  if (!wanted) return null;

  let name: string | null = null;
  const posts: PostSummary[] = [];
  for (const post of await corpus(lang)) {
    const category = post.category?.trim();
    if (!category || categorySlug(category) !== wanted) continue;
    // The slug is lossy, so the display name comes from the first post that
    // carries it rather than from un-slugging.
    name ??= category;
    posts.push(post);
  }

  return name === null ? null : { name, posts };
}

/** Posts carrying one tag. Tags are a comma-separated, case-insensitive list. */
export async function byTag(
  lang: Lang,
  tag: string,
): Promise<{ posts: PostSummary[]; allPosts: PostSummary[] } | null> {
  const wanted = tag.trim().toLowerCase();
  if (!wanted) return null;

  const allPosts = await corpus(lang);
  const posts = allPosts.filter((post) =>
    (post.tags ?? "")
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
      .includes(wanted),
  );

  return posts.length === 0 ? null : { posts, allPosts };
}

/** Posts by one author, plus the author record. */
export async function byAuthor(
  lang: Lang,
  slug: string,
): Promise<{ author: Author; posts: PostSummary[] } | null> {
  const wanted = slug.trim();
  if (!wanted) return null;

  let author: Author | null = null;
  const posts: PostSummary[] = [];
  for (const post of await corpus(lang)) {
    if (post.author?.slug !== wanted) continue;
    author ??= post.author;
    posts.push(post);
  }

  return author === null ? null : { author, posts };
}

/**
 * One page of the paginated archive.
 *
 * Page 1 is `/` and is not served by `/page/[num]`, so a request for
 * `/page/1` is a 404 here — exactly as under the static build, which never
 * emitted it. Anything past the last page is a 404 too, rather than an empty
 * list: a crawler that discovers `/page/99` should be told it does not exist.
 */
export async function archivePage(
  lang: Lang,
  num: string,
): Promise<{ allPosts: PostSummary[]; page: number } | null> {
  if (!/^[0-9]+$/.test(num)) return null;
  const page = Number(num);
  if (page < 2) return null;

  const allPosts = await corpus(lang);
  const pageCount = Math.max(1, Math.ceil(allPosts.length / PAGE_SIZE));
  if (page > pageCount) return null;

  return { allPosts, page };
}

export { PAGE_SIZE, paginate };
