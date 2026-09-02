/**
 * Demo content for a no-API build. When PUBLIC_DEMO_MODE=true — or when the
 * content API is unreachable — the build-time content client serves these
 * posts instead, so the blog renders fully without a backend.
 *
 * Fixtures are cast to the API return types so the demo stays decoupled
 * from the exact BlogPost shape (which carries a couple of fields beyond
 * what the pages read).
 *
 * **These mirror the launch articles seeded by `tds-ext-blog-cms-pkg`'s
 * `BlogCmsSeedPosts` migration** — same slugs, same titles, condensed bodies.
 * The point of a fallback is that a visitor cannot tell it apart from the real
 * thing; three developer-topic articles about SSG and design tokens (what used
 * to be here) advertised something the business does not sell. The canonical
 * full text lives in the migration; keep the slugs and titles in step with it,
 * and don't bother matching the bodies word for word.
 *
 * Each seed carries BOTH languages. Until 2026-08-16 the seeds were German
 * only and `demoPostList("en")` handed the German text back labelled
 * `lang: "en"`, so an English demo build rendered a German blog with no
 * warning anywhere.
 */
import type { BlogPost } from "@tracht-digital-solutions/tds-shared";

export const DEMO_MODE = import.meta.env.PUBLIC_DEMO_MODE === "true";

type PostSummary = Pick<
  BlogPost,
  | "id"
  | "slug"
  | "lang"
  | "category"
  | "title"
  | "excerpt"
  | "coverHint"
  | "tags"
  | "publishedAt"
  | "viewCount"
  | "authorId"
  | "author"
>;

/** A single demo author so a no-API build still exercises the author pages. */
const DEMO_AUTHOR = {
  id: 1,
  name: "Julian Tracht",
  slug: "julian-tracht",
  avatarUrl: null,
  bio: "Freier Entwickler aus Schwarzenbek bei Hamburg. Baut Websites, Webshops und individuelle Werkzeuge für Selbstständige, kleine Unternehmen und lokale Betriebe.",
};

const day = 86_400_000;
const date = (offsetDays: number): string =>
  new Date(Date.now() + offsetDays * day).toISOString().slice(0, 10);

/** The language-specific half of a seed. */
interface DemoVariant {
  category: string;
  title: string;
  excerpt: string;
  tags: string;
  body: string;
}

interface DemoSeed {
  slug: string;
  publishedAt: string;
  de: DemoVariant;
  en: DemoVariant;
}

