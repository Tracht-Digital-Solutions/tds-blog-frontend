import { A as renderTemplate, D as renderSlot, F as createRenderInstruction, M as renderHead, N as addAttribute, P as defineScriptVars, T as Fragment$2, V as createAstro, j as maybeRenderHead, w as renderComponent, z as unescapeHTML } from "./sequence_CbUbm3Cx.mjs";
import { t as createComponent } from "./compiler_aMwP8CK8.mjs";
import { f as adsConfig, m as cookieBannerEnabled, u as getTaxonomy } from "./cache_CMM7wTu7.mjs";
import { n as siteConfig } from "./seo_C65aaSyf.mjs";
import { i as isExcluded } from "./sitemapExclusions_CHWN7KaI.mjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region node_modules/astro/dist/runtime/server/render/script.js
async function renderScript(result, id) {
	const inlined = result.inlinedScripts.get(id);
	let content = "";
	if (inlined != null) {
		if (inlined) content = `<script type="module">${inlined}<\/script>`;
	} else {
		const resolved = await result.resolve(id);
		content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`;
	}
	return createRenderInstruction({
		type: "script",
		id,
		content
	});
}
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/components/index.js
var SEMANTIC_CHIP_VARIANTS$1 = [
	"neutral",
	"success",
	"warning",
	"danger",
	"info"
];
var CATEGORICAL_CHIP_VARIANTS$1 = [
	"cat-violet",
	"cat-teal",
	"cat-amber",
	"cat-rose",
	"cat-cyan"
];
var CHIP_VARIANTS$1 = [...SEMANTIC_CHIP_VARIANTS$1, ...CATEGORICAL_CHIP_VARIANTS$1];
new Set(CHIP_VARIANTS$1);
var THEME_STORAGE_KEY$1 = "tds-theme";
var THEME_ATTRIBUTE$1 = "data-theme";
var THEME_CHANGE_EVENT = "tds:theme-change";
var DARK_QUERY = "(prefers-color-scheme: dark)";
var hasDocument = () => typeof document !== "undefined";
function systemTheme() {
	try {
		return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(DARK_QUERY).matches ? "dark" : "light";
	} catch {
		return "light";
	}
}
function resolveTheme(preference) {
	return preference === "system" ? systemTheme() : preference;
}
function applyThemePreference(preference, options = {}) {
	const theme = resolveTheme(preference);
	try {
		if (preference === "system") localStorage.removeItem(THEME_STORAGE_KEY$1);
		else localStorage.setItem(THEME_STORAGE_KEY$1, preference);
	} catch {}
	if (hasDocument()) document.documentElement.setAttribute(THEME_ATTRIBUTE$1, theme);
	if (options.announce !== false && typeof window !== "undefined") try {
		const detail = {
			preference,
			theme
		};
		window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail }));
	} catch {}
	return theme;
}
var cssEase = {
	out: `cubic-bezier(${[
		.2,
		.8,
		.2,
		1
	].join(", ")})`,
	inOut: `cubic-bezier(${[
		.4,
		0,
		.2,
		1
	].join(", ")})`
};
function ThemeToggle({ labelToDark = "Auf Dunkel umschalten", labelToLight = "Auf Hell umschalten" } = {}) {
	const [theme, setTheme] = useState("light");
	const [mounted, setMounted] = useState(false);
	const buttonRef = useRef(null);
	useEffect(() => {
		const current = document.documentElement.getAttribute(THEME_ATTRIBUTE$1);
		setTheme(current === "dark" ? "dark" : "light");
		setMounted(true);
	}, []);
	const flip = () => {
		const next = theme === "dark" ? "light" : "dark";
		const apply = () => {
			setTheme(next);
			applyThemePreference(next);
		};
		const startViewTransition = document.startViewTransition;
		const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (!startViewTransition || prefersReduced) {
			apply();
			return;
		}
		if (window.matchMedia("(pointer: coarse)").matches) {
			startViewTransition.call(document, () => {
				flushSync(apply);
			}).ready.then(() => {
				document.documentElement.animate({
					opacity: [0, 1],
					transform: ["scale(1.02)", "scale(1)"]
				}, {
					duration: 320,
					easing: cssEase.out,
					pseudoElement: "::view-transition-new(root)"
				});
			});
			return;
		}
		const rect = buttonRef.current?.getBoundingClientRect();
		const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
		const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
		const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
		startViewTransition.call(document, () => {
			flushSync(apply);
		}).ready.then(() => {
			document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] }, {
				duration: 480,
				easing: cssEase.inOut,
				pseudoElement: "::view-transition-new(root)"
			});
		});
	};
	const label = mounted && theme === "dark" ? labelToLight : labelToDark;
	return /* @__PURE__ */ jsxs("button", {
		ref: buttonRef,
		type: "button",
		onClick: flip,
		"aria-label": label,
		title: label,
		className: "tds-theme-toggle inline-flex items-center justify-center w-9 h-9 rounded-full text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer",
		children: [/* @__PURE__ */ jsx("svg", {
			"aria-hidden": "true",
			width: "18",
			height: "18",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.75",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			className: mounted && theme === "dark" ? "hidden" : "block",
			children: /* @__PURE__ */ jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" })
		}), /* @__PURE__ */ jsxs("svg", {
			"aria-hidden": "true",
			width: "18",
			height: "18",
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: "1.75",
			strokeLinecap: "round",
			strokeLinejoin: "round",
			className: mounted && theme === "dark" ? "block" : "hidden",
			children: [
				/* @__PURE__ */ jsx("circle", {
					cx: "12",
					cy: "12",
					r: "4"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "12",
					y1: "2",
					x2: "12",
					y2: "5"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "12",
					y1: "19",
					x2: "12",
					y2: "22"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "2",
					y1: "12",
					x2: "5",
					y2: "12"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "19",
					y1: "12",
					x2: "22",
					y2: "12"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "4.93",
					y1: "4.93",
					x2: "6.99",
					y2: "6.99"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "17.01",
					y1: "17.01",
					x2: "19.07",
					y2: "19.07"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "4.93",
					y1: "19.07",
					x2: "6.99",
					y2: "17.01"
				}),
				/* @__PURE__ */ jsx("line", {
					x1: "17.01",
					y1: "6.99",
					x2: "19.07",
					y2: "4.93"
				})
			]
		})]
	});
}
function initialsOf(name) {
	const words = name.trim().split(/\s+/).filter(Boolean);
	if (words.length === 0) return "?";
	const head = (value) => Array.from(value ?? "")[0] ?? "";
	return (head(words[0]) + (words.length > 1 ? head(words[words.length - 1]) : "")).toUpperCase() || "?";
}
function hash(value) {
	let h = 5381;
	for (let i = 0; i < value.length; i += 1) h = (h << 5) + h + value.charCodeAt(i) | 0;
	return Math.abs(h);
}
function Avatar({ name, src, seed, size = "md", decorative = false, className }) {
	const [failed, setFailed] = useState(false);
	const label = (name ?? "").trim();
	const classes = ["tds-avatar"];
	if (size === "sm") classes.push("tds-avatar--sm");
	else if (size === "lg") classes.push("tds-avatar--lg");
	if (className) classes.push(className);
	const showImage = Boolean(src) && !failed;
	const variant = CATEGORICAL_CHIP_VARIANTS$1[hash(String(seed ?? label ?? "")) % CATEGORICAL_CHIP_VARIANTS$1.length];
	const a11y = decorative ? { "aria-hidden": true } : {
		role: "img",
		"aria-label": label || "Profilbild"
	};
	if (showImage) return /* @__PURE__ */ jsx("img", {
		...a11y,
		alt: decorative ? "" : label,
		src: src ?? void 0,
		className: classes.join(" "),
		onError: () => setFailed(true),
		loading: "lazy",
		decoding: "async"
	});
	return /* @__PURE__ */ jsx("span", {
		...a11y,
		className: classes.join(" "),
		"data-avatar-variant": variant,
		children: /* @__PURE__ */ jsx("span", {
			"aria-hidden": "true",
			children: initialsOf(label)
		})
	});
}
function Spinner({ size = "md", tone = "current", label = "Wird geladen", className }) {
	const classes = ["tds-spinner"];
	if (size === "sm") classes.push("tds-spinner--sm");
	else if (size === "lg") classes.push("tds-spinner--lg");
	if (tone === "primary") classes.push("tds-spinner--primary");
	if (className) classes.push(className);
	return /* @__PURE__ */ jsx("span", {
		className: classes.join(" "),
		role: "status",
		"aria-label": label
	});
}
var translations = {
	de: {
		nav: {
			about: "Über mich",
			services: "Leistungen",
			tech: "Tech",
			portfolio: "Portfolio",
			process: "Prozess",
			blog: "Journal",
			contact: "Kontakt",
			cta: "Unverbindlich anfragen",
			pricing: "Preise"
		},
		hero: {
			availability: "Verfügbar für Projekte · Q3 2026",
			location: "Schwarzenbek · Hamburg",
			headline: "Digitalisierung, die",
			headlineAccent: "Arbeit",
			headlineSuffix: "abnimmt.",
			sub: "Websites, Webshops und Werkzeuge für kleine Betriebe. Ich schaue, wo es hakt – und baue, was hilft. Aus Schwarzenbek bei Hamburg.",
			cta1: "Unverbindlich anfragen",
			cta2: "Leistungen ansehen",
			scrollHint: "Scrollen"
		},
		about: {
			label: "— 01 / Über mich",
			headline: "Hi, ich bin",
			headlineAccent: "Julian.",
			lead: "Ich bin freier Entwickler in Schwarzenbek bei Hamburg. Ich arbeite für Selbstständige und kleine Betriebe ohne eigene IT.",
			p1: "Website, Webshop, kleines Programm oder ein Ablauf, der einfacher werden soll: Ich höre zu, sortiere das Vorhaben und setze es um. Ein Ansprechpartner, von Anfang bis Ende.",
			p2: "Standardsoftware zwingt Sie, sich anzupassen. Ein gutes Werkzeug macht es andersherum. Manchmal ist die ehrliche Antwort: Es lohnt sich nicht.",
			portraitPlaceholder: "Hier könnte ein Schwarz-Weiß-Portrait von Julian stehen — schräg sitzend am Schreibtisch, leicht zur Kamera gewandt, naturnahes Licht.",
			stat1Value: "5+",
			stat1Label: "Jahre Erfahrung",
			stat2Value: "5",
			stat2Label: "Leistungsbereiche",
			stat3Value: "1:1",
			stat3Label: "Persönliche Betreuung"
		},
		services: {
			label: "— 02 / Leistungen",
			headline: "Was ich für Sie",
			headlineAccent: "leiste.",
			items: [
				{
					number: "01",
					title: "Digitalisierung für Unternehmen",
					description: "Listen von Hand, Zahlen aus drei Quellen, immer wieder abtippen. Ich nehme mir einen konkreten Ablauf vor und mache ihn einfacher – nicht gleich den ganzen Betrieb.",
					tags: [
						"Abläufe",
						"Auswertungen",
						"Automatisierung",
						"Schnittstellen"
					]
				},
				{
					number: "02",
					title: "Digitale Konzepte",
					description: "Sie haben eine Idee, aber noch keinen Plan. Ich mache daraus ein verständliches Konzept: was gebraucht wird, welcher Weg sinnvoll ist, was er kostet.",
					tags: [
						"Anforderungen",
						"Klickbarer Entwurf",
						"Aufwand",
						"Fahrplan"
					]
				},
				{
					number: "03",
					title: "Auftragsentwicklung",
					description: "Nicht jede Aufgabe braucht ein großes Programm. Oft reicht das Werkzeug, das zu Ihrer Arbeit passt: eine Excel-Vorlage, eine kleine Anwendung, eine Auswertung.",
					tags: [
						"Excel-Vorlage",
						"Kleine Anwendung",
						"Auswertung",
						"Datenübernahme"
					]
				},
				{
					number: "04",
					title: "Webauftritt",
					description: "Veraltet, unklar oder noch gar nicht da? Dann springen Interessenten ab, bevor sie anfragen. Ich baue neu, bringe Bestehendes auf Stand – und pflege es weiter.",
					tags: [
						"Neue Website",
						"Überarbeitung",
						"Pflege",
						"Auffindbarkeit"
					]
				},
				{
					number: "05",
					title: "Webshop",
					description: "Ihr Laden läuft, jetzt soll es online weitergehen. Ich plane, baue und betreue den Shop – auf Wunsch so, dass Artikel und Bestand vom Handy aus laufen.",
					tags: [
						"Onlineverkauf",
						"Produktpflege",
						"Bestand per Handy",
						"Betreuung"
					]
				}
			]
		},
		tech: {
			label: "Tech Stack",
			headline: "Womit ich",
			headlineAccent: "arbeite.",
			body: "Werkzeuge, die sich bewährt haben – keine Glaubensfrage, sondern das Richtige fürs Problem. Sprachen wechseln, gute Architektur bleibt."
		},
		portfolio: {
			label: "— 03 / Portfolio",
			headline: "Ausgewählte",
			headlineAccent: "Projekte.",
			comingSoon: "Demnächst",
			placeholderLabel: "Platzhalter",
			items: [
				{
					number: "01",
					badge: "Web-App",
					title: "Mittelstands-Plattform",
					description: "Eine maßgeschneiderte Webanwendung für einen mittelständischen Kunden – individuell entwickelt, skalierbar gebaut.",
					stack: [
						"Angular",
						"Node.js",
						"SQL"
					],
					imagePlaceholder: "Screenshot des Dashboards mit zentraler KPI-Übersicht, links Sidebar-Navigation, rechts ein Detailpanel."
				},
				{
					number: "02",
					badge: "Digitalisierung",
					title: "Prozess-Automatisierung",
					description: "Automatisierung manueller Geschäftsprozesse durch intelligente Workflows und Datenpipelines.",
					stack: [
						"Python",
						"KNIME",
						"SQL"
					],
					imagePlaceholder: "Workflow-Diagramm: KNIME-Knoten, die Daten aus drei Quellen zusammenführen, validieren und in eine SQL-Tabelle schreiben."
				},
				{
					number: "03",
					badge: "Web-Auftritt",
					title: "Markenpräsenz Mittelstand",
					description: "Professioneller Webauftritt für ein etabliertes Unternehmen – performant, barrierefrei, individuell.",
					stack: ["WordPress", "TypeScript"],
					imagePlaceholder: "Hero-Mockup der Kunden-Website auf Desktop und Mobile – ruhige Typografie, großes Schlüsselbild."
				},
				{
					number: "04",
					badge: "App",
					title: "Interne Business-App",
					description: "Desktop-Applikation zur internen Prozessverwaltung – intuitiv bedienbar, wartungsfreundlich dokumentiert.",
					stack: [
						"C#",
						"SQL",
						"Vue"
					],
					imagePlaceholder: "Screenshot der Desktop-App: Listenansicht der Aufträge mit Filterleiste oben und Detail-Panel rechts."
				}
			]
		},
		process: {
			label: "— 04 / Vorgehen",
			headline: "Wie ich",
			headlineAccent: "arbeite.",
			body: "Kein starrer Ablauf. Je nach Vorhaben verschiebt sich das Gewicht. Die vier Schritte sind der übliche Rahmen, kein Korsett.",
			steps: [
				{
					number: "01",
					title: "Zuhören",
					duration: "Zum Einstieg",
					description: "Sie schildern mir, wo es hakt. Ich frage nach – und sage ehrlich, ob sich eine Umsetzung lohnt."
				},
				{
					number: "02",
					title: "Konzept",
					duration: "Je nach Umfang",
					description: "Was wird gebraucht, welcher Weg ist sinnvoll, was kostet er? Die Grundlage steht, bevor Budget fließt."
				},
				{
					number: "03",
					title: "Umsetzung",
					duration: "Nach Absprache",
					description: "Ich baue es und zeige Ihnen Zwischenstände. Nachsteuern ist unterwegs günstig, hinterher teuer."
				},
				{
					number: "04",
					title: "Betreuung",
					duration: "Auf Wunsch",
					description: "Übergabe, Einweisung, auf Wunsch Pflege und Anpassungen. Ansprechpartner bleibe ich in jedem Fall."
				}
			]
		},
		blog: {
			label: "— 05 / Journal",
			headline: "Gedanken &",
			headlineAccent: "Artikel.",
			readMore: "Weiterlesen",
			allPosts: "Alle Artikel",
			placeholderLabel: "Platzhalter",
			posts: [
				{
					category: "Digitalisierung",
					title: "Digitalisierung fängt nicht beim Großprojekt an.",
					excerpt: "Sie fängt bei dem einen Ablauf an, der Sie jede Woche Stunden kostet – und den außer Ihnen niemand sieht.",
					date: "2026-08-04",
					slug: "digitalisierung-faengt-klein-an",
					imagePlaceholder: "Handgeschriebene Liste auf einem Klemmbrett neben einem Laptop – warmes Morgenlicht, Werkstatt im Hintergrund."
				},
				{
					category: "Webshop",
					title: "Lohnt sich ein Webshop für mein Ladengeschäft?",
					excerpt: "Nicht für jedes Sortiment. Vier Fragen, die die Antwort meist schon vorwegnehmen.",
					date: "2026-07-21",
					slug: "lohnt-sich-ein-webshop",
					imagePlaceholder: "Ladentheke von oben – Produkte, ein Notizblock und ein Smartphone mit offener Produktliste."
				},
				{
					category: "Werkzeuge",
					title: "Excel-Tabelle oder eigenes Werkzeug?",
					excerpt: "Eine Tabelle ist erstaunlich weit tragfähig. Es gibt aber drei Punkte, an denen sie zuverlässig kippt.",
					date: "2026-07-07",
					slug: "excel-oder-eigenes-werkzeug",
					imagePlaceholder: "Bildschirm mit einer weit gescrollten Tabelle, daneben ein Notizzettel mit Formelfragment."
				}
			]
		},
		contact: {
			label: "— 06 / Kontakt",
			headline: "Lassen Sie uns",
			headlineAccent: "reden.",
			sub: "Schreiben Sie mir in zwei Sätzen, wo es hakt. Ich antworte in der Regel innerhalb von 24 Stunden.",
			form: {
				name: "Name",
				namePlaceholder: "Hanna Schmidt",
				email: "E-Mail",
				emailPlaceholder: "hanna@manufaktur.de",
				company: "Unternehmen (optional)",
				companyPlaceholder: "Schmidt Manufaktur",
				message: "Nachricht",
				messagePlaceholder: "Wir pflegen unsere Preise noch in drei Listen gleichzeitig — das kostet jede Woche einen halben Tag.",
				consent: "Ich willige in die Verarbeitung meiner Daten gemäß der",
				consentLink: "Datenschutzerklärung",
				consentSuffix: "ein.",
				submit: "Nachricht senden",
				submitting: "Wird gesendet …",
				successTitle: "Nachricht erhalten!",
				successMessage: "Danke für Ihre Nachricht. Ich melde mich in der Regel innerhalb von 24 Stunden.",
				errorMessage: "Etwas ist schiefgelaufen. Bitte versuchen Sie es noch einmal."
			},
			info: {
				emailLabel: "E-Mail",
				phoneLabel: "Handy",
				locationLabel: "Standort",
				socialLabel: "Social",
				email: "kontakt@tracht-digital.de",
				phone: "+49 178 822 4022",
				location: "Schwarzenbek · nähe Hamburg"
			}
		},
		pricing: {
			label: "— Preise",
			headline: "Transparente",
			headlineAccent: "Stundensätze.",
			sub: "Klare Preise, keine Pauschalpakete. Stundengenau abgerechnet, ehrlich geschätzt, mit einer Obergrenze, auf die Sie sich verlassen können.",
			teaserLabel: "Preise",
			teaserHeadline: "Klare Sätze,",
			teaserHeadlineAccent: "keine Pauschalen.",
			teaserSub: "Ab 95 € pro Stunde – stundengenau abgerechnet, ohne versteckte Kosten.",
			teaserCta: "Alle Stundensätze ansehen",
			teaserFromLabel: "ab",
			hourSuffix: "/ Stunde",
			includesLabel: "Beinhaltet:",
			items: [
				{
					title: "Beratung & Konzeption",
					rate: 120,
					description: "Strategische Begleitung, Architektur-Workshops, technische Reviews. Am Ende steht ein verständliches Konzept – nicht nur Folien.",
					includes: [
						"Aufnahme und Sortierung Ihrer Anforderungen",
						"Architektur- & Anforderungs-Workshops",
						"Code- & Stack-Reviews mit dokumentierten Empfehlungen",
						"Schriftliche Konzepte und Entscheidungsgrundlagen"
					],
					highlight: false
				},
				{
					title: "Web- & App-Entwicklung",
					rate: 105,
					description: "Frontend, Backend, mobile und Desktop-Apps. Sauber gebaut, getestet, dokumentiert – auch in zwei Jahren noch wartbar.",
					includes: [
						"Komponentenentwicklung (React, Vue, Angular)",
						"API- und Backend-Entwicklung (Node.js, C#, SQL)",
						"Mobile- und Desktop-Apps",
						"Tests, CI/CD und Dokumentation inklusive"
					],
					highlight: true
				},
				{
					title: "Digitalisierung & Automation",
					rate: 105,
					description: "Manuelle Abläufe durch Workflows, Datenpipelines und Integrationen ablösen. Konkrete Umsetzung, kein PowerPoint.",
					includes: [
						"Prozessanalyse vor Ort oder remote",
						"Workflow-Automation (Python, KNIME, n8n)",
						"Datenpipelines, ETL und SQL-Reporting",
						"Integration bestehender Tools und Systeme"
					],
					highlight: false
				},
				{
					title: "Wartung & Support",
					rate: 85,
					description: "Bestehende Systeme pflegen, Updates einspielen, Fehler beheben. Reaktionszeit nach Vereinbarung.",
					includes: [
						"Bug-Fixes und Hotfixes",
						"Dependency- und Sicherheits-Updates",
						"Monitoring und Performance-Optimierung",
						"Auf Wunsch monatliches Retainer-Modell"
					],
					highlight: false
				},
				{
					title: "Workshops & Schulungen",
					rate: 135,
					description: "Wissen weitergeben statt zurückhalten. Workshops für Ihr Team – von TypeScript-Basics bis Architektur.",
					includes: [
						"Inhouse- oder Remote-Workshops",
						"Maßgeschneiderte Schulungsunterlagen",
						"Hands-on-Übungen mit Ihrem echten Code",
						"Nachgespräch und Aufzeichnung inklusive"
					],
					highlight: false
				}
			],
			notesTitle: "Gut zu wissen",
			notes: [
				"Alle Preise zzgl. gesetzlicher Mehrwertsteuer (19 %).",
				"Tagessatz auf Anfrage – Rabatt ab 5 Tagen pro Monat verfügbar.",
				"Festpreis möglich, wenn der Umfang vorab klar ist.",
				"Reisekosten werden separat abgerechnet."
			],
			ctaTitle: "Klingt passend?",
			ctaSub: "Schreiben Sie mir kurz, worum es geht. Ich sage Ihnen ehrlich, ob und wie ich helfen kann.",
			ctaButton: "Unverbindlich anfragen",
			back: "Zurück"
		},
		consulting: {
			label: "— Beratung",
			headline: "Erst zuhören,",
			headlineAccent: "dann bauen.",
			body: "Vielleicht haben Sie ein klares Vorhaben, vielleicht nur das Gefühl, dass etwas einfacher laufen müsste. Beides ist ein guter Anfang.",
			primaryCta: "Unverbindlich anfragen",
			secondaryCta: "Leistungen ansehen"
		},
		footer: {
			slogan: "Digitale Lösungen, die wirklich passen.",
			tagline: "Persönlich, passgenau, aus einer Hand — aus Schwarzenbek bei Hamburg.",
			nav: "Navigation",
			contactTitle: "Kontakt",
			copyright: "© 2026 Tracht Digital Solutions. Alle Rechte vorbehalten.",
			impressum: "Impressum",
			datenschutz: "Datenschutz",
			pricing: "Preise"
		},
		errors: {
			name: "Bitte geben Sie Ihren Namen an.",
			email: "Bitte geben Sie eine gültige E-Mail-Adresse an.",
			message: "Mindestens 20 Zeichen, bitte.",
			consent: "Zustimmung erforderlich."
		},
		cookieNotice: {
			label: "Hinweis zu Cookies und Datenschutz",
			siteText: "Diese Website verwendet keine Tracking-Cookies. Es werden lediglich technisch notwendige Einstellungen (z. B. Ihr Farbschema) lokal in Ihrem Browser gespeichert.",
			panelText: "Dieser Bereich verwendet ausschließlich ein technisch notwendiges Cookie für die sichere Anmeldung (Session-Cookie). Es findet kein Tracking statt.",
			privacy: "Mehr in der Datenschutzerklärung.",
			accept: "Verstanden",
			consentText: "Wir zeigen auf diesem Blog Werbung von Google AdSense. Dafür werden – nur mit Ihrer Einwilligung – Cookies und ähnliche Technologien zu Werbezwecken gesetzt. Ihre Wahl ist freiwillig und jederzeit änderbar.",
			consentAccept: "Akzeptieren",
			consentDecline: "Ablehnen"
		},
		toast: { dismiss: "Schließen" }
	},
	en: {
		nav: {
			about: "About",
			services: "Services",
			tech: "Tech",
			portfolio: "Portfolio",
			process: "Process",
			blog: "Journal",
			contact: "Contact",
			cta: "Get in touch",
			pricing: "Pricing"
		},
		hero: {
			availability: "Available for projects · Q3 2026",
			location: "Schwarzenbek · Hamburg",
			headline: "Digitalization that takes",
			headlineAccent: "work",
			headlineSuffix: "off your hands.",
			sub: "Websites, online shops and tools for small businesses. I look at where things stick – and build what helps. From Schwarzenbek near Hamburg.",
			cta1: "Get in touch",
			cta2: "See services",
			scrollHint: "Scroll"
		},
		about: {
			label: "— 01 / About",
			headline: "Hi, I'm",
			headlineAccent: "Julian.",
			lead: "I'm a freelance developer in Schwarzenbek near Hamburg. I work with freelancers and small businesses that have no IT department.",
			p1: "Website, online shop, a small program or a workflow that should get simpler: I listen, sort out the plan and build it. One contact, start to finish.",
			p2: "Off-the-shelf software makes you adapt to it. A good tool works the other way round. Sometimes the honest answer is: it isn't worth it.",
			portraitPlaceholder: "A black-and-white portrait of Julian — seated at an angle at his desk, slightly turned toward the camera, soft natural light.",
			stat1Value: "5+",
			stat1Label: "Years of experience",
			stat2Value: "5",
			stat2Label: "Areas of work",
			stat3Value: "1:1",
			stat3Label: "Personal support"
		},
		services: {
			label: "— 02 / Services",
			headline: "What I",
			headlineAccent: "deliver.",
			items: [
				{
					number: "01",
					title: "Digitalization for Businesses",
					description: "Lists kept by hand, figures from three places, the same retyping every day. I take one concrete workflow and make it simpler – not the whole business at once.",
					tags: [
						"Workflows",
						"Reporting",
						"Automation",
						"Integrations"
					]
				},
				{
					number: "02",
					title: "Digital Concepts",
					description: "You have an idea but no plan yet. I turn it into a concept you can read: what is needed, which route makes sense, what it costs.",
					tags: [
						"Requirements",
						"Clickable draft",
						"Effort",
						"Roadmap"
					]
				},
				{
					number: "03",
					title: "Custom Development",
					description: "Not every task needs a big program. Often it just needs the tool that fits your work: a spreadsheet template, a small application, a report.",
					tags: [
						"Spreadsheet template",
						"Small application",
						"Reporting",
						"Data import"
					]
				},
				{
					number: "04",
					title: "Web Presence",
					description: "Out of date, unclear or not there at all? Then people leave before they get in touch. I build new, bring existing sites up to standard – and maintain them.",
					tags: [
						"New website",
						"Rework",
						"Maintenance",
						"Findability"
					]
				},
				{
					number: "05",
					title: "Online Shop",
					description: "Your shop runs locally, now it should run online too. I plan, build and look after it – set up so items and stock can be managed from a phone.",
					tags: [
						"Online sales",
						"Product upkeep",
						"Stock by phone",
						"Support"
					]
				}
			]
		},
		tech: {
			label: "Tech Stack",
			headline: "What I",
			headlineAccent: "work with.",
			body: "Tools that have proven themselves – not a matter of faith, just the right thing for the problem. Languages change; good architecture stays."
		},
		portfolio: {
			label: "— 03 / Portfolio",
			headline: "Selected",
			headlineAccent: "projects.",
			comingSoon: "Coming soon",
			placeholderLabel: "Placeholder",
			items: [
				{
					number: "01",
					badge: "Web App",
					title: "Mid-market platform",
					description: "A custom-built web application for a mid-market client – individually developed, built to scale.",
					stack: [
						"Angular",
						"Node.js",
						"SQL"
					],
					imagePlaceholder: "Dashboard screenshot with central KPI overview, sidebar navigation on the left, detail panel on the right."
				},
				{
					number: "02",
					badge: "Digitalization",
					title: "Process automation",
					description: "Automation of manual business processes through intelligent workflows and data pipelines.",
					stack: [
						"Python",
						"KNIME",
						"SQL"
					],
					imagePlaceholder: "Workflow diagram: KNIME nodes pulling data from three sources, validating it, writing into a SQL table."
				},
				{
					number: "03",
					badge: "Web presence",
					title: "Brand presence",
					description: "Professional web presence for an established company – performant, accessible, individually crafted.",
					stack: ["WordPress", "TypeScript"],
					imagePlaceholder: "Hero mockup of the client site on desktop and mobile — quiet typography, large keystone image."
				},
				{
					number: "04",
					badge: "App",
					title: "Internal business app",
					description: "Desktop application for internal process management – intuitively usable, cleanly documented.",
					stack: [
						"C#",
						"SQL",
						"Vue"
					],
					imagePlaceholder: "Desktop app screenshot: list view of orders with filter bar at the top and detail panel on the right."
				}
			]
		},
		process: {
			label: "— 04 / Process",
			headline: "How I",
			headlineAccent: "work.",
			body: "No rigid process. The weight shifts with the job. The four steps below are the usual frame, not a corset.",
			steps: [
				{
					number: "01",
					title: "Listening",
					duration: "To begin with",
					description: "You tell me where things get stuck. I keep asking – and say honestly whether building something is worth it."
				},
				{
					number: "02",
					title: "Concept",
					duration: "Depends on scope",
					description: "What is needed, which route makes sense, what does it cost? The groundwork is there before any budget moves."
				},
				{
					number: "03",
					title: "Delivery",
					duration: "As agreed",
					description: "I build it and show you where it stands. Changing course is cheap along the way and expensive afterwards."
				},
				{
					number: "04",
					title: "Support",
					duration: "If you want it",
					description: "Handover, a walkthrough, and maintenance if you want it. Either way I stay your point of contact."
				}
			]
		},
		blog: {
			label: "— 05 / Journal",
			headline: "Thoughts &",
			headlineAccent: "articles.",
			readMore: "Read more",
			allPosts: "All articles",
			placeholderLabel: "Placeholder",
			posts: [
				{
					category: "Digitalization",
					title: "Digitalization doesn't start with a big project.",
					excerpt: "It starts with the one routine that costs you hours every week – the one nobody but you can see.",
					date: "2026-08-04",
					slug: "digitalisierung-faengt-klein-an",
					imagePlaceholder: "A handwritten list on a clipboard beside a laptop — warm morning light, workshop in the background."
				},
				{
					category: "Online shop",
					title: "Is an online shop worth it for my local business?",
					excerpt: "Not for every range of products. Four questions that usually answer it for you.",
					date: "2026-07-21",
					slug: "lohnt-sich-ein-webshop",
					imagePlaceholder: "A shop counter from above — products, a notepad and a phone showing an open product list."
				},
				{
					category: "Tools",
					title: "Spreadsheet or a tool of your own?",
					excerpt: "A spreadsheet carries you surprisingly far. There are three points, though, where it reliably tips over.",
					date: "2026-07-07",
					slug: "excel-oder-eigenes-werkzeug",
					imagePlaceholder: "A screen showing a spreadsheet scrolled far down, next to a sticky note with a fragment of a formula."
				}
			]
		},
		contact: {
			label: "— 06 / Contact",
			headline: "Let's",
			headlineAccent: "talk.",
			sub: "Tell me in two sentences where things are getting stuck. I usually respond within 24 hours.",
			form: {
				name: "Name",
				namePlaceholder: "Alex Marlow",
				email: "Email",
				emailPlaceholder: "alex@marlow.studio",
				company: "Company (optional)",
				companyPlaceholder: "Marlow Studios",
				message: "Message",
				messagePlaceholder: "We still keep our prices in three separate lists — it costs us half a day every week.",
				consent: "I consent to the processing of my data in accordance with the",
				consentLink: "Privacy Policy",
				consentSuffix: ".",
				submit: "Send message",
				submitting: "Sending …",
				successTitle: "Message received!",
				successMessage: "Thank you for your message. I'll get back to you within 24 hours.",
				errorMessage: "Something went wrong. Please try again."
			},
			info: {
				emailLabel: "Email",
				phoneLabel: "Mobile",
				locationLabel: "Location",
				socialLabel: "Social",
				email: "contact@tracht-digital.de",
				phone: "+49 178 822 4022",
				location: "Schwarzenbek · near Hamburg"
			}
		},
		pricing: {
			label: "— Pricing",
			headline: "Transparent",
			headlineAccent: "hourly rates.",
			sub: "Clear pricing, no opaque packages. Billed by the actual hour, honestly estimated, with a ceiling you can rely on.",
			teaserLabel: "Pricing",
			teaserHeadline: "Clear rates,",
			teaserHeadlineAccent: "no packages.",
			teaserSub: "From €95 per hour – billed by the actual hour, no hidden fees.",
			teaserCta: "See all hourly rates",
			teaserFromLabel: "from",
			hourSuffix: "/ hour",
			includesLabel: "Included:",
			items: [
				{
					title: "Consulting & Strategy",
					rate: 120,
					description: "Strategic guidance, architecture workshops, technical reviews. You end up with a clear written concept — not just slides.",
					includes: [
						"Capturing and sorting your requirements",
						"Architecture and requirements workshops",
						"Code and stack reviews with documented recommendations",
						"Written concepts and decision-making input"
					],
					highlight: false
				},
				{
					title: "Web & App Development",
					rate: 105,
					description: "Frontend, backend, mobile and desktop apps. Cleanly built, tested, documented – still maintainable in two years.",
					includes: [
						"Component development (React, Vue, Angular)",
						"API and backend development (Node.js, C#, SQL)",
						"Mobile and desktop apps",
						"Tests, CI/CD and documentation included"
					],
					highlight: true
				},
				{
					title: "Digitalization & Automation",
					rate: 105,
					description: "Replacing manual processes with workflows, data pipelines and integrations. Concrete work, no PowerPoint.",
					includes: [
						"On-site or remote process analysis",
						"Workflow automation (Python, KNIME, n8n)",
						"Data pipelines, ETL and SQL reporting",
						"Integration of existing tools and systems"
					],
					highlight: false
				},
				{
					title: "Maintenance & Support",
					rate: 85,
					description: "Maintaining existing systems, rolling out updates, fixing bugs. Response times by agreement.",
					includes: [
						"Bug fixes and hotfixes",
						"Dependency and security updates",
						"Monitoring and performance optimization",
						"Optional monthly retainer model"
					],
					highlight: false
				},
				{
					title: "Workshops & Training",
					rate: 135,
					description: "Sharing knowledge instead of hoarding it. Workshops for your team – from TypeScript basics to architecture.",
					includes: [
						"On-site or remote workshops",
						"Tailored training materials",
						"Hands-on exercises with your real code",
						"Follow-up call and recording included"
					],
					highlight: false
				}
			],
			notesTitle: "Good to know",
			notes: [
				"All prices exclude German VAT (19 %).",
				"Day rate available on request — discount for 5+ days per month.",
				"Fixed price possible when the scope is clear up front.",
				"Travel costs are billed separately."
			],
			ctaTitle: "Sounds like a fit?",
			ctaSub: "Tell me briefly what it's about. I'll tell you honestly whether and how I can help.",
			ctaButton: "Get in touch",
			back: "Back"
		},
		consulting: {
			label: "— Consulting",
			headline: "Listen first,",
			headlineAccent: "build after.",
			body: "Maybe you have a clear plan, maybe just a feeling that something ought to be simpler. Either is a good place to start.",
			primaryCta: "Get in touch",
			secondaryCta: "See services"
		},
		footer: {
			slogan: "Digital solutions that truly fit.",
			tagline: "Personal, tailored, all from one source — from Schwarzenbek near Hamburg.",
			nav: "Navigation",
			contactTitle: "Contact",
			copyright: "© 2026 Tracht Digital Solutions. All rights reserved.",
			impressum: "Legal Notice",
			datenschutz: "Privacy Policy",
			pricing: "Pricing"
		},
		errors: {
			name: "Please enter your name.",
			email: "Please enter a valid email address.",
			message: "At least 20 characters, please.",
			consent: "Consent required."
		},
		cookieNotice: {
			label: "Cookie and privacy notice",
			siteText: "This website does not use tracking cookies. Only technically necessary preferences (e.g. your colour scheme) are stored locally in your browser.",
			panelText: "This area only uses one technically necessary cookie for secure sign-in (session cookie). No tracking takes place.",
			privacy: "More in the privacy policy.",
			accept: "Got it",
			consentText: "This blog shows advertising from Google AdSense. With your consent — and only then — cookies and similar technologies are set for advertising. Your choice is free and can be changed at any time.",
			consentAccept: "Accept",
			consentDecline: "Decline"
		},
		toast: { dismiss: "Dismiss" }
	}
};
var DEFAULT_STORAGE_KEY = "tds-cookie-notice";
var DEFAULT_PRIVACY_URL = "https://tracht-digital.de/legal/datenschutz";
var AD_CONSENT_KEY = "tds-ad-consent";
var AD_CONSENT_EVENT = "tds-ad-consent";
function getAdConsent() {
	if (typeof window === "undefined") return null;
	try {
		const v = window.localStorage.getItem(AD_CONSENT_KEY);
		return v === "granted" || v === "denied" ? v : null;
	} catch {
		return null;
	}
}
function setAdConsent(value) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(AD_CONSENT_KEY, value);
	} catch {}
	try {
		window.dispatchEvent(new CustomEvent(AD_CONSENT_EVENT, { detail: value }));
	} catch {}
}
function CookieNotice({ lang = "de", variant = "site", consent = false, privacyUrl = DEFAULT_PRIVACY_URL, storageKey = DEFAULT_STORAGE_KEY } = {}) {
	const [visible, setVisible] = useState(false);
	const ref = useRef(null);
	useEffect(() => {
		try {
			if (consent) {
				if (getAdConsent() !== null) return;
			} else if (localStorage.getItem(storageKey) === "1") return;
		} catch {}
		setVisible(true);
	}, [consent, storageKey]);
	useEffect(() => {
		const el = ref.current;
		if (!visible || !el || typeof window === "undefined") return;
		const root = document.documentElement;
		const publish = () => {
			root.style.setProperty("--tds-bottom-lane", `${Math.ceil(el.getBoundingClientRect().height)}px`);
		};
		publish();
		const ro = typeof ResizeObserver === "function" ? new ResizeObserver(publish) : null;
		ro?.observe(el);
		window.addEventListener("resize", publish);
		return () => {
			ro?.disconnect();
			window.removeEventListener("resize", publish);
			root.style.removeProperty("--tds-bottom-lane");
		};
	}, [visible]);
	if (!visible) return null;
	const t = translations[lang].cookieNotice;
	const dismiss = () => {
		setVisible(false);
		try {
			localStorage.setItem(storageKey, "1");
		} catch {}
	};
	const decide = (value) => {
		setVisible(false);
		setAdConsent(value);
	};
	return /* @__PURE__ */ jsxs("aside", {
		ref,
		className: "cookie-notice",
		role: "region",
		"aria-label": t.label,
		children: [/* @__PURE__ */ jsxs("p", {
			className: "cookie-notice-text",
			children: [
				consent ? t.consentText : variant === "panel" ? t.panelText : t.siteText,
				" ",
				/* @__PURE__ */ jsx("a", {
					className: "cookie-notice-link",
					href: privacyUrl,
					children: t.privacy
				})
			]
		}), consent ? /* @__PURE__ */ jsxs("div", {
			className: "cookie-notice-actions",
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "cookie-notice-btn cookie-notice-btn--ghost",
				onClick: () => decide("denied"),
				children: t.consentDecline
			}), /* @__PURE__ */ jsx("button", {
				type: "button",
				className: "cookie-notice-btn",
				onClick: () => decide("granted"),
				children: t.consentAccept
			})]
		}) : /* @__PURE__ */ jsx("button", {
			type: "button",
			className: "cookie-notice-btn",
			onClick: dismiss,
			children: t.accept
		})]
	});
}
var RUNTIME_CONFIG_PATH$1 = "/tds-runtime.json";
var STATE_KEY$1 = /* @__PURE__ */ Symbol.for("@tracht-digital-solutions/tds-shared:api-state");
var state$1 = (() => {
	const host = globalThis;
	const existing = host[STATE_KEY$1];
	if (existing !== void 0) return existing;
	const fresh = {
		cached: null,
		runtimePromise: null,
		runtimeValue: null,
		onUnauthorized: null,
		headersProvider: null
	};
	host[STATE_KEY$1] = fresh;
	return fresh;
})();
var trimEnd$1 = (value) => value.replace(/\/+$/, "");
function apiBase() {
	if (state$1.cached !== null) return state$1.cached;
	const env = typeof import.meta !== "undefined" ? Object.assign({
		"ASSETS_PREFIX": void 0,
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"PUBLIC_DEMO_MODE": "true",
		"SITE": "https://blog.tracht-digital.de",
		"SSR": true
	}, {
		CI: "true",
		_: "/opt/hostedtoolcache/node/22.23.2/x64/bin/npm",
		PATH: "/home/runner/work/tds-blog-frontend/tds-blog-frontend/node_modules/.bin:/home/runner/work/tds-blog-frontend/node_modules/.bin:/home/runner/work/node_modules/.bin:/home/runner/node_modules/.bin:/home/node_modules/.bin:/node_modules/.bin:/opt/hostedtoolcache/node/22.23.2/x64/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/opt/hostedtoolcache/node/22.23.2/x64/bin:/snap/bin:/home/runner/.local/bin:/opt/pipx_bin:/home/runner/.cargo/bin:/home/runner/.config/composer/vendor/bin:/usr/local/.ghcup/bin:/home/runner/.dotnet/tools:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin"
	})?.PUBLIC_API_BASE ?? "" : "";
	if (typeof document === "undefined") return trimEnd$1(env || "https://api.tracht-digital.de");
	let meta = "";
	try {
		meta = document.querySelector(`meta[name="tds-api-base"]`)?.getAttribute("content") ?? "";
	} catch {}
	state$1.cached = trimEnd$1(meta.trim() || env || "https://api.tracht-digital.de");
	return state$1.cached;
}
async function runtimeConfig$1() {
	if (state$1.runtimePromise !== null) return state$1.runtimePromise;
	if (typeof document === "undefined" || typeof fetch !== "function") {
		state$1.runtimePromise = Promise.resolve(null);
		return state$1.runtimePromise;
	}
	let declared = "";
	try {
		declared = document.querySelector(`meta[name="tds-api-base"]`)?.getAttribute("content") ?? "";
	} catch {}
	if (declared.trim() !== "") {
		state$1.runtimePromise = Promise.resolve(null);
		return state$1.runtimePromise;
	}
	state$1.runtimePromise = (async () => {
		try {
			const res = await fetch(RUNTIME_CONFIG_PATH$1, {
				credentials: "same-origin",
				headers: { Accept: "application/json" },
				signal: typeof AbortSignal?.timeout === "function" ? AbortSignal.timeout(3e3) : void 0
			});
			if (!res.ok) return null;
			if (!(res.headers.get("content-type") ?? "").includes("json")) return null;
			const parsed = await res.json();
			if (parsed === null || typeof parsed !== "object") return null;
			const config = parsed;
			if (typeof config.apiBase === "string" && config.apiBase !== "") state$1.cached = trimEnd$1(config.apiBase);
			state$1.runtimeValue = config;
			return config;
		} catch {
			return null;
		}
	})();
	return state$1.runtimePromise;
}
async function runtimeSetting$1(key, fallback) {
	const value = (await runtimeConfig$1())?.[key];
	return typeof value === "string" && value !== "" ? value : fallback;
}
async function runtimeAbsolute(key, fallback) {
	const value = await runtimeSetting$1(key, "");
	return trimEnd$1(/^https?:\/\//i.test(value) ? value : fallback);
}
function apiUrl(path) {
	if (/^(https?:)?\/\//i.test(path)) return path;
	return `${apiBase()}${path.startsWith("/") ? "" : "/"}${path}`;
}
async function apiFetch(path, init = {}) {
	await runtimeConfig$1();
	const url = apiUrl(path);
	let extra = {};
	if (state$1.headersProvider !== null) try {
		extra = state$1.headersProvider(url);
	} catch {}
	const res = await fetch(url, {
		credentials: "include",
		...init,
		headers: {
			...extra,
			...init.headers
		}
	});
	if (res.status === 401 && state$1.onUnauthorized !== null) try {
		await state$1.onUnauthorized(url);
	} catch {}
	return res;
}
var STR = {
	de: {
		close: "Schließen",
		hide: "Ausblenden",
		chat: "Chat",
		faq: "FAQ",
		docs: "Hilfe",
		contact: "Kontakt",
		startPrompt: "Schreib uns – wir antworten so schnell wie möglich.",
		namePh: "Name (optional)",
		emailPh: "E-Mail (optional)",
		msgPh: "Nachricht …",
		send: "Senden",
		start: "Chat starten",
		subjectPh: "Betreff (optional)",
		contactMsgPh: "Deine Nachricht …",
		contactSend: "Absenden",
		contactOk: "Danke! Wir melden uns.",
		contactErr: "Bitte Name, gültige E-Mail und eine Nachricht (min. 20 Zeichen) angeben.",
		rate: "Zu viele Anfragen – bitte später erneut versuchen.",
		empty: "Noch keine Nachrichten."
	},
	en: {
		close: "Close",
		hide: "Hide",
		chat: "Chat",
		faq: "FAQ",
		docs: "Help",
		contact: "Contact",
		startPrompt: "Message us – we reply as soon as we can.",
		namePh: "Name (optional)",
		emailPh: "Email (optional)",
		msgPh: "Message …",
		send: "Send",
		start: "Start chat",
		subjectPh: "Subject (optional)",
		contactMsgPh: "Your message …",
		contactSend: "Submit",
		contactOk: "Thanks! We'll be in touch.",
		contactErr: "Please provide a name, a valid email and a message (min. 20 chars).",
		rate: "Too many requests – please try again later.",
		empty: "No messages yet."
	}
};
var HIDDEN_KEY = "tds-live-chat-hidden";
var POLL_MS = 4e3;
function LiveChatCta({ frontend, apiBase: apiBase2, lang = "de" }) {
	const t = STR[lang === "en" ? "en" : "de"];
	const [config, setConfig] = useState(null);
	const [hidden, setHidden] = useState(true);
	const [open, setOpen] = useState(false);
	const [tab, setTab] = useState("chat");
	const launcherRef = useRef(null);
	const api = useCallback((path, init) => apiBase2 ? fetch(`${apiBase2}${path}`, {
		credentials: "include",
		...init
	}) : apiFetch(path, init), [apiBase2]);
	useEffect(() => {
		let alive = true;
		let dismissed = false;
		try {
			dismissed = localStorage.getItem(`${HIDDEN_KEY}:${frontend}`) === "1";
		} catch {}
		api(`/live-chat-cta/config?frontend=${encodeURIComponent(frontend)}&lang=${lang}`).then((r) => r.ok ? r.json() : null).then((d) => {
			if (!alive || !d || !d.enabled) return;
			setConfig(d);
			setHidden(dismissed);
			const first = [
				"chat",
				"faq",
				"docs",
				"contact"
			].find((k) => d.tabs[k]);
			if (first) setTab(first);
		}).catch(() => {});
		return () => {
			alive = false;
		};
	}, [
		api,
		frontend,
		lang
	]);
	useEffect(() => {
		const el = launcherRef.current;
		const root = typeof document === "undefined" ? null : document.documentElement;
		if (!root) return;
		if (!el || open || hidden || !config) {
			root.style.removeProperty("--tds-right-lane");
			return;
		}
		const publish = () => {
			root.style.setProperty("--tds-right-lane", `${Math.ceil(el.getBoundingClientRect().height)}px`);
		};
		publish();
		const ro = typeof ResizeObserver === "function" ? new ResizeObserver(publish) : null;
		ro?.observe(el);
		window.addEventListener("resize", publish);
		return () => {
			ro?.disconnect();
			window.removeEventListener("resize", publish);
			root.style.removeProperty("--tds-right-lane");
		};
	}, [
		config,
		hidden,
		open
	]);
	const hide = () => {
		setHidden(true);
		setOpen(false);
		try {
			localStorage.setItem(`${HIDDEN_KEY}:${frontend}`, "1");
		} catch {}
	};
	if (!config || hidden) return null;
	const enabledTabs = [
		"chat",
		"faq",
		"docs",
		"contact"
	].filter((k) => config.tabs[k]);
	if (enabledTabs.length === 0) return null;
	const accent = config.cta.accent || "#050f68";
	if (!open) return /* @__PURE__ */ jsxs("div", {
		ref: launcherRef,
		className: "live-chat-cta live-chat-cta--closed",
		style: { "--lc-accent": accent },
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			className: "live-chat-cta__launcher",
			onClick: () => setOpen(true),
			children: [/* @__PURE__ */ jsx("span", {
				className: "live-chat-cta__launcher-icon",
				"aria-hidden": "true",
				children: "💬"
			}), /* @__PURE__ */ jsx("span", {
				className: "live-chat-cta__launcher-label",
				children: config.cta.label
			})]
		}), /* @__PURE__ */ jsx("button", {
			type: "button",
			className: "live-chat-cta__hide",
			onClick: hide,
			"aria-label": t.hide,
			title: t.hide,
			children: "×"
		})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "live-chat-cta live-chat-cta--open",
		style: { "--lc-accent": accent },
		role: "dialog",
		"aria-label": config.cta.label,
		children: [
			/* @__PURE__ */ jsxs("header", {
				className: "live-chat-cta__head",
				children: [/* @__PURE__ */ jsx("span", {
					className: "live-chat-cta__title",
					children: config.cta.label
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					className: "live-chat-cta__close",
					onClick: () => setOpen(false),
					"aria-label": t.close,
					title: t.close,
					children: "−"
				})]
			}),
			enabledTabs.length > 1 ? /* @__PURE__ */ jsx("nav", {
				className: "live-chat-cta__tabs",
				role: "tablist",
				children: enabledTabs.map((k) => /* @__PURE__ */ jsx("button", {
					type: "button",
					role: "tab",
					"aria-selected": tab === k,
					className: tab === k ? "is-active" : "",
					onClick: () => setTab(k),
					children: t[k]
				}, k))
			}) : null,
			/* @__PURE__ */ jsxs("div", {
				className: "live-chat-cta__body",
				children: [
					tab === "chat" && config.tabs.chat ? /* @__PURE__ */ jsx(ChatPane, {
						api,
						frontend,
						greeting: config.cta.greeting,
						t
					}) : null,
					tab === "faq" && config.tabs.faq ? /* @__PURE__ */ jsx(FaqPane, { faqs: config.faqs }) : null,
					tab === "docs" && config.tabs.docs ? /* @__PURE__ */ jsx(DocsPane, { docs: config.docs }) : null,
					tab === "contact" && config.tabs.contact ? /* @__PURE__ */ jsx(ContactPane, {
						api,
						frontend,
						t
					}) : null
				]
			})
		]
	});
}
function sessionKey(frontend) {
	return `tds-live-chat-session:${frontend}`;
}
function ChatPane({ api, frontend, greeting, t }) {
	const [session, setSession] = useState(null);
	const [messages, setMessages] = useState([]);
	const [draft, setDraft] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [busy, setBusy] = useState(false);
	const endRef = useRef(null);
	const cursor = useRef(0);
	useEffect(() => {
		try {
			const raw = localStorage.getItem(sessionKey(frontend));
			if (raw) setSession(JSON.parse(raw));
		} catch {}
	}, [frontend]);
	const poll = useCallback(async () => {
		if (!session) return;
		const res = await api(`/live-chat-cta/chat/${session.id}/messages?since=${cursor.current}`, { headers: { "X-Chat-Token": session.token } });
		if (res.ok) {
			const incoming = (await res.json()).messages ?? [];
			if (incoming.length > 0) {
				cursor.current = incoming[incoming.length - 1].id;
				setMessages((m) => [...m, ...incoming]);
			}
		}
	}, [api, session]);
	useEffect(() => {
		if (!session) return;
		poll();
		const timer = setInterval(() => void poll(), POLL_MS);
		return () => clearInterval(timer);
	}, [session, poll]);
	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
	const start = async () => {
		const body = draft.trim();
		if (!body) return;
		setBusy(true);
		const res = await api("/live-chat-cta/chat", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name,
				email,
				frontend,
				message: body
			})
		});
		setBusy(false);
		if (res.ok) {
			const d = await res.json();
			const s = {
				id: d.id,
				token: d.token
			};
			try {
				localStorage.setItem(sessionKey(frontend), JSON.stringify(s));
			} catch {}
			setSession(s);
			setDraft("");
		}
	};
	const send = async () => {
		if (!session) return;
		const body = draft.trim();
		if (!body) return;
		setBusy(true);
		const res = await api(`/live-chat-cta/chat/${session.id}/messages`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Chat-Token": session.token
			},
			body: JSON.stringify({ body })
		});
		setBusy(false);
		if (res.ok) {
			setDraft("");
			await poll();
		}
	};
	if (!session) return /* @__PURE__ */ jsxs("div", {
		className: "live-chat-cta__chat",
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "live-chat-cta__greeting",
				children: greeting
			}),
			/* @__PURE__ */ jsx("p", {
				className: "live-chat-cta__hint",
				children: t.startPrompt
			}),
			/* @__PURE__ */ jsx("input", {
				type: "text",
				value: name,
				onChange: (e) => setName(e.target.value),
				placeholder: t.namePh
			}),
			/* @__PURE__ */ jsx("input", {
				type: "email",
				value: email,
				onChange: (e) => setEmail(e.target.value),
				placeholder: t.emailPh
			}),
			/* @__PURE__ */ jsx("textarea", {
				value: draft,
				onChange: (e) => setDraft(e.target.value),
				placeholder: t.msgPh,
				rows: 3
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: start,
				disabled: busy || !draft.trim(),
				children: t.start
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "live-chat-cta__chat",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "live-chat-cta__messages",
			children: [
				messages.length === 0 ? /* @__PURE__ */ jsx("p", {
					className: "live-chat-cta__hint",
					children: greeting
				}) : null,
				messages.map((m) => /* @__PURE__ */ jsx("div", {
					className: `live-chat-cta__msg live-chat-cta__msg--${m.author}`,
					children: m.body
				}, m.id)),
				/* @__PURE__ */ jsx("div", { ref: endRef })
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "live-chat-cta__compose",
			children: [/* @__PURE__ */ jsx("textarea", {
				value: draft,
				onChange: (e) => setDraft(e.target.value),
				placeholder: t.msgPh,
				rows: 2,
				onKeyDown: (e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						send();
					}
				}
			}), /* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: send,
				disabled: busy || !draft.trim(),
				children: t.send
			})]
		})]
	});
}
function FaqPane({ faqs }) {
	const [open, setOpen] = useState(null);
	if (faqs.length === 0) return /* @__PURE__ */ jsx("p", {
		className: "live-chat-cta__hint",
		children: "—"
	});
	return /* @__PURE__ */ jsx("ul", {
		className: "live-chat-cta__faq",
		children: faqs.map((f) => /* @__PURE__ */ jsxs("li", { children: [/* @__PURE__ */ jsx("button", {
			type: "button",
			"aria-expanded": open === f.id,
			onClick: () => setOpen(open === f.id ? null : f.id),
			children: f.question
		}), open === f.id ? /* @__PURE__ */ jsx(Prose, {
			text: f.answer,
			className: "live-chat-cta__faq-answer"
		}) : null] }, f.id))
	});
}
function DocsPane({ docs }) {
	const [active, setActive] = useState(null);
	if (docs.length === 0) return /* @__PURE__ */ jsx("p", {
		className: "live-chat-cta__hint",
		children: "—"
	});
	const current = docs.find((d) => d.id === active) ?? null;
	if (current) return /* @__PURE__ */ jsxs("div", {
		className: "live-chat-cta__doc",
		children: [
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "live-chat-cta__back",
				onClick: () => setActive(null),
				children: "← "
			}),
			/* @__PURE__ */ jsx("h4", { children: current.title }),
			/* @__PURE__ */ jsx(Prose, {
				text: current.body_markdown,
				className: "live-chat-cta__doc-body"
			})
		]
	});
	return /* @__PURE__ */ jsx("ul", {
		className: "live-chat-cta__docs",
		children: docs.map((d) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: () => setActive(d.id),
			children: d.title
		}) }, d.id))
	});
}
function ContactPane({ api, frontend, t }) {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");
	const [website, setWebsite] = useState("");
	const [busy, setBusy] = useState(false);
	const [status, setStatus] = useState(null);
	const [done, setDone] = useState(false);
	const submit = async () => {
		setBusy(true);
		setStatus(null);
		const res = await api("/live-chat-cta/contact", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name,
				email,
				subject,
				message,
				frontend,
				website
			})
		});
		setBusy(false);
		if (res.ok) setDone(true);
		else if (res.status === 429) setStatus(t.rate);
		else setStatus(t.contactErr);
	};
	if (done) return /* @__PURE__ */ jsx("p", {
		className: "live-chat-cta__ok",
		children: t.contactOk
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "live-chat-cta__contact",
		children: [
			/* @__PURE__ */ jsx("input", {
				type: "text",
				value: name,
				onChange: (e) => setName(e.target.value),
				placeholder: t.namePh
			}),
			/* @__PURE__ */ jsx("input", {
				type: "email",
				value: email,
				onChange: (e) => setEmail(e.target.value),
				placeholder: t.emailPh
			}),
			/* @__PURE__ */ jsx("input", {
				type: "text",
				value: subject,
				onChange: (e) => setSubject(e.target.value),
				placeholder: t.subjectPh
			}),
			/* @__PURE__ */ jsx("textarea", {
				value: message,
				onChange: (e) => setMessage(e.target.value),
				placeholder: t.contactMsgPh,
				rows: 4
			}),
			/* @__PURE__ */ jsx("input", {
				type: "text",
				value: website,
				onChange: (e) => setWebsite(e.target.value),
				tabIndex: -1,
				autoComplete: "off",
				"aria-hidden": "true",
				style: {
					position: "absolute",
					left: "-9999px",
					width: 1,
					height: 1,
					opacity: 0
				}
			}),
			status ? /* @__PURE__ */ jsx("p", {
				className: "live-chat-cta__err",
				children: status
			}) : null,
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: submit,
				disabled: busy,
				children: t.contactSend
			})
		]
	});
}
function Prose({ text, className }) {
	const paragraphs = text.split(/\n{2,}/);
	return /* @__PURE__ */ jsx("div", {
		className,
		children: paragraphs.map((p, i) => /* @__PURE__ */ jsx("p", { children: p.split("\n").map((line, j) => /* @__PURE__ */ jsxs("span", { children: [line, j < p.split("\n").length - 1 ? /* @__PURE__ */ jsx("br", {}) : null] }, j)) }, i))
	});
}
var ACCOUNT_HINT_KEY = "tds_pub_account";
var ACCOUNT_LABEL_KEY = "tds_pub_account_label";
var trimEnd2 = (value) => value.replace(/\/+$/, "");
async function accountEndpoints(fallbacks = {}) {
	const base = await runtimeSetting$1("apiBase", fallbacks.apiBase ?? "https://api.tracht-digital.de");
	const login = await runtimeSetting$1("loginUrl", fallbacks.loginUrl ?? "https://auth.tracht-digital.de");
	const write = await runtimeAbsolute("authBase", fallbacks.authApi ?? "https://api.tracht-digital.de/auth");
	return {
		read: `${trimEnd2(base)}/auth`,
		write,
		login: trimEnd2(login)
	};
}
var mePromise = null;
async function fetchAccount(endpoints) {
	if (mePromise === null) {
		mePromise = (async () => {
			try {
				const res = await fetch(`${endpoints.read}/me`, { credentials: "include" });
				if (!res.ok) return null;
				return await res.json();
			} catch {
				return null;
			}
		})();
		mePromise = mePromise.then((me) => {
			if (me === null) mePromise = null;
			else setAccountHint(me.label ?? me.name ?? me.email ?? "");
			return me;
		});
	}
	return mePromise;
}
function invalidateAccount() {
	mePromise = null;
}
async function tryRefreshAccount(endpoints) {
	try {
		if (!(await fetch(`${endpoints.write}/refresh`, {
			method: "POST",
			credentials: "include"
		})).ok) return false;
		return (await fetch(`${endpoints.write}/me`, { credentials: "include" })).ok;
	} catch {
		return false;
	}
}
async function logoutAccount(endpoints) {
	try {
		await fetch(`${endpoints.write}/logout`, {
			method: "DELETE",
			credentials: "include"
		});
	} catch {}
	invalidateAccount();
	clearAccountHint();
}
function storage() {
	try {
		return typeof localStorage !== "undefined" ? localStorage : null;
	} catch {
		return null;
	}
}
function hasAccountHint() {
	try {
		return storage()?.getItem(ACCOUNT_HINT_KEY) === "1";
	} catch {
		return false;
	}
}
function setAccountHint(label = "") {
	try {
		const store = storage();
		store?.setItem(ACCOUNT_HINT_KEY, "1");
		if (label !== "") store?.setItem(ACCOUNT_LABEL_KEY, label);
	} catch {}
}
function clearAccountHint() {
	try {
		const store = storage();
		store?.removeItem(ACCOUNT_HINT_KEY);
		store?.removeItem(ACCOUNT_LABEL_KEY);
	} catch {}
}
function accountHintLabel() {
	try {
		return storage()?.getItem("tds_pub_account_label") ?? "";
	} catch {
		return "";
	}
}
function here() {
	return typeof location !== "undefined" ? location.href : "";
}
function loginHref(login, next = here()) {
	return `${trimEnd2(login)}?next=${encodeURIComponent(next)}`;
}
function passwordHref(login, next = here()) {
	return `${trimEnd2(login)}/passwort?next=${encodeURIComponent(next)}`;
}
var STR2 = {
	de: {
		menuLabel: "Kontomenü",
		portal: "Kundenportal",
		management: "Verwaltung",
		password: "Passwort ändern",
		logout: "Abmelden",
		signIn: "Anmelden"
	},
	en: {
		menuLabel: "Account menu",
		portal: "Customer portal",
		management: "Administration",
		password: "Change password",
		logout: "Sign out",
		signIn: "Sign in"
	}
};
var ICON = {
	user: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }), /* @__PURE__ */ jsx("circle", {
		cx: "12",
		cy: "7",
		r: "4"
	})] }),
	grid: /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx("rect", {
			width: "7",
			height: "7",
			x: "3",
			y: "3",
			rx: "1"
		}),
		/* @__PURE__ */ jsx("rect", {
			width: "7",
			height: "7",
			x: "14",
			y: "3",
			rx: "1"
		}),
		/* @__PURE__ */ jsx("rect", {
			width: "7",
			height: "7",
			x: "14",
			y: "14",
			rx: "1"
		}),
		/* @__PURE__ */ jsx("rect", {
			width: "7",
			height: "7",
			x: "3",
			y: "14",
			rx: "1"
		})
	] }),
	shield: /* @__PURE__ */ jsx("path", { d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }),
	key: /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsx("path", { d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" }), /* @__PURE__ */ jsx("circle", {
		cx: "16.5",
		cy: "7.5",
		r: ".5",
		fill: "currentColor"
	})] }),
	logout: /* @__PURE__ */ jsxs(Fragment$1, { children: [
		/* @__PURE__ */ jsx("path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
		/* @__PURE__ */ jsx("polyline", { points: "16 17 21 12 16 7" }),
		/* @__PURE__ */ jsx("line", {
			x1: "21",
			x2: "9",
			y1: "12",
			y2: "12"
		})
	] }),
	chevron: /* @__PURE__ */ jsx("path", { d: "m6 9 6 6 6-6" })
};
function Glyph({ children, size = 16 }) {
	return /* @__PURE__ */ jsx("svg", {
		"aria-hidden": "true",
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.75",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children
	});
}
var DEFAULT_LINKS = [{
	key: "portal",
	href: "https://app.tracht-digital.de",
	icon: "grid"
}, {
	key: "management",
	href: "https://management.tracht-digital.de",
	icon: "shield",
	adminOnly: true
}];
function AccountMenu({ lang = "de", compact = false, loggedOut = "nothing", afterLogout = "reload", apiBase: apiBase2, authApi, loginUrl, links = DEFAULT_LINKS, className }) {
	const s = STR2[lang] ?? STR2.de;
	const [me, setMe] = useState(null);
	const [loading, setLoading] = useState(true);
	const [endpoints, setEndpoints] = useState(null);
	const [open, setOpen] = useState(false);
	const [seenBefore] = useState(() => hasAccountHint());
	const [cachedLabel] = useState(() => accountHintLabel());
	const rootRef = useRef(null);
	const triggerRef = useRef(null);
	const panelRef = useRef(null);
	useEffect(() => {
		let cancelled = false;
		(async () => {
			const resolved = await accountEndpoints({
				apiBase: apiBase2,
				authApi,
				loginUrl
			});
			if (cancelled) return;
			setEndpoints(resolved);
			let principal = await fetchAccount(resolved);
			if (principal === null && seenBefore) {
				if (await tryRefreshAccount(resolved)) {
					invalidateAccount();
					principal = await fetchAccount(resolved);
				}
			}
			if (cancelled) return;
			if (principal === null) clearAccountHint();
			setMe(principal);
			setLoading(false);
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	useEffect(() => {
		if (!open) return;
		const onPointerDown = (event) => {
			if (!rootRef.current?.contains(event.target)) setOpen(false);
		};
		document.addEventListener("mousedown", onPointerDown);
		return () => document.removeEventListener("mousedown", onPointerDown);
	}, [open]);
	useEffect(() => {
		if (!open) return;
		panelRef.current?.querySelector("[data-menu-item]")?.focus();
	}, [open]);
	const onRootKeyDown = useCallback((event) => {
		if (event.key === "Escape") {
			setOpen(false);
			triggerRef.current?.focus();
			return;
		}
		if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
		event.preventDefault();
		const items = Array.from(panelRef.current?.querySelectorAll("[data-menu-item]") ?? []);
		if (items.length === 0) return;
		items[(items.indexOf(document.activeElement) + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus();
	}, []);
	const label = useMemo(() => me?.label ?? me?.name ?? me?.email ?? "", [me]);
	const login = endpoints?.login ?? loginUrl ?? "https://auth.tracht-digital.de";
	const signOut = useCallback(async () => {
		if (endpoints === null) return;
		await logoutAccount(endpoints);
		if (afterLogout === "reload") {
			location.reload();
			return;
		}
		setMe(null);
		setOpen(false);
	}, [endpoints, afterLogout]);
	const signInLink = /* @__PURE__ */ jsx("a", {
		className: `btn btn-ghost${className ? ` ${className}` : ""}`,
		href: loginHref(login),
		children: s.signIn
	});
	if (loading) {
		if (seenBefore) return /* @__PURE__ */ jsx("div", {
			className: `tds-dropdown${className ? ` ${className}` : ""}`,
			"aria-hidden": "true",
			children: /* @__PURE__ */ jsxs("button", {
				type: "button",
				className: "tds-dropdown__trigger",
				disabled: true,
				tabIndex: -1,
				children: [
					/* @__PURE__ */ jsx("span", { className: "tds-avatar tds-avatar--sm" }),
					!compact && cachedLabel !== "" && /* @__PURE__ */ jsx("span", {
						className: "min-w-0 hidden sm:block",
						children: /* @__PURE__ */ jsx("span", {
							className: "tds-dropdown__label text-sm font-medium",
							children: cachedLabel
						})
					}),
					/* @__PURE__ */ jsx("span", {
						style: { color: "var(--color-muted)" },
						children: /* @__PURE__ */ jsx(Glyph, {
							size: 14,
							children: ICON.chevron
						})
					})
				]
			})
		});
		return loggedOut === "login" ? signInLink : null;
	}
	if (me === null) return loggedOut === "login" ? signInLink : null;
	const rows = links.filter((link) => !link.adminOnly || me.isAdmin);
	return /* @__PURE__ */ jsxs("div", {
		className: `tds-dropdown${className ? ` ${className}` : ""}`,
		ref: rootRef,
		onKeyDown: onRootKeyDown,
		children: [/* @__PURE__ */ jsxs("button", {
			type: "button",
			ref: triggerRef,
			className: "tds-dropdown__trigger",
			"aria-haspopup": "menu",
			"aria-expanded": open,
			onClick: () => setOpen((v) => !v),
			children: [
				/* @__PURE__ */ jsx(Avatar, {
					name: label,
					src: me.hasAvatar ? me.avatarUrl : null,
					seed: me.userId,
					size: "sm",
					decorative: true
				}),
				!compact && /* @__PURE__ */ jsx("span", {
					className: "min-w-0 hidden sm:block",
					children: /* @__PURE__ */ jsx("span", {
						className: "tds-dropdown__label text-sm font-medium",
						children: label
					})
				}),
				/* @__PURE__ */ jsx("span", {
					"aria-hidden": "true",
					style: { color: "var(--color-muted)" },
					children: /* @__PURE__ */ jsx(Glyph, {
						size: 14,
						children: ICON.chevron
					})
				}),
				/* @__PURE__ */ jsxs("span", {
					className: "sr-only",
					children: [s.menuLabel, label ? ` — ${label}` : ""]
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			ref: panelRef,
			className: "tds-dropdown__panel",
			role: "menu",
			"aria-label": s.menuLabel,
			hidden: !open,
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "tds-dropdown__head",
					children: [/* @__PURE__ */ jsx(Avatar, {
						name: label,
						src: me.hasAvatar ? me.avatarUrl : null,
						seed: me.userId,
						decorative: true
					}), /* @__PURE__ */ jsxs("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ jsx("span", {
							className: "tds-dropdown__label text-sm font-medium",
							children: label
						}), /* @__PURE__ */ jsx("span", {
							className: "tds-dropdown__label text-xs",
							style: { color: "var(--color-muted)" },
							children: me.email
						})]
					})]
				}),
				/* @__PURE__ */ jsx("hr", { className: "tds-dropdown__sep" }),
				rows.map((link) => /* @__PURE__ */ jsxs("a", {
					className: "tds-dropdown__item",
					role: "menuitem",
					"data-menu-item": true,
					href: link.href,
					children: [/* @__PURE__ */ jsx("span", {
						className: "tds-dropdown__icon",
						children: /* @__PURE__ */ jsx(Glyph, { children: ICON[link.icon ?? "user"] })
					}), link.label ?? s[link.key] ?? link.key]
				}, link.key)),
				/* @__PURE__ */ jsxs("a", {
					className: "tds-dropdown__item",
					role: "menuitem",
					"data-menu-item": true,
					href: passwordHref(login),
					children: [/* @__PURE__ */ jsx("span", {
						className: "tds-dropdown__icon",
						children: /* @__PURE__ */ jsx(Glyph, { children: ICON.key })
					}), s.password]
				}),
				/* @__PURE__ */ jsx("hr", { className: "tds-dropdown__sep" }),
				/* @__PURE__ */ jsxs("button", {
					type: "button",
					className: "tds-dropdown__item tds-dropdown__item--danger",
					role: "menuitem",
					"data-menu-item": true,
					onClick: () => void signOut(),
					children: [/* @__PURE__ */ jsx("span", {
						className: "tds-dropdown__icon",
						children: /* @__PURE__ */ jsx(Glyph, { children: ICON.logout })
					}), s.logout]
				})
			]
		})]
	});
}
var abs = (s) => ({
	position: "absolute",
	...s
});
var FLAT_TINT = "var(--tds-flat-tint, color-mix(in srgb, var(--color-primary) 9%, var(--color-paper)))";
function AbstractCover({ variant, style, className }) {
	const v = (Math.abs(variant) - 1) % 6 + 1;
	const base = {
		position: "relative",
		overflow: "hidden",
		width: "100%",
		height: "100%",
		...style
	};
	if (v === 1) return /* @__PURE__ */ jsxs("div", {
		className,
		style: {
			...base,
			background: "var(--color-surface-navy)"
		},
		"aria-hidden": "true",
		children: [/* @__PURE__ */ jsx("div", { style: abs({
			right: "-12%",
			top: "-30%",
			width: "70%",
			aspectRatio: "1",
			borderRadius: "50%",
			border: "1.5px solid rgba(255,255,255,.35)"
		}) }), /* @__PURE__ */ jsx("div", { style: abs({
			right: "12%",
			bottom: "14%",
			width: "13%",
			aspectRatio: "1",
			background: "var(--color-surface-accent)"
		}) })]
	});
	if (v === 2) return /* @__PURE__ */ jsxs("div", {
		className,
		style: {
			...base,
			background: "var(--color-soft)"
		},
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ jsx("div", { style: abs({
				left: "-10%",
				bottom: "-45%",
				width: "65%",
				aspectRatio: "1",
				borderRadius: "50%",
				background: "var(--color-surface-navy)"
			}) }),
			/* @__PURE__ */ jsx("div", { style: abs({
				right: "14%",
				top: "18%",
				width: "26%",
				height: 3,
				background: "var(--color-accent)"
			}) }),
			/* @__PURE__ */ jsx("div", { style: abs({
				right: "14%",
				top: "28%",
				width: "34%",
				aspectRatio: "1",
				borderRadius: "50%",
				border: "1.5px solid var(--color-primary)",
				opacity: .5
			}) })
		]
	});
	if (v === 3) return /* @__PURE__ */ jsxs("div", {
		className,
		style: {
			...base,
			background: "var(--color-surface-ink)"
		},
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ jsx("div", { style: abs({
				inset: 0,
				opacity: .18,
				backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
				backgroundSize: "44px 44px",
				backgroundPosition: "22px 18px"
			}) }),
			/* @__PURE__ */ jsx("div", { style: abs({
				left: "18%",
				top: "30%",
				width: "17%",
				aspectRatio: "1",
				borderRadius: "50%",
				background: "var(--color-surface-accent)"
			}) }),
			/* @__PURE__ */ jsx("div", { style: abs({
				left: "42%",
				top: "30%",
				right: "14%",
				bottom: "32%",
				border: "1.5px solid rgba(255,255,255,.55)"
			}) })
		]
	});
	if (v === 4) return /* @__PURE__ */ jsxs("div", {
		className,
		style: {
			...base,
			background: FLAT_TINT
		},
		"aria-hidden": "true",
		children: [[
			0,
			1,
			2
		].map((i) => /* @__PURE__ */ jsx("div", { style: abs({
			left: `${16 + i * 14}%`,
			top: `${34 - i * 8}%`,
			bottom: 0,
			width: "7%",
			background: i === 1 ? "var(--color-primary)" : "var(--color-surface-navy)",
			opacity: i === 1 ? .55 : 1
		}) }, i)), /* @__PURE__ */ jsx("div", { style: abs({
			right: "16%",
			top: "22%",
			width: "10%",
			aspectRatio: "1",
			borderRadius: "50%",
			background: "var(--color-surface-accent)"
		}) })]
	});
	if (v === 5) return /* @__PURE__ */ jsxs("div", {
		className,
		style: {
			...base,
			background: "var(--color-surface-navy)"
		},
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ jsx("div", { style: abs({
				left: "-18%",
				top: "-18%",
				width: "52%",
				aspectRatio: "1",
				borderRadius: "50%",
				background: "rgba(0,0,0,.35)"
			}) }),
			/* @__PURE__ */ jsx("div", { style: abs({
				right: "-8%",
				bottom: "-40%",
				width: "56%",
				aspectRatio: "1",
				borderRadius: "50%",
				border: "1.5px solid rgba(255,255,255,.3)"
			}) }),
			/* @__PURE__ */ jsx("div", { style: abs({
				left: "46%",
				top: "44%",
				width: "20%",
				height: 3,
				background: "var(--color-surface-accent)"
			}) })
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className,
		style: {
			...base,
			background: "var(--color-surface-ink)"
		},
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ jsx("div", { style: abs({
				left: "14%",
				top: "24%",
				width: "30%",
				aspectRatio: "1",
				border: "1.5px solid rgba(255,255,255,.4)"
			}) }),
			/* @__PURE__ */ jsx("div", { style: abs({
				left: "26%",
				top: "44%",
				width: "30%",
				aspectRatio: "1",
				background: "var(--color-surface-navy)",
				filter: "brightness(1.8)"
			}) }),
			/* @__PURE__ */ jsx("div", { style: abs({
				right: "16%",
				top: "30%",
				width: "9%",
				aspectRatio: "1",
				borderRadius: "50%",
				background: "var(--color-surface-accent)"
			}) })
		]
	});
}
function coverVariant(slug) {
	let h = 0;
	for (let i = 0; i < slug.length; i++) h = h * 31 + slug.charCodeAt(i) | 0;
	return Math.abs(h) % 6 + 1;
}
function hasPhotoCover(coverHint) {
	if (!coverHint) return false;
	return /^https?:\/\//i.test(coverHint) || /^\/.+\.(webp|avif|png|jpe?g|svg)$/i.test(coverHint);
}
function PostCover({ slug, coverHint, title, style, className }) {
	if (hasPhotoCover(coverHint)) return /* @__PURE__ */ jsx("img", {
		src: coverHint,
		alt: title ?? "",
		loading: "lazy",
		className,
		style: {
			width: "100%",
			height: "100%",
			objectFit: "cover",
			display: "block",
			...style
		}
	});
	return /* @__PURE__ */ jsx(AbstractCover, {
		variant: coverVariant(slug),
		style,
		className
	});
}
//#endregion
//#region src/lib/nav.ts
/**
* The public tools site. A sibling first-party property, so it opens in the
* SAME tab — forcing `target="_blank"` on a link within one's own group of
* sites takes a decision away from the reader for no reason.
*/
var TOOLS_URL = "https://tools.tracht-digital.de";
function primaryNav(lang) {
	return [
		{
			kind: "link",
			key: "journal",
			label: "Journal",
			href: lang === "de" ? "/" : "/en/"
		},
		{
			kind: "group",
			key: "entdecken",
			label: lang === "de" ? "Entdecken" : "Discover"
		},
		{
			kind: "link",
			key: "tools",
			label: "Tools",
			href: TOOLS_URL,
			external: true
		}
	];
}
/** Section labels inside the Entdecken group. */
function entdeckenLabels(lang) {
	return {
		group: lang === "de" ? "Entdecken" : "Discover",
		categories: lang === "de" ? "Kategorien" : "Categories",
		tags: lang === "de" ? "Beliebte Tags" : "Popular tags",
		topics: lang === "de" ? "Aktuelle Themen" : "Current topics"
	};
}
function categoryHref(lang, slug) {
	return lang === "de" ? `/kategorie/${slug}` : `/en/category/${slug}`;
}
function tagHref(lang, tag) {
	return lang === "de" ? `/tag/${tag}` : `/en/tag/${tag}`;
}
function topicsHref(lang) {
	return lang === "de" ? "/aktuelles" : "/en/aktuelles";
}
function authorHref(lang, slug) {
	return lang === "de" ? `/autor/${slug}` : `/en/author/${slug}`;
}
var norm = (p) => p.replace(/\/+$/, "") || "/";
/**
* Active-state helper for a plain link nav item (Journal).
*/
function isActiveNav(href, pathname) {
	return norm(href) === norm(pathname);
}
/**
* The Entdecken group reads as active whenever the visitor is on any of the
* browse surfaces it leads to: category pages, tag pages or the topics page
* (both language variants).
*/
function isEntdeckenActive(pathname) {
	const p = norm(pathname);
	return /^\/(en\/)?kategorie\//.test(p) || /^\/en\/category\//.test(p) || /^\/(en\/)?tag\//.test(p) || p === "/aktuelles" || p === "/en/aktuelles";
}
//#endregion
//#region src/components/JournalHeader.astro
createAstro("https://blog.tracht-digital.de");
var $$JournalHeader = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$JournalHeader;
	const { lang = "de", class: className } = Astro.props;
	const home = lang === "de" ? "/" : "/en/";
	const nav = primaryNav(lang);
	const path = Astro.url.pathname;
	const labels = entdeckenLabels(lang);
	const { categories, topTags } = await getTaxonomy(lang);
	const entdeckenActive = isEntdeckenActive(path);
	const searchPlaceholder = lang === "de" ? "Suchen …" : "Search …";
	const cta = lang === "de" ? "Unverbindlich anfragen" : "Get in touch";
	const menuLabel = lang === "en" ? "Menu" : "Menü";
	return renderTemplate`${maybeRenderHead($$result)}<header${addAttribute(["brand-header", className], "class:list")} data-astro-cid-eldh542x><div class="tds-shell min-h-15 py-2.5 flex flex-nowrap items-center gap-x-2 sm:gap-x-4" data-astro-cid-eldh542x><a${addAttribute(home, "href")} aria-label="Tracht Journal" class="brand-wordmark text-[0.9375rem] sm:text-[1.0625rem] tracking-tight shrink-0 whitespace-nowrap inline-flex items-center gap-1.5 sm:gap-2" data-astro-cid-eldh542x><span class="brand-logo" aria-hidden="true" data-astro-cid-eldh542x></span><span class="accent-italic" data-astro-cid-eldh542x>Journal</span></a><span class="nav-divider hidden sm:block" aria-hidden="true" data-astro-cid-eldh542x></span><nav class="hidden lg:flex items-center gap-1 flex-1 min-w-0" aria-label="Navigation" data-astro-cid-eldh542x>${nav.map((node) => node.kind === "link" ? renderTemplate`<a${addAttribute(node.href, "href")} class="jnav-item whitespace-nowrap"${addAttribute(isActiveNav(node.href, path) ? "page" : void 0, "aria-current")} data-astro-cid-eldh542x>${node.label}</a>` : renderTemplate`<div class="jnav-dd" id="jnl-entdecken" data-astro-cid-eldh542x><button type="button" id="jnl-entdecken-btn" class="jnav-item jnav-dd-btn whitespace-nowrap" aria-expanded="false" aria-controls="jnl-entdecken-panel"${addAttribute(entdeckenActive ? "true" : void 0, "aria-current")} data-astro-cid-eldh542x><span data-astro-cid-eldh542x>${node.label}</span><svg class="jnav-dd-caret" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-eldh542x><path d="M6 9l6 6 6-6" data-astro-cid-eldh542x></path></svg></button><div id="jnl-entdecken-panel" class="jnav-dropdown" data-open="false" role="group"${addAttribute(node.label, "aria-label")} data-astro-cid-eldh542x><div class="jnav-dd-col" data-astro-cid-eldh542x><p class="jnav-dd-head" data-astro-cid-eldh542x>${labels.categories}</p>${categories.length === 0 ? renderTemplate`<p class="jnav-dd-empty" data-astro-cid-eldh542x>—</p>` : renderTemplate`<div class="jnav-dd-links" data-astro-cid-eldh542x>${categories.map((c) => renderTemplate`<a${addAttribute(categoryHref(lang, c.slug), "href")} class="jnav-dd-link" data-astro-cid-eldh542x><span data-astro-cid-eldh542x>${c.name}</span><span class="jnav-dd-count" data-astro-cid-eldh542x>${c.count}</span></a>`)}</div>`}</div><div class="jnav-dd-col" data-astro-cid-eldh542x><p class="jnav-dd-head" data-astro-cid-eldh542x>${labels.tags}</p>${topTags.length === 0 ? renderTemplate`<p class="jnav-dd-empty" data-astro-cid-eldh542x>—</p>` : renderTemplate`<div class="jnav-dd-chips" data-astro-cid-eldh542x>${topTags.map((t) => renderTemplate`<a${addAttribute(tagHref(lang, t.name), "href")} class="chip-flat chip-flat--sm" data-astro-cid-eldh542x>#${t.name}</a>`)}</div>`}</div><div class="jnav-dd-col" data-astro-cid-eldh542x><p class="jnav-dd-head" data-astro-cid-eldh542x>${labels.topics}</p><a${addAttribute(topicsHref(lang), "href")} class="jnav-dd-link jnav-dd-link--lead" data-astro-cid-eldh542x><span data-astro-cid-eldh542x>${labels.topics}</span><span aria-hidden="true" data-astro-cid-eldh542x>→</span></a></div></div></div>`)}</nav><div class="nav-search hidden lg:flex" role="search" data-astro-cid-eldh542x><svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" data-astro-cid-eldh542x><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5" data-astro-cid-eldh542x></circle><path d="M10.8 10.8L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" data-astro-cid-eldh542x></path></svg><input type="search" id="jnl-search" class="js-blog-search"${addAttribute(searchPlaceholder, "placeholder")}${addAttribute(searchPlaceholder, "aria-label")}${addAttribute(home, "data-index-url")} data-astro-cid-eldh542x></div><div class="flex-1 lg:hidden" data-astro-cid-eldh542x></div><div class="flex items-center gap-1.5 sm:gap-2 shrink-0" data-astro-cid-eldh542x><div class="hidden lg:flex items-center gap-2" data-astro-cid-eldh542x><div class="tds-lang-toggle" role="group" aria-label="Sprache / Language" data-astro-cid-eldh542x><a href="/"${addAttribute(lang === "de" ? "on" : "", "class")}${addAttribute(lang === "de" ? "true" : void 0, "aria-current")} data-astro-cid-eldh542x>DE</a><a href="/en/"${addAttribute(lang === "en" ? "on" : "", "class")}${addAttribute(lang === "en" ? "true" : void 0, "aria-current")} data-astro-cid-eldh542x>EN</a></div>${renderComponent($$result, "ThemeToggle", ThemeToggle, {
		"client:idle": true,
		"labelToDark": lang === "en" ? "Switch to dark mode" : "Auf Dunkel umschalten",
		"labelToLight": lang === "en" ? "Switch to light mode" : "Auf Hell umschalten",
		"data-astro-cid-eldh542x": true,
		"client:component-hydration": "idle",
		"client:component-path": "@tracht-digital-solutions/tds-shared/components",
		"client:component-export": "ThemeToggle"
	})}<a href="https://tracht-digital.de/#contact" class="btn-flat" style="height: 2.25rem;" data-astro-cid-eldh542x>${cta}</a></div><div class="flex items-center" data-astro-cid-eldh542x>${renderComponent($$result, "AccountMenu", AccountMenu, {
		"client:idle": true,
		"lang": lang,
		"data-astro-cid-eldh542x": true,
		"client:component-hydration": "idle",
		"client:component-path": "@tracht-digital-solutions/tds-shared/components",
		"client:component-export": "AccountMenu"
	})}</div><button id="jnl-menu-toggle" type="button" class="btn btn-ghost tds-menu-toggle" aria-controls="jnl-mobile-menu" aria-expanded="false"${addAttribute(menuLabel, "aria-label")} data-astro-cid-eldh542x><span class="tds-menu-bar tds-menu-bar-top" aria-hidden="true" data-astro-cid-eldh542x></span><span class="tds-menu-bar tds-menu-bar-mid" aria-hidden="true" data-astro-cid-eldh542x></span><span class="tds-menu-bar tds-menu-bar-bot" aria-hidden="true" data-astro-cid-eldh542x></span></button></div></div><div id="jnl-mobile-menu" class="tds-mobile-menu inset-x-0 top-[3.75rem]" style="--tds-mobile-menu-inset: 3.75rem" data-open="false" aria-hidden="true"${addAttribute(menuLabel, "aria-label")} data-astro-cid-eldh542x><nav class="jnl-fullmenu-nav mx-auto w-full" aria-label="Navigation" data-astro-cid-eldh542x>${nav.map((node) => node.kind === "link" ? renderTemplate`<a${addAttribute(node.href, "href")} data-menu-link class="jnl-fullmenu-link"${addAttribute(isActiveNav(node.href, path) ? "page" : void 0, "aria-current")} data-astro-cid-eldh542x>${node.label}</a>` : renderTemplate`<div class="jnl-fullmenu-group" data-astro-cid-eldh542x><p class="jnl-fullmenu-sub" data-astro-cid-eldh542x>${labels.categories}</p>${categories.length === 0 ? renderTemplate`<p class="jnav-dd-empty" data-astro-cid-eldh542x>—</p>` : categories.map((c) => renderTemplate`<a${addAttribute(categoryHref(lang, c.slug), "href")} data-menu-link class="jnl-fullmenu-link jnl-fullmenu-link--sub"${addAttribute(isActiveNav(categoryHref(lang, c.slug), path) ? "page" : void 0, "aria-current")} data-astro-cid-eldh542x><span data-astro-cid-eldh542x>${c.name}</span><span class="jnav-dd-count" data-astro-cid-eldh542x>${c.count}</span></a>`)}${topTags.length > 0 && renderTemplate`${renderComponent($$result, "Fragment", Fragment$2, {}, { "default": ($$result) => renderTemplate`<p class="jnl-fullmenu-sub" data-astro-cid-eldh542x>${labels.tags}</p><div class="jnav-dd-chips" data-astro-cid-eldh542x>${topTags.map((t) => renderTemplate`<a${addAttribute(tagHref(lang, t.name), "href")} data-menu-link${addAttribute([
		"chip-flat",
		"chip-flat--sm",
		{ on: isActiveNav(tagHref(lang, t.name), path) }
	], "class:list")} data-astro-cid-eldh542x>#${t.name}</a>`)}</div>` })}`}<p class="jnl-fullmenu-sub" data-astro-cid-eldh542x>${labels.topics}</p><a${addAttribute(topicsHref(lang), "href")} data-menu-link class="jnl-fullmenu-link jnl-fullmenu-link--sub jnl-fullmenu-link--lead"${addAttribute(isActiveNav(topicsHref(lang), path) ? "page" : void 0, "aria-current")} data-astro-cid-eldh542x><span data-astro-cid-eldh542x>${labels.topics}</span><span aria-hidden="true" data-astro-cid-eldh542x>→</span></a></div>`)}</nav><div class="jnl-fullmenu-foot mx-auto w-full" data-astro-cid-eldh542x><div class="flex items-center gap-2" data-astro-cid-eldh542x><div class="tds-lang-toggle" role="group" aria-label="Sprache / Language" data-astro-cid-eldh542x><a href="/"${addAttribute(lang === "de" ? "on" : "", "class")}${addAttribute(lang === "de" ? "true" : void 0, "aria-current")} data-astro-cid-eldh542x>DE</a><a href="/en/"${addAttribute(lang === "en" ? "on" : "", "class")}${addAttribute(lang === "en" ? "true" : void 0, "aria-current")} data-astro-cid-eldh542x>EN</a></div>${renderComponent($$result, "ThemeToggle", ThemeToggle, {
		"client:idle": true,
		"labelToDark": lang === "en" ? "Switch to dark mode" : "Auf Dunkel umschalten",
		"labelToLight": lang === "en" ? "Switch to light mode" : "Auf Hell umschalten",
		"data-astro-cid-eldh542x": true,
		"client:component-hydration": "idle",
		"client:component-path": "@tracht-digital-solutions/tds-shared/components",
		"client:component-export": "ThemeToggle"
	})}</div><a href="https://tracht-digital.de/#contact" data-menu-link class="btn-flat jnl-fullmenu-cta" data-astro-cid-eldh542x><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-eldh542x><rect x="3" y="4.5" width="18" height="16" data-astro-cid-eldh542x></rect><path d="M3 9h18M8 2.5v4M16 2.5v4" data-astro-cid-eldh542x></path></svg><span data-astro-cid-eldh542x>${cta}</span></a></div></div></header>${renderScript($$result, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/JournalHeader.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/JournalHeader.astro", void 0);
var RUNTIME_CONFIG_PATH = "/tds-runtime.json";
var STATE_KEY = /* @__PURE__ */ Symbol.for("@tracht-digital-solutions/tds-shared:api-state");
var state = (() => {
	const host = globalThis;
	const existing = host[STATE_KEY];
	if (existing !== void 0) return existing;
	const fresh = {
		cached: null,
		runtimePromise: null,
		runtimeValue: null,
		onUnauthorized: null,
		headersProvider: null
	};
	host[STATE_KEY] = fresh;
	return fresh;
})();
var trimEnd = (value) => value.replace(/\/+$/, "");
async function runtimeConfig() {
	if (state.runtimePromise !== null) return state.runtimePromise;
	if (typeof document === "undefined" || typeof fetch !== "function") {
		state.runtimePromise = Promise.resolve(null);
		return state.runtimePromise;
	}
	let declared = "";
	try {
		declared = document.querySelector(`meta[name="tds-api-base"]`)?.getAttribute("content") ?? "";
	} catch {}
	if (declared.trim() !== "") {
		state.runtimePromise = Promise.resolve(null);
		return state.runtimePromise;
	}
	state.runtimePromise = (async () => {
		try {
			const res = await fetch(RUNTIME_CONFIG_PATH, {
				credentials: "same-origin",
				headers: { Accept: "application/json" },
				signal: typeof AbortSignal?.timeout === "function" ? AbortSignal.timeout(3e3) : void 0
			});
			if (!res.ok) return null;
			if (!(res.headers.get("content-type") ?? "").includes("json")) return null;
			const parsed = await res.json();
			if (parsed === null || typeof parsed !== "object") return null;
			const config = parsed;
			if (typeof config.apiBase === "string" && config.apiBase !== "") state.cached = trimEnd(config.apiBase);
			state.runtimeValue = config;
			return config;
		} catch {
			return null;
		}
	})();
	return state.runtimePromise;
}
async function runtimeSetting(key, fallback) {
	const value = (await runtimeConfig())?.[key];
	return typeof value === "string" && value !== "" ? value : fallback;
}
//#endregion
//#region src/components/islands/NewsletterSignup.tsx
var CONTACT_API_URL = "https://api.tracht-digital.de/contact";
var COPY = {
	de: {
		eyebrow: "Newsletter",
		title: "Digitalisierung, einmal im Monat.",
		body: "Neue Artikel, Praxisbeispiele und Werkzeuge für den Mittelstand — direkt in Ihr Postfach. Kein Spam, jederzeit abbestellbar.",
		placeholder: "Ihre E-Mail-Adresse",
		cta: "Anmelden",
		done: "Vielen Dank — wir haben Ihre Anmeldung erhalten und melden uns in Kürze.",
		error: "Das hat leider nicht geklappt. Bitte versuchen Sie es später noch einmal.",
		legal: "Mit dem Absenden stimmen Sie zu, dass wir Sie per E-Mail kontaktieren. Abmeldung jederzeit möglich.",
		message: "Newsletter-Anmeldung über das Journal (blog.tracht-digital.de)."
	},
	en: {
		eyebrow: "Newsletter",
		title: "Digitalization, once a month.",
		body: "New articles, case studies and tools for SMEs — straight to your inbox. No spam, unsubscribe anytime.",
		placeholder: "Your email address",
		cta: "Subscribe",
		done: "Thank you — we received your signup and will be in touch shortly.",
		error: "That didn't work. Please try again later.",
		legal: "By submitting you agree that we may contact you by email. Unsubscribe anytime.",
		message: "Newsletter signup via the Journal (blog.tracht-digital.de)."
	}
};
function NewsletterSignup({ lang }) {
	const t = COPY[lang];
	const [email, setEmail] = useState("");
	const [state, setState] = useState("idle");
	const submit = async (e) => {
		e.preventDefault();
		if (!email.trim() || state === "submitting") return;
		setState("submitting");
		try {
			const endpoint = await runtimeSetting("contactUrl", CONTACT_API_URL);
			const res = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: "Newsletter Journal",
					email: email.trim(),
					message: t.message,
					consent: true
				})
			});
			setState(res.ok ? "done" : "error");
		} catch {
			setState("error");
		}
	};
	return /* @__PURE__ */ jsx("section", {
		style: {
			background: "var(--color-surface-ink)",
			color: "#fff",
			padding: "52px 0"
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "tds-shell grid lg:grid-cols-2 items-center",
			style: { gap: 40 },
			children: [/* @__PURE__ */ jsxs("div", { children: [
				/* @__PURE__ */ jsx("p", {
					className: "eyebrow",
					style: {
						color: "var(--color-accent-pink)",
						marginBottom: 18
					},
					children: t.eyebrow
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "display",
					style: {
						fontSize: "clamp(1.75rem, 3.5vw, 2.375rem)",
						margin: 0,
						textWrap: "balance"
					},
					children: t.title
				}),
				/* @__PURE__ */ jsx("p", {
					style: {
						fontSize: 16,
						lineHeight: 1.6,
						color: "rgba(255,255,255,.7)",
						margin: "12px 0 0",
						maxWidth: "48ch"
					},
					children: t.body
				})
			] }), /* @__PURE__ */ jsxs("div", { children: [state === "done" ? /* @__PURE__ */ jsx("p", {
				role: "status",
				style: {
					fontSize: 16,
					lineHeight: 1.6,
					fontWeight: 500,
					margin: 0,
					padding: "16px 20px",
					background: "rgba(255,255,255,.12)"
				},
				children: t.done
			}) : /* @__PURE__ */ jsxs("form", {
				onSubmit: submit,
				className: "newsletter-form",
				children: [/* @__PURE__ */ jsx("input", {
					className: "newsletter-input",
					type: "email",
					required: true,
					value: email,
					onChange: (e) => setEmail(e.target.value),
					placeholder: t.placeholder,
					"aria-label": t.placeholder,
					"aria-invalid": state === "error" || void 0,
					"aria-describedby": "newsletter-note"
				}), /* @__PURE__ */ jsx("button", {
					type: "submit",
					className: "btn-flat",
					disabled: state === "submitting",
					"aria-busy": state === "submitting",
					style: {
						height: 48,
						background: "#fff",
						color: "var(--color-surface-ink)"
					},
					children: state === "submitting" ? /* @__PURE__ */ jsxs(Fragment$1, { children: [
						/* @__PURE__ */ jsx(Spinner, { size: "sm" }),
						" ",
						t.cta
					] }) : t.cta
				})]
			}), /* @__PURE__ */ jsx("p", {
				id: "newsletter-note",
				role: state === "error" ? "alert" : void 0,
				style: {
					fontSize: 12,
					lineHeight: 1.5,
					color: state === "error" ? "var(--color-accent-pink)" : "rgba(255,255,255,.55)",
					margin: "14px 0 0"
				},
				children: state === "error" ? t.error : t.legal
			})] })]
		})
	});
}
//#endregion
//#region src/components/JournalFooter.astro
createAstro("https://blog.tracht-digital.de");
var $$JournalFooter = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$JournalFooter;
	const { lang = "de" } = Astro.props;
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	const adsEnabled = (await adsConfig()).enabled;
	const adConsentLabel = lang === "de" ? "Werbe-Einwilligung ändern" : "Ad-consent settings";
	const labels = entdeckenLabels(lang);
	const { categories } = await getTaxonomy(lang);
	const blurb = lang === "de" ? "Software, Web und Digitalisierung für kleine und mittlere Unternehmen — passgenau statt von der Stange, ansässig in Schwarzenbek bei Hamburg." : "Software, web, and digitalization for small and medium-sized businesses — built to fit, not off the shelf, based in Schwarzenbek near Hamburg.";
	const entdeckenItems = [...categories.slice(0, 5).map((c) => ({
		label: c.name,
		href: categoryHref(lang, c.slug)
	})), {
		label: labels.topics,
		href: topicsHref(lang)
	}];
	const groups = lang === "de" ? [
		{
			head: labels.group,
			items: entdeckenItems
		},
		{
			head: "Tracht Digital",
			items: [
				{
					label: "Hauptseite",
					href: "https://tracht-digital.de"
				},
				{
					label: "Werkzeuge",
					href: TOOLS_URL
				},
				{
					label: "Kundenportal",
					href: "https://app.tracht-digital.de"
				},
				{
					label: "Kontakt",
					href: "https://tracht-digital.de/#contact"
				}
			]
		},
		{
			head: "Ressourcen",
			items: [{
				label: "RSS",
				href: "/rss"
			}, {
				label: "English edition",
				href: "/en/"
			}]
		},
		{
			head: "Rechtliches",
			items: [{
				label: "Impressum",
				href: "https://tracht-digital.de/legal/impressum"
			}, {
				label: "Datenschutz",
				href: "https://tracht-digital.de/legal/datenschutz"
			}]
		}
	] : [
		{
			head: labels.group,
			items: entdeckenItems
		},
		{
			head: "Tracht Digital",
			items: [
				{
					label: "Main site",
					href: "https://tracht-digital.de"
				},
				{
					label: "Tools",
					href: TOOLS_URL
				},
				{
					label: "Customer portal",
					href: "https://app.tracht-digital.de"
				},
				{
					label: "Contact",
					href: "https://tracht-digital.de/#contact"
				}
			]
		},
		{
			head: "Resources",
			items: [{
				label: "RSS",
				href: "/en/rss"
			}, {
				label: "Deutsche Ausgabe",
				href: "/"
			}]
		},
		{
			head: "Legal",
			items: [{
				label: "Imprint",
				href: "https://tracht-digital.de/legal/impressum"
			}, {
				label: "Privacy",
				href: "https://tracht-digital.de/legal/datenschutz"
			}]
		}
	];
	return renderTemplate`${renderComponent($$result, "NewsletterSignup", NewsletterSignup, {
		"lang": lang,
		"client:visible": true,
		"client:component-hydration": "visible",
		"client:component-path": "~/components/islands/NewsletterSignup.tsx",
		"client:component-export": "default"
	})}${maybeRenderHead($$result)}<footer class="blog-footer tds-tone-navy" style="padding: 48px 0 28px;"><div class="tds-shell"><div class="grid gap-9 sm:grid-cols-2 lg:[grid-template-columns:1.4fr_repeat(4,1fr)]"><div><p class="brand-wordmark text-lg mb-3 inline-flex items-center gap-2" style="color: #fff;"><span class="brand-logo brand-logo--inverse" aria-hidden="true"></span><span style="color: var(--color-accent-pink);">Digital</span></p><span aria-hidden="true" class="tds-brandbar tds-brandbar--sm tds-brandbar--on-dark mb-4"></span><p class="text-sm leading-relaxed" style="color: rgb(255 255 255 / 0.65); max-width: 32ch;">${blurb}</p><p class="mt-5 text-[0.8125rem]" style="font-family: var(--font-mono); color: rgb(255 255 255 / 0.5);">Schwarzenbek</p></div>${groups.map((g) => renderTemplate`<div><p class="eyebrow mb-4" style="color: rgb(255 255 255 / 0.5);">${g.head}</p><ul class="list-none p-0 m-0 flex flex-col gap-2.5">${g.items.map((it) => renderTemplate`<li><a${addAttribute(it.href, "href")} class="text-sm no-underline text-white/75 hover:text-white transition-colors">${it.label}</a></li>`)}</ul></div>`)}</div><div class="mt-9 pt-4 flex flex-wrap justify-between items-center gap-4 text-xs" style="border-top: 1px solid rgb(255 255 255 / 0.1); font-family: var(--font-mono); color: rgb(255 255 255 / 0.5);"><p>© ${year} Tracht Digital Solutions</p><div class="flex items-center gap-4">${adsEnabled && renderTemplate`<button type="button" id="tds-ad-consent-reset" class="text-white/50 hover:text-white transition-colors bg-transparent border-0 cursor-pointer p-0" style="font-family: var(--font-mono); font-size: inherit;">${adConsentLabel}</button>`}<p>DE / EN</p></div></div>${adsEnabled && renderTemplate`<script>
        (function () {
          var b = document.getElementById("tds-ad-consent-reset");
          if (!b) return;
          b.addEventListener("click", function () {
            try { localStorage.removeItem("tds-ad-consent"); } catch (e) {}
            location.reload();
          });
        })();
      <\/script>`}</div></footer>`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/JournalFooter.astro", void 0);
//#endregion
//#region src/components/ArticleSidebar.astro
createAstro("https://blog.tracht-digital.de");
var $$ArticleSidebar = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ArticleSidebar;
	const { lang = "de" } = Astro.props;
	const home = lang === "de" ? "/" : "/en/";
	const nav = primaryNav(lang);
	const path = Astro.url.pathname;
	const labels = entdeckenLabels(lang);
	const { categories, topTags } = await getTaxonomy(lang);
	const cta = lang === "de" ? "Unverbindlich anfragen" : "Get in touch";
	const toggleCollapse = lang === "de" ? "Navigation einklappen" : "Collapse navigation";
	return renderTemplate`${maybeRenderHead($$result)}<aside class="blog-sidebar" id="article-sidebar"><div class="flex items-center justify-between gap-2 mb-5 sidebar-head"><a${addAttribute(home, "href")} class="brand-wordmark text-[1.0625rem] tracking-tight no-underline sidebar-hide-collapsed" style="color: var(--color-ink);">Tracht <span class="accent-italic">Journal</span></a><button class="sidebar-toggle" id="sidebar-toggle"${addAttribute(toggleCollapse, "aria-label")} aria-expanded="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"></path></svg></button></div><nav class="flex flex-col gap-1 sidebar-hide-collapsed flex-1 min-h-0 overflow-y-auto" aria-label="Navigation">${nav.map((node) => node.kind === "link" ? renderTemplate`<a${addAttribute(node.href, "href")} class="snav-item"${addAttribute(isActiveNav(node.href, path) ? "page" : void 0, "aria-current")}>${node.label}</a>` : renderTemplate`<div class="snav-group"><p class="snav-group-head">${node.label}</p><p class="snav-sub-head">${labels.categories}</p>${categories.length === 0 ? renderTemplate`<p class="jnav-dd-empty px-3">—</p>` : categories.map((c) => renderTemplate`<a${addAttribute(categoryHref(lang, c.slug), "href")} class="snav-item snav-item--sub"${addAttribute(isActiveNav(categoryHref(lang, c.slug), path) ? "page" : void 0, "aria-current")}><span>${c.name}</span><span class="jnav-dd-count">${c.count}</span></a>`)}${topTags.length > 0 && renderTemplate`${renderComponent($$result, "Fragment", Fragment$2, {}, { "default": ($$result) => renderTemplate`<p class="snav-sub-head">${labels.tags}</p><div class="jnav-dd-chips px-3 pb-1">${topTags.map((t) => renderTemplate`<a${addAttribute(tagHref(lang, t.name), "href")}${addAttribute([
		"chip-flat",
		"chip-flat--sm",
		{ on: isActiveNav(tagHref(lang, t.name), path) }
	], "class:list")}>#${t.name}</a>`)}</div>` })}`}<p class="snav-sub-head">${labels.topics}</p><a${addAttribute(topicsHref(lang), "href")} class="snav-item snav-item--sub"${addAttribute(isActiveNav(topicsHref(lang), path) ? "page" : void 0, "aria-current")}>${labels.topics}</a></div>`)}</nav><div class="flex justify-center mb-3 mt-3">${renderComponent($$result, "ThemeToggle", ThemeToggle, {
		"client:idle": true,
		"labelToDark": lang === "en" ? "Switch to dark mode" : "Auf Dunkel umschalten",
		"labelToLight": lang === "en" ? "Switch to light mode" : "Auf Hell umschalten",
		"client:component-hydration": "idle",
		"client:component-path": "@tracht-digital-solutions/tds-shared/components",
		"client:component-export": "ThemeToggle"
	})}</div><div class="tds-lang-toggle mb-2.5 sidebar-hide-collapsed" role="group" aria-label="Sprache / Language"><a href="/"${addAttribute(lang === "de" ? "on" : "", "class")}${addAttribute(lang === "de" ? "true" : void 0, "aria-current")}>DE</a><a href="/en/"${addAttribute(lang === "en" ? "on" : "", "class")}${addAttribute(lang === "en" ? "true" : void 0, "aria-current")}>EN</a></div><a href="https://tracht-digital.de/#contact" class="btn-flat sidebar-hide-collapsed">${cta}</a><a href="https://tracht-digital.de/#contact" class="btn-flat sidebar-show-collapsed self-center"${addAttribute(cta, "title")}${addAttribute(cta, "aria-label")} style="width: 40px; height: 40px; padding: 0; justify-content: center;"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></a></aside><script>
  (function () {
    try {
      if (localStorage.getItem("tds-blog-sidenav") === "collapsed") {
        document.getElementById("article-sidebar").classList.add("collapsed");
        var shift = document.getElementById("page-shift");
        if (shift) shift.classList.add("nav-collapsed");
        var btn = document.getElementById("sidebar-toggle");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    } catch (e) {
      /* storage disabled — start expanded */
    }
  })();
<\/script>${renderScript($$result, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/ArticleSidebar.astro?astro&type=script&index=0&lang.ts")}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/ArticleSidebar.astro", void 0);
//#endregion
//#region src/components/JsonLd.astro
createAstro("https://blog.tracht-digital.de");
var $$JsonLd = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$JsonLd;
	const { data } = Astro.props;
	return renderTemplate`${(Array.isArray(data) ? data : [data]).map((graph) => renderTemplate`<script type="application/ld+json">${unescapeHTML(JSON.stringify(graph))}<\/script>`)}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/JsonLd.astro", void 0);
//#endregion
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/astro/index.js
var SEMANTIC_CHIP_VARIANTS = [
	"neutral",
	"success",
	"warning",
	"danger",
	"info"
];
var CATEGORICAL_CHIP_VARIANTS = [
	"cat-violet",
	"cat-teal",
	"cat-amber",
	"cat-rose",
	"cat-cyan"
];
var CHIP_VARIANTS = [...SEMANTIC_CHIP_VARIANTS, ...CATEGORICAL_CHIP_VARIANTS];
new Set(CHIP_VARIANTS);
var THEME_STORAGE_KEY = "tds-theme";
var THEME_ATTRIBUTE = "data-theme";
var themeBootstrapScript = `(function () {
  function apply(root) {
    try {
      var saved = localStorage.getItem("${THEME_STORAGE_KEY}");
      if (saved === "light" || saved === "dark") {
        root.setAttribute("${THEME_ATTRIBUTE}", saved);
        return;
      }
    } catch (e) { /* storage disabled \u2014 fall through to OS */ }
    var dark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.setAttribute("${THEME_ATTRIBUTE}", dark ? "dark" : "light");
  }
  apply(document.documentElement);
  document.addEventListener("astro:before-swap", function (event) {
    apply(event.newDocument.documentElement);
  });
})();`;
//#endregion
//#region src/layouts/Layout.astro
createAstro("https://blog.tracht-digital.de");
var $$Layout = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	const { title, description: descriptionProp, lang = "de", canonical, altUrl: altUrlProp, ogImage, article, jsonLd, noindex = false, sidebar = false, bare = false, focusable = false, adsMode } = Astro.props;
	const description = descriptionProp ?? siteConfig.description[lang];
	const resolvedOgImage = ogImage ?? (article?.slug ? `/og/${lang}/${article.slug}.png` : "/og-default.png");
	const site = Astro.site?.origin ?? "https://blog.tracht-digital.de";
	const url = canonical ?? new URL(Astro.url.pathname, site).toString();
	const ogImageAbs = resolvedOgImage.startsWith("http") ? resolvedOgImage : new URL(resolvedOgImage, site).toString();
	const autoAltPath = lang === "de" ? Astro.url.pathname.replace(/^\//, "/en/") : Astro.url.pathname.replace(/^\/en\//, "/");
	const hidden = noindex || await isExcluded(Astro.url.pathname);
	const altUrl = altUrlProp === null || hidden ? null : altUrlProp ?? new URL(autoAltPath, site).toString();
	const altLang = lang === "de" ? "en" : "de";
	const rssHref = lang === "en" ? "/en/rss.xml" : "/rss.xml";
	const ads = bare ? null : await adsConfig();
	const adsActive = !!ads && ads.enabled && (adsMode ?? ads.defaultMode) !== "off";
	const showConsent = !!ads && ads.enabled;
	const showCookieNotice = !bare && !showConsent && await cookieBannerEnabled();
	return renderTemplate`<!-- data-surface selects the geometry layer from tds-shared's design
     library (surfaces/blog.css): the flat "kantig" kit — every radius 0,
     no elevation, the 800 display voice, --tds-flat-tint/-hover. Do not
     author radii locally; that is what made this repo fork .chip,
     .display, .display-tight and .eyebrow in the first place. --><html${addAttribute(lang, "lang")} data-surface="blog"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description, "content")}><meta name="theme-color" content="#050f68">${hidden && renderTemplate`<meta name="robots" content="noindex,nofollow">`}<link rel="icon" type="image/png" href="/favicon.png" sizes="any"><script>${unescapeHTML(themeBootstrapScript)}<\/script>${focusable && renderTemplate`<script>
        /* No-flash focus-mode restore. Gated behind \`focusable\` so the class is
           only ever set on article pages — a persisted preference never leaks
           onto listing/home pages and hides their chrome. */
        (function () {
          try {
            if (localStorage.getItem("tds-blog-focus") === "1") {
              document.documentElement.classList.add("focus-mode");
            }
          } catch (e) { /* storage disabled — start unfocused */ }
        })();
      <\/script>`}<link rel="canonical"${addAttribute(url, "href")}>${altUrl !== null && renderTemplate`${renderComponent($$result, "Fragment", Fragment$2, {}, { "default": ($$result) => renderTemplate`<link rel="alternate"${addAttribute(lang, "hreflang")}${addAttribute(url, "href")}><link rel="alternate"${addAttribute(altLang, "hreflang")}${addAttribute(altUrl, "href")}><link rel="alternate" hreflang="x-default"${addAttribute(lang === "de" ? url : altUrl, "href")}>` })}`}<link rel="alternate" type="application/rss+xml" title="TDS Journal"${addAttribute(rssHref, "href")}><!-- Resource hints — open early connections to the API origin
         (content-api at build time, in case any runtime asset
         resolves to it) and the sibling marketing site. --><link rel="preconnect" href="https://api.tracht-digital.de" crossorigin><link rel="dns-prefetch" href="https://api.tracht-digital.de"><link rel="preconnect" href="https://tracht-digital.de" crossorigin><link rel="dns-prefetch" href="https://tracht-digital.de">${adsActive && renderTemplate`<link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>`}<meta name="generator"${addAttribute(Astro.generator, "content")}><title>${title}</title><meta property="og:type"${addAttribute(article ? "article" : "website", "content")}><meta property="og:url"${addAttribute(url, "content")}><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:image"${addAttribute(ogImageAbs, "content")}><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt"${addAttribute(title, "content")}><meta property="og:locale"${addAttribute(lang === "de" ? "de_DE" : "en_GB", "content")}><meta property="og:site_name" content="TDS Journal">${article?.publishedTime && renderTemplate`<meta property="article:published_time"${addAttribute(article.publishedTime, "content")}>`}${article?.modifiedTime && renderTemplate`<meta property="article:modified_time"${addAttribute(article.modifiedTime, "content")}>`}${article?.author && renderTemplate`<meta property="article:author"${addAttribute(article.author, "content")}>`}${article?.section && renderTemplate`<meta property="article:section"${addAttribute(article.section, "content")}>`}<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><meta name="twitter:image"${addAttribute(ogImageAbs, "content")}>${jsonLd && renderTemplate`${renderComponent($$result, "JsonLd", $$JsonLd, { "data": jsonLd })}`}${renderHead($$result)}</head><body><a href="#main" class="absolute -top-full left-0 z-50 px-6 py-3 bg-[var(--color-surface-navy)] text-white text-sm font-semibold focus:top-0 transition-all">${lang === "de" ? "Zum Inhalt springen" : "Skip to content"}</a>${bare ? renderTemplate`${renderSlot($$result, $$slots["default"])}` : sidebar ? renderTemplate`${renderComponent($$result, "Fragment", Fragment$2, {}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "ArticleSidebar", $$ArticleSidebar, { "lang": lang })}<div class="with-sidebar" id="page-shift">${renderComponent($$result, "JournalHeader", $$JournalHeader, { "lang": lang })}${renderSlot($$result, $$slots["default"])}${renderComponent($$result, "JournalFooter", $$JournalFooter, { "lang": lang })}</div>` })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment$2, {}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "JournalHeader", $$JournalHeader, { "lang": lang })}${renderSlot($$result, $$slots["default"])}${renderComponent($$result, "JournalFooter", $$JournalFooter, { "lang": lang })}` })}`}${showCookieNotice && renderTemplate`${renderComponent($$result, "CookieNotice", CookieNotice, {
		"client:idle": true,
		"lang": lang,
		"client:component-hydration": "idle",
		"client:component-path": "@tracht-digital-solutions/tds-shared/components",
		"client:component-export": "CookieNotice"
	})}`}${showConsent && renderTemplate`${renderComponent($$result, "CookieNotice", CookieNotice, {
		"client:idle": true,
		"lang": lang,
		"consent": true,
		"client:component-hydration": "idle",
		"client:component-path": "@tracht-digital-solutions/tds-shared/components",
		"client:component-export": "CookieNotice"
	})}`}${!bare && renderTemplate`${renderComponent($$result, "LiveChatCta", LiveChatCta, {
		"client:idle": true,
		"frontend": "blog",
		"lang": lang,
		"client:component-hydration": "idle",
		"client:component-path": "@tracht-digital-solutions/tds-shared/components",
		"client:component-export": "LiveChatCta"
	})}`}${adsActive && ads && renderTemplate`<script>(function(){${defineScriptVars({ adsClient: ads.publisherId })}
        (function () {
          function load() {
            if (window.__tdsAdsLoaded) return;
            window.__tdsAdsLoaded = true;
            var s = document.createElement("script");
            s.async = true;
            s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + adsClient;
            s.crossOrigin = "anonymous";
            document.head.appendChild(s);
          }
          try {
            if (localStorage.getItem("tds-ad-consent") === "granted") { load(); return; }
          } catch (e) {}
          window.addEventListener("tds-ad-consent", function (e) {
            if (e && e.detail === "granted") load();
          });
        })();
      })();<\/script>`}${renderScript($$result, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/layouts/Layout.astro?astro&type=script&index=0&lang.ts")}</body></html>`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/layouts/Layout.astro", void 0);
//#endregion
export { PostCover as a, categoryHref as i, TOOLS_URL as n, renderScript as o, authorHref as r, $$Layout as t };
