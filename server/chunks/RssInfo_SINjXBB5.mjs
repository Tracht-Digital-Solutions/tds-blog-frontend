import { A as renderTemplate, N as addAttribute, V as createAstro, j as maybeRenderHead } from "./sequence_CbUbm3Cx.mjs";
import { t as createComponent } from "./compiler_aMwP8CK8.mjs";
//#region src/components/RssInfo.astro
createAstro("https://blog.tracht-digital.de");
var $$RssInfo = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$RssInfo;
	const { lang } = Astro.props;
	const FEED_PATH = lang === "en" ? "/en/rss.xml" : "/rss.xml";
	const FEED_URL = `https://blog.tracht-digital.de${FEED_PATH}`;
	const FEEDLY_URL = `https://feedly.com/i/subscription/feed/${FEED_URL}`;
	const t = lang === "de" ? {
		eyebrow: "Journal · RSS",
		heading: [
			"Per ",
			"RSS",
			" abonnieren"
		],
		lede: "RSS liefert dir neue Journal-Beiträge automatisch in dein Lese-Programm — ohne Newsletter, ohne Algorithmus, ohne Konto.",
		whatHead: "Was ist RSS?",
		whatBody: "RSS ist ein offenes Format, mit dem Webseiten ihre neuen Inhalte veröffentlichen. Du trägst die Feed-Adresse einmal in ein RSS-Programm (einen „Reader“) ein — neue Beiträge erscheinen dort dann von selbst, in der Reihenfolge, in der sie erscheinen, und vollständig in deiner Kontrolle.",
		feedHead: "Feed-Adresse",
		feedHint: "Kopiere diese Adresse und füge sie in deinem RSS-Programm unter „Feed hinzufügen“ ein:",
		copy: "Kopieren",
		copied: "Kopiert!",
		programsHead: "Empfohlene RSS-Programme",
		programsHint: "Kostenlose und bezahlte Reader für jedes Gerät — wähle eines aus und trage die Feed-Adresse oben ein.",
		feedlyCta: "Direkt in Feedly abonnieren",
		rawHead: "Lieber der rohe Feed?",
		rawBody: "Die Feed-Datei selbst liegt unter"
	} : {
		eyebrow: "Journal · RSS",
		heading: [
			"Subscribe via ",
			"RSS",
			""
		],
		lede: "RSS delivers new Journal posts straight to your reader app — no newsletter, no algorithm, no account.",
		whatHead: "What is RSS?",
		whatBody: "RSS is an open format that websites use to publish their new content. You add the feed address once to an RSS program (a “reader”) — new posts then show up there on their own, in order, and fully under your control.",
		feedHead: "Feed address",
		feedHint: "Copy this address and paste it into your RSS program under “Add feed”:",
		copy: "Copy",
		copied: "Copied!",
		programsHead: "Recommended RSS programs",
		programsHint: "Free and paid readers for every device — pick one and add the feed address above.",
		feedlyCta: "Subscribe in Feedly",
		rawHead: "Prefer the raw feed?",
		rawBody: "The feed file itself lives at"
	};
	const programs = [
		{
			name: "Feedly",
			href: "https://feedly.com",
			desc: lang === "de" ? "Web · iOS · Android" : "Web · iOS · Android"
		},
		{
			name: "Inoreader",
			href: "https://www.inoreader.com",
			desc: "Web · iOS · Android"
		},
		{
			name: "NetNewsWire",
			href: "https://netnewswire.com",
			desc: lang === "de" ? "macOS · iOS · quelloffen" : "macOS · iOS · open source"
		},
		{
			name: "Reeder",
			href: "https://reederapp.com",
			desc: "macOS · iOS"
		},
		{
			name: "Thunderbird",
			href: "https://www.thunderbird.net",
			desc: lang === "de" ? "Windows · macOS · Linux" : "Windows · macOS · Linux"
		},
		{
			name: "NewsBlur",
			href: "https://newsblur.com",
			desc: lang === "de" ? "Web · iOS · Android · quelloffen" : "Web · iOS · Android · open source"
		}
	];
	return renderTemplate`${maybeRenderHead($$result)}<section style="background: var(--color-surface-navy); color: #fff;"><div class="tds-shell py-14 md:py-20"><p class="eyebrow" style="color: var(--color-accent-pink);">${t.eyebrow}</p><h1 class="display page-title mt-3">${t.heading[0]}<span class="accent-italic">${t.heading[1]}</span>${t.heading[2]}</h1><p class="mt-4 max-w-prose" style="color: rgba(255,255,255,.75); line-height: 1.6;">${t.lede}</p></div></section><div class="tds-shell py-16 lg:py-20"><section class="mb-14" aria-labelledby="rss-what"><h2 id="rss-what" class="display text-2xl md:text-3xl mb-3">${t.whatHead}</h2><p class="marginalia max-w-prose">${t.whatBody}</p></section><section class="mb-14" aria-labelledby="rss-feed"><h2 id="rss-feed" class="display text-2xl md:text-3xl mb-3">${t.feedHead}</h2><p class="marginalia max-w-prose mb-4">${t.feedHint}</p><div class="flex flex-wrap items-stretch gap-px" style="border: 1px solid var(--color-soft); max-width: 36rem;"><code id="rss-feed-url" class="flex-1 min-w-0 px-4 py-3 text-sm truncate" style="font-family: var(--font-mono); background: var(--color-soft); color: var(--color-ink);">${FEED_URL}</code><button id="rss-copy" type="button"${addAttribute(FEED_URL, "data-copy")}${addAttribute(t.copy, "data-label-copy")}${addAttribute(t.copied, "data-label-copied")} class="px-4 py-3 text-sm font-semibold shrink-0" style="background: var(--color-surface-navy); color: #fff; cursor: pointer;">${t.copy}</button></div></section><section class="mb-14" aria-labelledby="rss-programs"><h2 id="rss-programs" class="display text-2xl md:text-3xl mb-2">${t.programsHead}</h2><p class="marginalia max-w-prose mb-6">${t.programsHint}</p><ul class="list-none p-0 m-0 tds-grid-auto tds-grid-roomy">${programs.map((p) => renderTemplate`<li class="list-none"><a${addAttribute(p.href, "href")} target="_blank" rel="noopener noreferrer" class="topic-card"><h3 class="topic-title">${p.name}</h3><p class="topic-desc">${p.desc}</p></a></li>`)}</ul><p class="mt-6"><a${addAttribute(FEEDLY_URL, "href")} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold no-underline" style="background: var(--color-accent); color: #fff;">${t.feedlyCta} →</a></p></section><section aria-labelledby="rss-raw"><h2 id="rss-raw" class="display text-xl md:text-2xl mb-2">${t.rawHead}</h2><p class="marginalia max-w-prose">${t.rawBody}${" "}<a${addAttribute(FEED_PATH, "href")} class="link-underline text-[var(--color-accent)]">${FEED_PATH}</a>.</p></section></div><script>
  (function () {
    var btn = document.getElementById("rss-copy");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy") || "";
      var done = btn.getAttribute("data-label-copied") || "Copied!";
      var idle = btn.getAttribute("data-label-copy") || "Copy";
      var flash = function () {
        btn.textContent = done;
        setTimeout(function () { btn.textContent = idle; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(flash).catch(flash);
      } else {
        flash();
      }
    });
  })();
<\/script>`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/RssInfo.astro", void 0);
//#endregion
export { $$RssInfo as t };