const SEEDS: DemoSeed[] = [
  {
    slug: "digitalisierung-faengt-klein-an",
    publishedAt: date(-4),
    de: {
      category: "Digitalisierung",
      title: "Digitalisierung fängt nicht beim Großprojekt an",
      excerpt:
        "Sie fängt bei dem einen Ablauf an, der jede Woche Stunden kostet — und den außer Ihnen niemand sieht.",
      tags: "digitalisierung,prozesse,kleine-unternehmen",
      body: [
        "Wenn von Digitalisierung die Rede ist, denken viele sofort an ein großes Vorhaben: neue Software für den ganzen Betrieb, Schulungen, Umstellung, monatelang Unruhe. Das schreckt zu Recht ab. Und es ist meistens gar nicht der richtige Anfang.",
        "Der bessere Anfang ist kleiner und unspektakulärer. Er liegt bei der einen Aufgabe, die jede Woche Zeit frisst und über die sich niemand mehr beschwert, weil alle sich daran gewöhnt haben.",
        "## Drei Fragen, die den Anfang finden",
        "**Welche Zahl schreiben Sie mehr als einmal auf?** Ein Preis, der in der Kasse steht, in einer Preisliste und noch einmal auf der Website. Jede Stelle, an der dieselbe Information ein zweites Mal eingegeben wird, ist eine Stelle, an der sie auseinanderlaufen kann.",
        "**Was fragen Sie regelmäßig bei jemand anderem nach?** Wenn Sie nicht selbst nachsehen können, wie viel noch da ist, dann hängt eine Information an einer Person statt an einem Ort. Das funktioniert, solange die Person da ist.",
        "**Welche Aufgabe schieben Sie regelmäßig auf?** Aufschieben ist ein zuverlässiger Hinweis darauf, dass etwas unnötig umständlich ist. Nicht unwichtig — umständlich.",
        "## Warum klein anfangen der schnellere Weg ist",
        "Ein kleiner Anfang ist schnell wieder rückgängig zu machen. Wenn sich nach vier Wochen zeigt, dass die Lösung nicht passt, haben Sie vier Wochen verloren und nicht ein Jahr.",
        "Er beweist außerdem etwas: Nach der ersten Umstellung wissen Sie nicht mehr theoretisch, sondern konkret, ob digitale Abläufe in Ihrem Betrieb Zeit sparen. Und er zieht den Rest hinter sich her — wer die Artikeldaten einmal sauber an einem Ort hat, hat den Webshop, die Preisliste und die Inventur schon halb gelöst.",
        "## Wo es sich nicht lohnt",
        "Auch das gehört dazu. Ein Ablauf, den Sie zweimal im Jahr durchlaufen, lohnt keine eigene Lösung, egal wie lästig er ist. Und wenn eine bestehende Standardlösung das Problem zu achtzig Prozent trifft, ist das oft besser als eine eigene, die zu hundert Prozent trifft und gepflegt werden muss.",
        "Die Frage ist nie „geht das digital?“ — es geht fast immer. Die Frage ist, ob der Aufwand sich innerhalb eines überschaubaren Zeitraums zurückzahlt.",
      ].join("\n\n"),
    },
    en: {
      category: "Digitalization",
      title: "Digitalization doesn't start with a big project",
      excerpt:
        "It starts with the one routine that costs hours every week — the one nobody but you can see.",
      tags: "digitalization,workflows,small-business",
      body: [
        "When digitalization comes up, most people picture something large: new software for the whole company, training, migration, months of disruption. That is off-putting for good reason. It is also, usually, the wrong place to start.",
        "The better start is smaller and far less dramatic. It sits with the one task that eats time every week and that nobody complains about any more, because everyone has got used to it.",
        "## Three questions that find the start",
        "**Which number do you write down more than once?** A price that lives in the till, in a price list, and again on the website. Every place the same information is entered a second time is a place where the two can drift apart.",
        "**What do you regularly have to ask somebody else?** If you can't look up yourself how much is left, then a piece of information is attached to a person rather than to a place. That works for exactly as long as the person is there.",
        "**Which task do you keep putting off?** Procrastination is a reliable sign that something is needlessly awkward. Not unimportant — awkward.",
        "## Why starting small is the faster route",
        "A small start is quick to undo. If it turns out after four weeks that the solution doesn't fit, you have lost four weeks and not a year.",
        "It also proves something: after the first change you no longer know in theory but concretely whether digital workflows save time in your business. And it pulls the rest along — get your product data into one place properly and you have half-solved the online shop, the price list and the stocktake.",
        "## Where it isn't worth it",
        "That matters too. A workflow you go through twice a year doesn't justify its own solution, however irritating it is. And where an existing off-the-shelf product hits eighty per cent of the problem, that is often better than a bespoke one that hits a hundred per cent and has to be maintained.",
        "The question is never “can this be done digitally?” — it almost always can. The question is whether the effort pays for itself within a sensible period.",
      ].join("\n\n"),
    },
  },
  {
    slug: "lohnt-sich-ein-webshop",
    publishedAt: date(-18),
    de: {
      category: "Webshop",
      title: "Lohnt sich ein Webshop für mein Ladengeschäft?",
      excerpt:
        "Nicht für jedes Sortiment. Vier Fragen, die die Antwort meist schon vorwegnehmen.",
      tags: "webshop,onlineverkauf,lokaler-handel",
      body: [
        "Ein Webshop wird oft als naheliegender nächster Schritt gehandelt: Sie haben Produkte, also verkaufen Sie sie eben auch online. In der Praxis ist die Entscheidung weniger eindeutig, weil ein Shop etwas mitbringt, was eine Website nicht hat — **laufende Arbeit**.",
        "Eine Website ist irgendwann fertig. Ein Shop nie: Bestände ändern sich, Preise ändern sich, Bestellungen wollen bearbeitet, verpackt und versendet werden. Das ist der eigentliche Kostenpunkt, nicht die Einrichtung.",
        "## 1. Ist Ihr Sortiment gut versendbar?",
        "Leicht, haltbar, unempfindlich, nicht zu sperrig — das ist die freundliche Seite. Schwer, zerbrechlich, kühlpflichtig oder frisch macht den Versand schnell teurer als die Marge hergibt. Dann kann **Abholung** das bessere Modell sein: online aussuchen und bezahlen, im Laden mitnehmen.",
        "## 2. Wie oft ändern sich Preise und Bestände?",
        "Die kritische Frage ist nicht, ob Sie die Pflege schaffen, sondern **wo** Sie sie tun. Ist sie nur am Rechner im Büro möglich, passiert sie abends oder gar nicht. Geht sie vom Handy aus, während Sie ohnehin an der Ware stehen, passiert sie nebenbei.",
        "## 3. Wer soll dort kaufen?",
        "Es macht einen großen Unterschied, ob der Shop Ihre bestehenden Kunden bequemer bedienen oder neue Kunden aus ganz Deutschland bringen soll. Das erste ist realistisch und schnell zu erreichen. Das zweite bedeutet Wettbewerb mit Anbietern, die Versand im großen Stil betreiben.",
        "## 4. Wer bearbeitet die Bestellungen?",
        "Die unspektakulärste und wichtigste Frage. Eine Bestellung, die drei Tage liegt, weil im Laden Betrieb war, kostet Sie den Kunden. Wenn es keine Antwort darauf gibt, ist der Shop noch nicht bereit — unabhängig davon, wie gut er gebaut ist.",
        "## Ein guter Zwischenschritt",
        "Wenn Sie bei zwei der vier Fragen zögern: eine Seite, die Ihr Sortiment mit Preisen und Verfügbarkeit **zeigt**, ohne zu verkaufen. Das bringt einen großen Teil des Nutzens ohne Zahlungsabwicklung, Versandkosten und tägliche Bestellbearbeitung — und ist die Grundlage, auf der ein echter Shop später aufsetzt.",
      ].join("\n\n"),
    },
    en: {
      category: "Online shop",
      title: "Is an online shop worth it for my local business?",
      excerpt:
        "Not for every range of products. Four questions that usually answer it for you.",
      tags: "online-shop,ecommerce,local-retail",
      body: [
        "An online shop gets treated as the obvious next step: you have products, so sell them online as well. In practice the decision is less clear-cut, because a shop brings something a website doesn't — **ongoing work**.",
        "A website is finished at some point. A shop never is: stock changes, prices change, orders need processing, packing and sending. That is the real cost, not the setup.",
        "## 1. Does your range ship well?",
        "Light, durable, robust, not too bulky — that's the friendly end. Heavy, fragile, chilled or fresh makes shipping more expensive than the margin allows, fast. Then **collection** may be the better model: choose and pay online, pick up in the shop.",
        "## 2. How often do prices and stock change?",
        "The critical question isn't whether you can manage the upkeep but **where** you do it. If it's only possible at the office computer, it happens in the evening or not at all. If it works from a phone while you're standing next to the goods anyway, it happens in passing.",
        "## 3. Who is meant to buy there?",
        "There's a large difference between serving your existing customers more conveniently and winning new customers from across the country. The first is realistic and quick to reach. The second means competing with sellers who ship at scale.",
        "## 4. Who processes the orders?",
        "The least glamorous and most important question. An order left sitting for three days because the shop was busy costs you the customer. If there's no answer to it, the shop isn't ready — regardless of how well it's built.",
        "## A sensible halfway step",
        "If you hesitate on two of the four questions: a page that **shows** your range with prices and availability without selling. That delivers a large share of the benefit without payment handling, shipping costs and daily order processing — and it is the foundation a real shop can later sit on.",
      ].join("\n\n"),
    },
  },
  {
    slug: "excel-oder-eigenes-werkzeug",
    publishedAt: date(-33),
    de: {
      category: "Werkzeuge",
      title: "Excel-Tabelle oder eigenes Werkzeug? Eine ehrliche Entscheidungshilfe",
      excerpt:
        "Eine Tabelle trägt erstaunlich weit. Es gibt aber drei Punkte, an denen sie zuverlässig kippt.",
      tags: "excel,werkzeuge,auswertung",
      body: [
        "Excel bekommt zu Unrecht einen schlechten Ruf. Eine Tabelle ist sofort verfügbar, kostet nichts extra, jeder kann sie bedienen, und für erstaunlich viele Aufgaben ist sie schlicht die richtige Antwort. Ich habe schon Kunden davon abgeraten, eine gut funktionierende Tabelle zu ersetzen.",
        "Es gibt aber drei Punkte, an denen eine Tabelle zuverlässig kippt. Wenn Sie zwei davon erreicht haben, wird ein eigenes Werkzeug meistens billiger — nicht in der Anschaffung, sondern über das Jahr gerechnet.",
        "## Kipppunkt 1: Mehr als eine Person arbeitet daran",
        "Sobald zwei Leute gleichzeitig hineinschreiben, beginnt die bekannte Kette aus `Preise_final.xlsx` und `Preise_final_neu_Mai.xlsx`. Das eigentliche Problem ist nicht die gleichzeitige Bearbeitung, sondern dass niemand mehr sicher sagen kann, **welche Datei die richtige ist**.",
        "## Kipppunkt 2: Es gibt Regeln, die jemand einhalten muss",
        "Eine Tabelle nimmt alles an: ein Datum in der Mengenspalte, einen Text im Preisfeld, eine halb leere Zeile. Sie sagt nichts. Der Fehler fällt drei Wochen später auf, und dann ist unklar, seit wann er drin ist. Menschen halten Regeln unter Zeitdruck nicht zuverlässig ein — das ist keine Kritik, das ist einfach so.",
        "## Kipppunkt 3: Dieselben Daten liegen an zwei Orten",
        "Sobald Artikelnummern oder Preise sowohl in der Tabelle als auch in der Kasse oder im Shop stehen, laufen die Stände auseinander. Nicht vielleicht, sondern sicher. Der eigentliche Gewinn eines Werkzeugs ist dann nicht die schönere Oberfläche, sondern dass es **eine Quelle** gibt.",
        "## Was ein eigenes Werkzeug nicht besser kann",
        "In einer Tabelle probieren Sie schnell etwas aus, ohne jemanden zu fragen. Diese Freiheit verlieren Sie zum Teil. Deshalb ist der übliche Fehler, zu viel auf einmal ersetzen zu wollen: Meist übernimmt das Werkzeug die **strukturierte Erfassung**, während die **freie Auswertung** ein Export nach Excel bleiben darf.",
        "## Die einfache Faustregel",
        "Wenn Sie die Tabelle allein pflegen, sie nicht mit anderen Systemen abgleichen müssen und Fehler darin schnell auffallen, dann bleiben Sie dabei. Bei zwei von drei anderslautenden Antworten lohnt es sich zu rechnen.",
      ].join("\n\n"),
    },
    en: {
      category: "Tools",
      title: "Spreadsheet or a tool of your own? An honest way to decide",
      excerpt:
        "A spreadsheet carries you surprisingly far. There are three points, though, where it reliably tips over.",
      tags: "spreadsheets,tools,reporting",
      body: [
        "Spreadsheets get an unfairly bad name. One is available immediately, costs nothing extra, everybody can use it, and for a surprising number of jobs it is simply the right answer. I have talked clients out of replacing a spreadsheet that was working fine.",
        "There are, however, three points at which a spreadsheet reliably tips over. Once you've hit two of them, a purpose-built tool usually works out cheaper — not to buy, but measured across the year.",
        "## Tipping point 1: more than one person works on it",
        "The moment two people write into it at once, the familiar chain of `prices_final.xlsx` and `prices_final_new_may.xlsx` begins. The real problem isn't simultaneous editing; it's that nobody can say with confidence **which file is the right one**.",
        "## Tipping point 2: there are rules somebody has to follow",
        "A spreadsheet accepts everything: a date in the quantity column, text in the price field, a half-empty row. It says nothing. The error surfaces three weeks later, and by then nobody knows how long it's been there. People don't hold to rules reliably under time pressure — that isn't a criticism, it's just how it is.",
        "## Tipping point 3: the same data lives in two places",
        "As soon as product codes or prices sit both in the spreadsheet and in the till or the shop, the two will drift apart. Not possibly; certainly. At that stage the real gain from a tool isn't the nicer interface but that there is **one source**.",
        "## What a purpose-built tool does worse",
        "In a spreadsheet you try something out quickly without asking anyone. You give up part of that freedom. Which is why the usual mistake is trying to replace too much at once: normally **structured capture** moves into the tool, while **free-form analysis** stays an export to a spreadsheet.",
        "## The simple rule of thumb",
        "If you maintain the spreadsheet on your own, don't have to reconcile it with other systems, and errors in it surface quickly, then stay with it. If two of those three go the other way, it's worth doing the sums.",
      ].join("\n\n"),
    },
  },
  {
    slug: "vom-baukasten-shop-zum-eigenen-shop",
    publishedAt: date(-1),
    de: {
      category: "Webshop",
      title: "Wenn der Baukasten-Shop nicht mehr mitwächst",
      excerpt:
        "Ein gehosteter Shop-Baukasten trägt die ersten Jahre zuverlässig. Woran man merkt, dass er es nicht mehr tut — und was ein Umzug wirklich bedeutet.",
      tags: "webshop,produktdaten,preispflege",
      body: [
        "Ein gehosteter Shop-Baukasten ist für den Start eine vernünftige Entscheidung. Er kostet wenig, läuft ohne eigenen Server und bringt Zahlungsarten, Versandregeln und eine Bestellabwicklung mit. Irgendwann kippt das Verhältnis: Der Shop läuft weiter wie immer, aber jede Änderung daran kostet mehr Zeit als früher.",
        "## Woran man merkt, dass der Baukasten eng wird",
        "**Das Sortiment wächst schneller als die Werkzeuge.** Zweihundert Artikel pflegt man von Hand, zwanzigtausend nicht mehr. **Der Import bleibt ein Formular** — sobald die Daten des Lieferanten anders aussehen, entsteht Handarbeit. Und **kleine Wünsche werden zu großen Fragen**: In einem Baukasten ist etwas entweder vorgesehen oder es geht nicht.",
        "## Ein Umzug ist kein Design-Projekt",
        "Der Umzug entscheidet sich an den Daten, nicht am Aussehen. Aus dem alten System kommt ein Export, und der ist fast nie so, wie ihn das neue System braucht: Varianten stehen als eigene Artikel nebeneinander, Hersteller heißen an drei Stellen unterschiedlich, Preise enthalten mal Steuer und mal nicht.",
        "## Produktdaten sind das eigentliche Projekt",
        "Bei großen Sortimenten besteht die Pflege aus drei Dingen, die sich wiederholen: **analysieren** (was fehlt, was weicht ab), **filtern** (eine Marke, eine Serie, alles unter einer Marge) und **Preise aktualisieren** — als nachvollziehbarer Lauf, den man zurückdrehen kann, nicht als Reihe einzelner Eingaben.",
        "## Ein Sortiment, mehrere Vertriebskanäle",
        "Jeder Marktplatz will die Daten in seinem eigenen Zuschnitt. Jeden Kanal für sich zu pflegen funktioniert genau so lange, bis sich ein Preis ändert. Tragfähig ist ein gepflegter Datenbestand als Quelle, aus dem jeder Kanal seine Fassung bekommt.",
      ].join("\n\n"),
    },
    en: {
      category: "Online shop",
      title: "When the hosted shop builder stops keeping up",
      excerpt:
        "A hosted shop builder carries you reliably for the first few years. How to tell when it no longer does — and what a migration actually involves.",
      tags: "online-shop,product-data,pricing",
      body: [
        "A hosted shop builder is a sensible decision at the start. It costs little, runs without a server of your own, and brings payment methods, shipping rules and order handling with it. At some point the balance tips: the shop keeps running exactly as before, but every change to it costs more time than it used to.",
        "## How to tell the builder is getting tight",
        "**The catalogue grows faster than the tools.** Two hundred articles can be maintained by hand, twenty thousand cannot. **The import stays a form** — as soon as a supplier's data looks different, manual work appears. And **small wishes turn into big questions**: in a builder something is either provided for or it is not.",
        "## A migration is not a design project",
        "A migration is decided by the data, not the appearance. The old system produces an export, and it is almost never what the new system needs: variants stand next to each other as separate articles, manufacturers are spelled three different ways, prices sometimes include tax and sometimes do not.",
        "## The product data is the real project",
        "With a large catalogue, upkeep is three repeating things: **analysis** (what is missing, what differs), **filtering** (one brand, one series, everything below a margin) and **price updates** — as a traceable, reversible run rather than a series of individual edits.",
        "## One catalogue, several sales channels",
        "Every marketplace wants the data in its own shape. Maintaining each channel separately works exactly until a price changes. What holds up is one maintained set of data as the source, from which every channel gets its own version.",
      ].join("\n\n"),
    },
  },
];

