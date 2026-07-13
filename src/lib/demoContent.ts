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
  bio: "Entwickelt Software, Websites und Digitalisierungslösungen für kleine und mittlere Unternehmen — ansässig in Schwarzenbek bei Hamburg.",
};

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
      "Statische Auslieferung heißt: Jede Seite wird einmal zur Build-Zeit erzeugt und danach als fertiges HTML ausgeliefert. Kein Server-Prozess, der pro Anfrage rechnet, keine Datenbank, die im Moment des Klicks antworten muss. Der Browser bekommt genau die Datei, die beim letzten Build entstanden ist — und die liegt idealerweise schon im Cache am nächsten Netzknoten.",
      "Für ein Marketing-Angebot, einen Blog oder eine Dokumentation ist das kein Kompromiss, sondern der Normalfall. Wir bauen die öffentlichen Seiten von Tracht Digital Solutions mit Astro im Modus `output: 'static'` — und liefern sie ohne Node-Runtime auf dem Produktionsserver aus.",
      "## Was „statisch“ wirklich bedeutet",
      "Statisch heißt nicht „unveränderlich“ und schon gar nicht „ohne Inhalte aus einer Datenbank“. Es heißt nur: Der teure Teil — Daten holen, Templates rendern, HTML zusammensetzen — passiert einmal beim Build, nicht bei jedem Besuch.",
      "Der Unterschied zu einer klassisch server-gerenderten Seite ist der Zeitpunkt. Server-Rendering rechnet pro Anfrage; statische Auslieferung rechnet pro Veröffentlichung. Bei Inhalten, die sich stündlich und nicht pro Sekunde ändern, ist der zweite Weg um Größenordnungen effizienter.",
      "## Schnell, weil nichts dazwischensteht",
      "Ohne Runtime gibt es keine Cold Starts, keine Datenbank im kritischen Pfad, keinen Anwendungsserver, der unter Last einbricht. Eine HTML-Datei vom CDN ist praktisch immer schneller ausgeliefert als eine, die erst berechnet werden muss.",
      "Astro hilft zusätzlich mit „Islands“: Interaktive Komponenten werden nur dort geladen, wo sie wirklich gebraucht werden. Der Rest der Seite bleibt reines HTML ganz ohne JavaScript. Das Ergebnis sind kleine Bundles, kurze Ladezeiten und stabile Core-Web-Vitals-Werte — messbar, nicht nur gefühlt.",
      "## Sicherheit durch Weglassen",
      "Die sicherste Komponente ist die, die es gar nicht gibt. Wo kein Anwendungsserver läuft und keine Datenbank am öffentlichen Endpunkt hängt, fehlt die halbe Angriffsfläche: keine SQL-Injection, kein verwundbarer Server-Prozess, keine veraltete Runtime, die ständig gepatcht werden will.",
      "Dynamik, die tatsächlich einen Server braucht — Login, Zahlungen, Kundendaten — kapseln wir bewusst in getrennte APIs hinter einem einzigen Gateway. Die öffentliche Seite selbst bleibt eine Sammlung statischer Dateien und ist damit denkbar schwer anzugreifen.",
      "## Was das für Kosten und Wartung heißt",
      "Statisches Hosting ist günstig und langweilig — im besten Sinn. Es gibt keinen Prozess, der nachts abstürzt, kein Autoscaling, das konfiguriert werden will, keine Runtime-Version, die zum Sicherheitsrisiko wird. Ein Fehler im Build fällt vor dem Deploy auf, nicht um drei Uhr nachts im Log.",
      "Für kleine und mittlere Unternehmen ist das der eigentliche Gewinn: planbare Kosten und eine Seite, die auch dann zuverlässig läuft, wenn monatelang niemand am Server schraubt.",
      "## Wie Inhalte trotzdem frisch bleiben",
      "Der häufigste Einwand lautet: „Aber unsere Inhalte ändern sich doch.“ Genau dafür fließen sie zur Build-Zeit ein. Blogbeiträge und redaktionelle Abschnitte kommen aus einem Headless-CMS und werden beim Bauen als HTML eingebacken. Wer im Redaktionswerkzeug auf „Veröffentlichen“ klickt, stößt einen neuen Build an — Sekunden später ist die Änderung live.",
      "Schlägt der Abruf einmal fehl, fällt die Seite auf ihren statischen Standardinhalt zurück, statt kaputtzugehen. Der Build bricht nicht an einem kurzen Schluckauf der Schnittstelle.",
      "## Wann statisch nicht passt",
      "Hochdynamische, pro Nutzer personalisierte Ansichten gehören nicht in eine statische Seite, sondern in eine App: ein Kundenkonto, ein Warenkorb, ein Dashboard mit Live-Daten. Dort ist ein Server-Prozess kein Ballast, sondern die eigentliche Aufgabe.",
      "Die ehrliche Antwort ist deshalb selten „entweder/oder“. Öffentliche Seiten liefern wir statisch aus; die App-Teile bekommen ihre eigene, klar abgegrenzte Infrastruktur. So zahlt jede Seite genau den Aufwand, den sie wirklich braucht — und keinen Cent mehr.",
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
      "Ein Design-System lebt von einer einzigen Quelle der Wahrheit. Statt Farbwerte, Abstände und Schriftgrößen über Dutzende Dateien zu verstreuen, beschreibt man sie einmal als Tokens — benannte Werte, unabhängig vom konkreten Bauteil, das sie später verwendet.",
      "Ein Token ist nichts Kompliziertes: `--color-primary`, `--space-4`, `--font-display`. Ein Name, ein Wert, eine Bedeutung. Der Trick liegt nicht in der Technik, sondern in der Disziplin, einen Wert nie wieder direkt in eine Komponente zu schreiben.",
      "## Tokens statt Hardcoding",
      "Wer eine Farbe direkt als `#1e3a5f` in zwanzig Komponenten schreibt, hat zwanzig Stellen zu ändern, sobald der Ton nicht mehr passt — und übersieht garantiert eine. Wer stattdessen `var(--color-primary)` schreibt, ändert den Wert an einer einzigen Stelle, und jede Oberfläche zieht automatisch nach.",
      "Derselbe Gedanke gilt für Abstände, Rundungen, Schriftgrößen und Schatten. Je konsequenter man Rohwerte durch Tokens ersetzt, desto mehr wird aus „hier und da nachbessern“ ein einziger, überschaubarer Handgriff.",
      "## Eine Quelle der Wahrheit",
      "Bei Tracht Digital Solutions liegen alle Tokens in einem gemeinsamen Paket, das jede Oberfläche einbindet — die Landingpage, der Blog und die internen Panels. Die Marken-Tokens stehen zentral in einem `@theme`-Block; geteilte Komponenten und ihre Stile kommen aus demselben Paket.",
      "Eine Farbe, eine Schrift oder ein Komponentenstil wird also genau einmal geändert: im geteilten Paket, mit einer neuen Version. Kein Kopieren in einzelne Projekte, kein Auseinanderdriften. Die Regel ist einfach — und sie einzuhalten spart auf Dauer mehr Zeit als jedes Werkzeug.",
      "## Dark Mode fällt fast von allein ab",
      "Der eigentliche Beweis für ein sauberes Token-System ist der Dark Mode. Wenn Farben über Tokens laufen, ist ein dunkles Theme kein zweiter Satz Komponenten, sondern nur ein zweiter Satz Werte für dieselben Namen.",
      "Wichtig ist dabei eine Unterscheidung: Strukturelle Tokens dürfen im dunklen Theme kippen — was hell der Hintergrund war, wird dunkel der Vordergrund. Flächen, die in beiden Themes bewusst dunkel bleiben sollen, brauchen dagegen eigene, feste Tokens. Wer eine kippende Farbe als festen dunklen Hintergrund missbraucht, bekommt im Dark Mode ein invertiertes Ergebnis — der klassische Fehler, den ein System mit klar benannten Tokens von vornherein vermeidet.",
      "## Komponenten erben, statt zu kopieren",
      "Über den reinen Werten stehen die geteilten Komponenten: Buttons, Karten, Statusanzeigen, Ladeindikatoren. Auch sie leben einmal im gemeinsamen Paket und werden von allen Oberflächen konsumiert, nicht pro Projekt nachgebaut.",
      "Das hält nicht nur das Aussehen konsistent, sondern auch das Verhalten: Ein Ladespinner sieht überall gleich aus und funktioniert überall gleich. Bessert man ihn an einer Stelle nach, profitieren alle Seiten — ohne dass irgendwo eine vergessene Kopie zurückbleibt.",
      "## Versionieren und ausrollen",
      "Damit „einmal ändern, überall konsistent“ auch praktisch trägt, wird das Token-Paket versioniert wie jede andere Abhängigkeit. Eine Änderung bekommt eine neue Versionsnummer; die Oberflächen ziehen sie beim nächsten Build. So bleibt nachvollziehbar, welcher Stand wo läuft — und ein Update lässt sich gezielt einspielen, statt heimlich zu passieren.",
      "## Was ein Token-System im Alltag spart",
      "Der Gewinn zeigt sich selten am ersten Tag, sondern beim zehnten Änderungswunsch. Eine neue Markenfarbe, eine angepasste Schrift, ein etwas ruhigerer Schatten: Was ohne System ein Nachmittag Suchen-und-Ersetzen wäre, ist mit Tokens eine kleine, sichere Änderung an einer Stelle.",
      "Für ein wachsendes Digitalangebot ist das kein Luxus, sondern die Voraussetzung dafür, dass es über die Jahre konsistent und pflegbar bleibt — statt bei jedem neuen Projekt ein Stück weiter auseinanderzulaufen.",
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
      "Ein Headless-CMS trennt zwei Dinge, die klassische Systeme vermischen: den Inhalt und seine Darstellung. Die Redaktion pflegt Texte, Bilder und Metadaten in einer aufgeräumten Oberfläche; wie daraus eine Seite wird, entscheidet die Website selbst. Das „headless“ meint genau das — das CMS hat keinen eigenen Kopf, keine fest verdrahtete Ausgabe.",
      "Für einen statisch ausgelieferten Blog ist das die ideale Kombination: bequem redigieren wie in einem klassischen CMS, am Ende aber trotzdem reines, schnelles HTML ausliefern.",
      "## Inhalt und Darstellung trennen",
      "In einem klassischen CMS steckt der Text im selben System, das ihn auch rendert — Theme, Plugins und Datenbank hängen untrennbar zusammen. Ein Headless-Ansatz schneidet diese Kopplung durch: Das CMS stellt Inhalte über eine schlichte Schnittstelle bereit, und die Website holt sich, was sie braucht.",
      "Der Vorteil ist Freiheit auf beiden Seiten. Die Redaktion muss nichts über das Frontend wissen; das Frontend muss nichts über die Speicherung wissen. Beide können sich unabhängig voneinander weiterentwickeln.",
      "## Veröffentlichen heißt bauen",
      "Bei uns fließen die Inhalte zur Build-Zeit ein: Während die Seite gebaut wird, holt sie die veröffentlichten Beiträge aus der Content-API und bäckt daraus statisches HTML. Klickt jemand im Redaktionswerkzeug auf „Veröffentlichen“, stößt das einen neuen Build an — und Sekunden später ist der Artikel live, als fertige Datei.",
      "Wichtig ist die Robustheit dieses Schritts: Schlägt der Abruf einmal fehl, liefert die API eine leere Liste, und die Seite fällt auf ihren statischen Bestand zurück. Der Build bricht nie an einem kurzen Aussetzer der Schnittstelle.",
      "## Vorschau ohne Risiko",
      "Entwürfe bleiben unsichtbar, bis sie freigegeben sind. Die öffentliche Seite listet ausschließlich veröffentlichte Beiträge — ein Entwurf existiert nur im Redaktionswerkzeug und taucht in keinem Build der Live-Seite auf.",
      "So lässt sich in Ruhe schreiben, umstellen und liegen lassen, ohne dass ein halbfertiger Text versehentlich online geht. Der Übergang von „Entwurf“ zu „live“ ist ein bewusster Klick, kein Nebeneffekt.",
      "## Mehrsprachigkeit, die sich selbst pflegt",
      "Jeder Beitrag ist bei uns in Deutsch und Englisch erreichbar. Fehlt eine Sprachfassung, wird sie beim Speichern maschinell erzeugt und als solche gekennzeichnet — eine automatische Übersetzung, die eine handgeschriebene aber niemals überschreibt. Sobald jemand die Übersetzung selbst redigiert, löst sie sich aus der Automatik und gilt als eigenständig gepflegt.",
      "Das Ergebnis ist ein zweisprachiger Blog ohne doppelte Handarbeit: Wer nur Deutsch schreibt, bekommt trotzdem eine brauchbare englische Fassung — und kann sie dort verbessern, wo es sich lohnt.",
      "## Warum nicht am Client laden",
      "Man könnte Inhalte auch erst im Browser nachladen. Für einen Blog wäre das aber der falsche Weg: Es kostet Ladezeit, belastet die Schnittstelle mit jedem einzelnen Besuch und macht die Seite abhängig von einer API, die im Moment des Klicks erreichbar sein muss.",
      "Zur Build-Zeit einzubacken dreht das um. Der Abruf passiert einmal pro Veröffentlichung, nicht einmal pro Leser. Die Seite bleibt schnell, unabhängig und auch dann online, wenn die API gerade wartet.",
      "## Für wen sich das lohnt",
      "Der Aufwand, Inhalt und Darstellung sauber zu trennen, zahlt sich überall dort aus, wo regelmäßig publiziert wird und die Seite trotzdem schnell und wartungsarm bleiben soll — beim Unternehmensblog genauso wie bei einer Wissensdatenbank oder redaktionell gepflegten Landingpage-Abschnitten.",
      "Man bekommt das Beste aus zwei Welten: den Komfort eines Redaktionssystems und die Ruhe einer statischen Seite. Genau diese Kombination macht einen Blog über Jahre pflegbar, ohne dass er zur Dauerbaustelle wird.",
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

