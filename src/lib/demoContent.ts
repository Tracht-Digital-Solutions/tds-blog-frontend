/**
 * Demo content for a no-API build. When PUBLIC_DEMO_MODE=true the
 * build-time content client serves these posts instead of fetching
 * tds-content-api, so the blog renders fully without a backend.
 *
 * Fixtures are cast to the API return types so the demo stays decoupled
 * from the exact BlogPost shape (which carries a couple of fields beyond
 * what the pages read).
 */
import type { BlogPost } from "@tracht-digital-solutions/tds-shared";

export const DEMO_MODE = import.meta.env.PUBLIC_DEMO_MODE === "true";

type PostSummary = Pick<
  BlogPost,
  "id" | "slug" | "lang" | "category" | "title" | "excerpt" | "coverHint" | "tags" | "publishedAt"
>;

const day = 86_400_000;
const date = (offsetDays: number): string =>
  new Date(Date.now() + offsetDays * day).toISOString().slice(0, 10);

interface DemoSeed {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  tags: string;
  publishedAt: string;
  body: string;
}

const SEEDS: DemoSeed[] = [
  {
    slug: "statisch-ausliefern",
    category: "Technik",
    title: "Warum wir statisch ausliefern",
    excerpt:
      "Astro + SSG bringen schnelle Seiten ohne Server-Runtime. Was das für Wartung, Sicherheit und Kosten bedeutet.",
    tags: "astro,performance,ssg",
    publishedAt: date(-4),
    body: [
      "Statische Auslieferung heißt: Die Seiten werden einmal zur Build-Zeit erzeugt und dann als reines HTML ausgeliefert. Kein Server-Prozess, der pro Anfrage rechnet.",
      "## Schnell und robust",
      "Ohne Runtime gibt es keine kalten Starts, keine Datenbank im kritischen Pfad und kaum Angriffsfläche. Inhalte fließen zur Build-Zeit ein und werden eingebacken.",
      "## Wann es nicht passt",
      "Hochdynamische, personalisierte Ansichten gehören in eine App. Für Marketing, Blog und Dokumentation ist statisch fast immer die bessere Wahl.",
    ].join("\n\n"),
  },
  {
    slug: "design-system-tokens",
    category: "Design",
    title: "Ein Design-System aus Tokens",
    excerpt:
      "Farben, Typografie und Komponenten zentral pflegen — einmal ändern, überall konsistent.",
    tags: "design-system,tokens,css",
    publishedAt: date(-18),
    body: [
      "Ein Design-System lebt von einer einzigen Quelle der Wahrheit. Tokens beschreiben Farbe, Abstand und Typografie unabhängig vom konkreten Bauteil.",
      "## Tokens statt Hardcoding",
      "Wer Werte einmal als Token definiert, ändert das Erscheinungsbild später an einer Stelle — und alle Oberflächen ziehen automatisch nach.",
      "## Dark Mode inklusive",
      "Strukturelle Tokens kippen im dunklen Theme; feste Flächen bleiben fest. So bleibt der Kontrast überall stimmig.",
    ].join("\n\n"),
  },
  {
    slug: "headless-cms-workflow",
    category: "Workflow",
    title: "Redaktion mit Headless-CMS",
    excerpt:
      "Wie Inhalte zur Build-Zeit einfließen und der Blog trotzdem statisch bleibt.",
    tags: "cms,workflow,content",
    publishedAt: date(-33),
    body: [
      "Ein Headless-CMS trennt Inhalt von Darstellung. Die Redaktion pflegt Texte; der Build holt sie ab und rendert daraus statische Seiten.",
      "## Veröffentlichen heißt bauen",
      "Beim Publizieren stößt das CMS einen neuen Build an. Sekunden später ist der Artikel live — als statische Datei.",
      "## Vorschau ohne Risiko",
      "Entwürfe bleiben unsichtbar, bis sie freigegeben sind. Die öffentliche Seite zeigt nur veröffentlichte Beiträge.",
    ].join("\n\n"),
  },
];

function summaryFor(seed: DemoSeed, id: number, lang: "de" | "en"): PostSummary {
  return {
    id,
    slug: seed.slug,
    lang,
    category: seed.category,
    title: seed.title,
    excerpt: seed.excerpt,
    coverHint: null,
    tags: seed.tags,
    publishedAt: seed.publishedAt,
  } as PostSummary;
}

export function demoPostList(lang?: "de" | "en"): PostSummary[] {
  const langs: Array<"de" | "en"> = lang ? [lang] : ["de"];
  const out: PostSummary[] = [];
  let id = 1;
  for (const l of langs) {
    for (const seed of SEEDS) {
      out.push(summaryFor(seed, id++, l));
    }
  }
  return out;
}

export function demoPost(slug: string, lang: "de" | "en"): BlogPost | null {
  const seed = SEEDS.find((s) => s.slug === slug);
  if (!seed) return null;
  return {
    id: SEEDS.indexOf(seed) + 1,
    slug: seed.slug,
    lang,
    category: seed.category,
    title: seed.title,
    excerpt: seed.excerpt,
    body: seed.body,
    coverHint: null,
    tags: seed.tags,
    publishedAt: seed.publishedAt,
    draft: false,
    createdAt: seed.publishedAt,
    updatedAt: seed.publishedAt,
  } as unknown as BlogPost;
}