function summaryFor(seed: DemoSeed, id: number, lang: "de" | "en"): PostSummary {
  const v = seed[lang];
  return {
    id,
    slug: seed.slug,
    lang,
    category: v.category,
    title: v.title,
    excerpt: v.excerpt,
    coverHint: null,
    tags: v.tags,
    publishedAt: seed.publishedAt,
    // Spread the view counts so the author page's views/trend sort is visibly
    // different from the date sort in a demo build.
    viewCount: id * 137,
    authorId: DEMO_AUTHOR.id,
    author: DEMO_AUTHOR,
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

/** One curated "Aktuelle Themen" entry (mirrors the content-api topics shape). */
export interface TopicItem {
  title: string;
  description?: string;
  href?: string;
}

/** The curated current-topics block for one language. */
export interface TopicsBlock {
  headline: string;
  intro?: string;
  items: TopicItem[];
}

/**
 * Demo "Aktuelle Themen" for a no-API build, per language. The hrefs point at
 * tag pages, so each tag must actually appear in a seed's `tags` above or the
 * link lands on an empty listing.
 */
export function demoTopics(lang: "de" | "en"): TopicsBlock {
  if (lang === "en") {
    return {
      headline: "Current topics",
      intro: "What I'm thinking and writing about right now.",
      items: [
        { title: "Digitalization", description: "Starting with one workflow instead of a big project.", href: "/en/tag/digitalization" },
        { title: "Online shops", description: "Selling online without complicating the shop floor.", href: "/en/tag/online-shop" },
        { title: "Tools", description: "When a spreadsheet stops being the right answer.", href: "/en/tag/tools" },
      ],
    };
  }
  return {
    headline: "Aktuelle Themen",
    intro: "Worüber ich gerade nachdenke und schreibe.",
    items: [
      { title: "Digitalisierung", description: "Mit einem Ablauf anfangen statt mit einem Großprojekt.", href: "/tag/digitalisierung" },
      { title: "Webshops", description: "Online verkaufen, ohne den Ladenalltag zu verkomplizieren.", href: "/tag/webshop" },
      { title: "Werkzeuge", description: "Wann eine Tabelle nicht mehr die richtige Antwort ist.", href: "/tag/werkzeuge" },
    ],
  };
}

export function demoPost(slug: string, lang: "de" | "en"): BlogPost | null {
  const seed = SEEDS.find((s) => s.slug === slug);
  if (!seed) return null;
  const v = seed[lang];
  return {
    id: SEEDS.indexOf(seed) + 1,
    slug: seed.slug,
    lang,
    category: v.category,
    title: v.title,
    excerpt: v.excerpt,
    body: v.body,
    coverHint: null,
    tags: v.tags,
    publishedAt: seed.publishedAt,
    draft: false,
    createdAt: seed.publishedAt,
    updatedAt: seed.publishedAt,
    viewCount: (SEEDS.indexOf(seed) + 1) * 137,
    authorId: DEMO_AUTHOR.id,
    author: DEMO_AUTHOR,
  } as unknown as BlogPost;
}