/** Demo "Aktuelle Themen" for a no-API build, per language. */
export function demoTopics(lang: "de" | "en"): TopicsBlock {
  if (lang === "en") {
    return {
      headline: "Current topics",
      intro: "What I'm thinking and writing about right now.",
      items: [
        { title: "Static delivery", description: "Astro + SSG for fast, low-maintenance sites.", href: "/en/tag/ssg" },
        { title: "Design tokens", description: "One source of truth for colour and type.", href: "/en/tag/design-system" },
        { title: "Headless CMS", description: "Editing that bakes to static HTML.", href: "/en/tag/cms" },
      ],
    };
  }
  return {
    headline: "Aktuelle Themen",
    intro: "Worüber ich gerade nachdenke und schreibe.",
    items: [
      { title: "Statisch ausliefern", description: "Astro + SSG für schnelle, wartungsarme Seiten.", href: "/tag/ssg" },
      { title: "Design-Tokens", description: "Eine Quelle der Wahrheit für Farbe und Typografie.", href: "/tag/design-system" },
      { title: "Headless-CMS", description: "Redaktion, die statisches HTML einbäckt.", href: "/tag/cms" },
    ],
  };
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
    viewCount: (SEEDS.indexOf(seed) + 1) * 137,
    authorId: DEMO_AUTHOR.id,
    author: DEMO_AUTHOR,
  } as unknown as BlogPost;
}
