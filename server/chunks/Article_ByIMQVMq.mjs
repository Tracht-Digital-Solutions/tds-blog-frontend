import { A as renderTemplate, B as unescapeHTML, Bt as union, Ft as discriminatedUnion, It as literal, Lt as number, Mt as _enum, N as addAttribute, Nt as array, Pt as boolean, Rt as object, T as Fragment, Vt as _coercedDate, j as maybeRenderHead, jt as ZodDate, w as renderComponent, zt as string } from "./sequence_ReSFEh7V.mjs";
import { n as createComponent, t as createAstro } from "./compiler_CpHEml6m.mjs";
import { a as ProductCard, d as renderScript, l as imageHints, t as $$Layout } from "./Layout_B_QEA2uz.mjs";
import { T as readContentJson, f as categorySlug, g as blogSnippets, h as adsConfig, v as effectiveAdsMode, w as memoisedOr } from "./cache_qYAc2MYZ.mjs";
import { i as contentApiBase } from "./connection_CMbEZdih.mjs";
import { a as splitProductShortcodes, i as slugify$1, n as renderBlockHtml, o as stripProductShortcodes } from "./localizedPost_DJAEJtBJ.mjs";
import { i as categoryHref, r as authorHref } from "./nav_DMIZIywI.mjs";
import { n as siteConfig, t as pageTitle } from "./seo_DXIXsesw.mjs";
import { r as PostCard } from "./PostCard_D1CE6aOb.mjs";
import { t as $$TagList } from "./TagList_DsePAqEz.mjs";
import { a as breadcrumbSchema, l as organizationSchema, r as blogPostingSchema, s as faqPageSchema } from "./jsonld_0HmREYVr.mjs";
import { i as postDescription } from "./metaDescription_QGOC0pux.mjs";
// node_modules/zod/v4/classic/coerce.js
function date(params) {
	return _coercedDate(ZodDate, params);
}
// src/components/RelatedArticles.astro
createAstro("https://blog.tracht-digital.de");
var $$RelatedArticles = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$RelatedArticles;
	const { posts, currentSlug, currentCategory, lang, limit = 3, class: className } = Astro.props;
	const byDate = (a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
	let picks = posts.filter((p) => p.slug !== currentSlug && p.category === currentCategory).sort(byDate).slice(0, limit);
	if (picks.length < limit) {
		const fallback = posts.filter((p) => p.slug !== currentSlug && !picks.some((q) => q.slug === p.slug)).sort(byDate).slice(0, limit - picks.length);
		picks = [...picks, ...fallback];
	}
	const labels = {
		de: { eyebrow: "Weiterlesen" },
		en: { eyebrow: "Keep reading" }
	}[lang];
	return renderTemplate`${picks.length > 0 && renderTemplate`${maybeRenderHead($$result)}<aside${addAttribute(["jnl-panel jnl-tone-tint", className], "class:list")} aria-labelledby="related-heading"><p class="section-num mb-3">${labels.eyebrow}</p><h2 id="related-heading" class="display-tight text-3xl mb-6">${lang === "de" ? "Ähnliche Artikel." : "Adjacent articles."}</h2><ul class="tds-grid-auto jnl-mosaic jnl-shelf list-none p-0 m-0">${picks.map((p) => renderTemplate`<li class="post-card-slot">${renderComponent($$result, "PostCard", PostCard, {
		"post": p,
		"lang": lang
	})}</li>`)}</ul></aside>`}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/RelatedArticles.astro", void 0);
// src/lib/productImages.ts
var productImageCatalog = {
	"website-check-mit-massnahmenliste": {
		"slug": "website-check-mit-massnahmenliste",
		"slugs": {
			"de": "website-check-mit-massnahmenliste",
			"en": "website-check-with-action-list"
		},
		"title": {
			"de": "Website-Check mit Maßnahmenliste",
			"en": "Website check with action list"
		},
		"alt": {
			"de": "Laptop, Lupe und Prüfkarten als Symbol für einen Website-Check.",
			"en": "Laptop, magnifying glass and review cards illustrating a website audit."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/website-check-mit-massnahmenliste.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-check-with-action-list": {
		"slug": "website-check-mit-massnahmenliste",
		"slugs": {
			"de": "website-check-mit-massnahmenliste",
			"en": "website-check-with-action-list"
		},
		"title": {
			"de": "Website-Check mit Maßnahmenliste",
			"en": "Website check with action list"
		},
		"alt": {
			"de": "Laptop, Lupe und Prüfkarten als Symbol für einen Website-Check.",
			"en": "Laptop, magnifying glass and review cards illustrating a website audit."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/website-check-mit-massnahmenliste.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"digital-check-fuer-ihren-betrieb": {
		"slug": "digital-check-fuer-ihren-betrieb",
		"slugs": {
			"de": "digital-check-fuer-ihren-betrieb",
			"en": "digital-check-for-your-business"
		},
		"title": {
			"de": "Digital-Check für Ihren Betrieb",
			"en": "Digital check for your business"
		},
		"alt": {
			"de": "Geordnete Arbeitsmittel und Planungsunterlagen als Symbol für einen Digital-Check.",
			"en": "Organised work equipment and planning documents illustrating a digital business assessment."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/digital-check-fuer-ihren-betrieb.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"digital-check-for-your-business": {
		"slug": "digital-check-fuer-ihren-betrieb",
		"slugs": {
			"de": "digital-check-fuer-ihren-betrieb",
			"en": "digital-check-for-your-business"
		},
		"title": {
			"de": "Digital-Check für Ihren Betrieb",
			"en": "Digital check for your business"
		},
		"alt": {
			"de": "Geordnete Arbeitsmittel und Planungsunterlagen als Symbol für einen Digital-Check.",
			"en": "Organised work equipment and planning documents illustrating a digital business assessment."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/digital-check-fuer-ihren-betrieb.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"google-unternehmensprofil-einrichten": {
		"slug": "google-unternehmensprofil-einrichten",
		"slugs": {
			"de": "google-unternehmensprofil-einrichten",
			"en": "google-business-profile-setup"
		},
		"title": {
			"de": "Google-Unternehmensprofil einrichten",
			"en": "Google Business Profile setup"
		},
		"alt": {
			"de": "Ladenmodell, Kartenblatt und Standortmarkierung als Symbol für ein Unternehmensprofil.",
			"en": "Shopfront model, map sheet and location marker illustrating a local business profile."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/google-unternehmensprofil-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"google-business-profile-setup": {
		"slug": "google-unternehmensprofil-einrichten",
		"slugs": {
			"de": "google-unternehmensprofil-einrichten",
			"en": "google-business-profile-setup"
		},
		"title": {
			"de": "Google-Unternehmensprofil einrichten",
			"en": "Google Business Profile setup"
		},
		"alt": {
			"de": "Ladenmodell, Kartenblatt und Standortmarkierung als Symbol für ein Unternehmensprofil.",
			"en": "Shopfront model, map sheet and location marker illustrating a local business profile."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/google-unternehmensprofil-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"ablauf-analyse-ein-arbeitsablauf": {
		"slug": "ablauf-analyse-ein-arbeitsablauf",
		"slugs": {
			"de": "ablauf-analyse-ein-arbeitsablauf",
			"en": "workflow-analysis-one-process"
		},
		"title": {
			"de": "Ablauf-Analyse für einen Arbeitsablauf",
			"en": "Workflow analysis for one process"
		},
		"alt": {
			"de": "Prozesskarten in einer Reihenfolge als Symbol für die Analyse eines Arbeitsablaufs.",
			"en": "Sequenced process cards illustrating the analysis of a business workflow."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/ablauf-analyse-ein-arbeitsablauf.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"workflow-analysis-one-process": {
		"slug": "ablauf-analyse-ein-arbeitsablauf",
		"slugs": {
			"de": "ablauf-analyse-ein-arbeitsablauf",
			"en": "workflow-analysis-one-process"
		},
		"title": {
			"de": "Ablauf-Analyse für einen Arbeitsablauf",
			"en": "Workflow analysis for one process"
		},
		"alt": {
			"de": "Prozesskarten in einer Reihenfolge als Symbol für die Analyse eines Arbeitsablaufs.",
			"en": "Sequenced process cards illustrating the analysis of a business workflow."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/ablauf-analyse-ein-arbeitsablauf.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"machbarkeitspruefung-schnittstelle": {
		"slug": "machbarkeitspruefung-schnittstelle",
		"slugs": {
			"de": "machbarkeitspruefung-schnittstelle",
			"en": "integration-feasibility-check"
		},
		"title": {
			"de": "Machbarkeitsprüfung für eine Schnittstelle",
			"en": "Feasibility check for an integration"
		},
		"alt": {
			"de": "Zwei Geräte, Kabelenden und Messwerkzeug als Symbol für eine Schnittstellenprüfung.",
			"en": "Two devices, cable ends and a measuring tool illustrating an integration feasibility review."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/machbarkeitspruefung-schnittstelle.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"integration-feasibility-check": {
		"slug": "machbarkeitspruefung-schnittstelle",
		"slugs": {
			"de": "machbarkeitspruefung-schnittstelle",
			"en": "integration-feasibility-check"
		},
		"title": {
			"de": "Machbarkeitsprüfung für eine Schnittstelle",
			"en": "Feasibility check for an integration"
		},
		"alt": {
			"de": "Zwei Geräte, Kabelenden und Messwerkzeug als Symbol für eine Schnittstellenprüfung.",
			"en": "Two devices, cable ends and a measuring tool illustrating an integration feasibility review."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/machbarkeitspruefung-schnittstelle.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"onepager-website": {
		"slug": "onepager-website",
		"slugs": {
			"de": "onepager-website",
			"en": "one-page-website"
		},
		"title": {
			"de": "Onepager-Website",
			"en": "One-page website"
		},
		"alt": {
			"de": "Einzelnes Blatt mit fünf Inhaltsflächen als Symbol für eine Onepager-Website.",
			"en": "A single sheet with five content areas illustrating a one-page website."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/onepager-website.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"one-page-website": {
		"slug": "onepager-website",
		"slugs": {
			"de": "onepager-website",
			"en": "one-page-website"
		},
		"title": {
			"de": "Onepager-Website",
			"en": "One-page website"
		},
		"alt": {
			"de": "Einzelnes Blatt mit fünf Inhaltsflächen als Symbol für eine Onepager-Website.",
			"en": "A single sheet with five content areas illustrating a one-page website."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/onepager-website.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"firmenwebsite-bis-5-seiten": {
		"slug": "firmenwebsite-bis-5-seiten",
		"slugs": {
			"de": "firmenwebsite-bis-5-seiten",
			"en": "business-website-up-to-5-pages"
		},
		"title": {
			"de": "Firmenwebsite bis 5 Seiten",
			"en": "Business website up to 5 pages"
		},
		"alt": {
			"de": "Fünf geordnete Seitenkarten als Symbol für eine Firmenwebsite.",
			"en": "Five arranged page cards illustrating a company website."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/firmenwebsite-bis-5-seiten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"business-website-up-to-5-pages": {
		"slug": "firmenwebsite-bis-5-seiten",
		"slugs": {
			"de": "firmenwebsite-bis-5-seiten",
			"en": "business-website-up-to-5-pages"
		},
		"title": {
			"de": "Firmenwebsite bis 5 Seiten",
			"en": "Business website up to 5 pages"
		},
		"alt": {
			"de": "Fünf geordnete Seitenkarten als Symbol für eine Firmenwebsite.",
			"en": "Five arranged page cards illustrating a company website."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/firmenwebsite-bis-5-seiten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"landingpage-fuer-ein-angebot": {
		"slug": "landingpage-fuer-ein-angebot",
		"slugs": {
			"de": "landingpage-fuer-ein-angebot",
			"en": "landing-page-for-one-offer"
		},
		"title": {
			"de": "Landingpage für ein Angebot",
			"en": "Landing page for one offer"
		},
		"alt": {
			"de": "Einzelne Angebotskarte mit farbigem Akzent als Symbol für eine Landingpage.",
			"en": "A single offer card with a colour accent illustrating a landing page."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/landingpage-fuer-ein-angebot.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"landing-page-for-one-offer": {
		"slug": "landingpage-fuer-ein-angebot",
		"slugs": {
			"de": "landingpage-fuer-ein-angebot",
			"en": "landing-page-for-one-offer"
		},
		"title": {
			"de": "Landingpage für ein Angebot",
			"en": "Landing page for one offer"
		},
		"alt": {
			"de": "Einzelne Angebotskarte mit farbigem Akzent als Symbol für eine Landingpage.",
			"en": "A single offer card with a colour accent illustrating a landing page."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/landingpage-fuer-ein-angebot.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"zweite-sprache-fuer-ihre-website": {
		"slug": "zweite-sprache-fuer-ihre-website",
		"slugs": {
			"de": "zweite-sprache-fuer-ihre-website",
			"en": "second-language-for-your-website"
		},
		"title": {
			"de": "Zweite Sprache für Ihre Website",
			"en": "Second language for your website"
		},
		"alt": {
			"de": "Zwei gleichwertige Broschüren als Symbol für eine zweisprachige Website.",
			"en": "Two matching booklets illustrating a bilingual website."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/zweite-sprache-fuer-ihre-website.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"second-language-for-your-website": {
		"slug": "zweite-sprache-fuer-ihre-website",
		"slugs": {
			"de": "zweite-sprache-fuer-ihre-website",
			"en": "second-language-for-your-website"
		},
		"title": {
			"de": "Zweite Sprache für Ihre Website",
			"en": "Second language for your website"
		},
		"alt": {
			"de": "Zwei gleichwertige Broschüren als Symbol für eine zweisprachige Website.",
			"en": "Two matching booklets illustrating a bilingual website."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/zweite-sprache-fuer-ihre-website.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"relaunch-konzept": {
		"slug": "relaunch-konzept",
		"slugs": {
			"de": "relaunch-konzept",
			"en": "website-relaunch-plan"
		},
		"title": {
			"de": "Relaunch-Konzept für Ihre Website",
			"en": "Relaunch plan for your website"
		},
		"alt": {
			"de": "Übereinandergelegte Entwurfsbögen als Symbol für ein Website-Relaunch-Konzept.",
			"en": "Layered drafting sheets illustrating a website relaunch plan."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/relaunch-konzept.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-relaunch-plan": {
		"slug": "relaunch-konzept",
		"slugs": {
			"de": "relaunch-konzept",
			"en": "website-relaunch-plan"
		},
		"title": {
			"de": "Relaunch-Konzept für Ihre Website",
			"en": "Relaunch plan for your website"
		},
		"alt": {
			"de": "Übereinandergelegte Entwurfsbögen als Symbol für ein Website-Relaunch-Konzept.",
			"en": "Layered drafting sheets illustrating a website relaunch plan."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/relaunch-konzept.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"kontaktformular-mit-spamschutz": {
		"slug": "kontaktformular-mit-spamschutz",
		"slugs": {
			"de": "kontaktformular-mit-spamschutz",
			"en": "contact-form-with-spam-protection"
		},
		"title": {
			"de": "Kontaktformular mit Spamschutz",
			"en": "Contact form with spam protection"
		},
		"alt": {
			"de": "Formularkarte, Umschlag und Schloss als Symbol für ein geschütztes Kontaktformular.",
			"en": "Form card, envelope and padlock illustrating a protected contact form."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/kontaktformular-mit-spamschutz.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"contact-form-with-spam-protection": {
		"slug": "kontaktformular-mit-spamschutz",
		"slugs": {
			"de": "kontaktformular-mit-spamschutz",
			"en": "contact-form-with-spam-protection"
		},
		"title": {
			"de": "Kontaktformular mit Spamschutz",
			"en": "Contact form with spam protection"
		},
		"alt": {
			"de": "Formularkarte, Umschlag und Schloss als Symbol für ein geschütztes Kontaktformular.",
			"en": "Form card, envelope and padlock illustrating a protected contact form."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/kontaktformular-mit-spamschutz.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"online-terminbuchung-einbinden": {
		"slug": "online-terminbuchung-einbinden",
		"slugs": {
			"de": "online-terminbuchung-einbinden",
			"en": "online-booking-on-your-website"
		},
		"title": {
			"de": "Online-Terminbuchung einbinden",
			"en": "Online booking on your website"
		},
		"alt": {
			"de": "Kalender, Terminmarkierung und Uhr als Symbol für Online-Terminbuchung.",
			"en": "Calendar, appointment marker and clock illustrating online appointment booking."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/online-terminbuchung-einbinden.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"online-booking-on-your-website": {
		"slug": "online-terminbuchung-einbinden",
		"slugs": {
			"de": "online-terminbuchung-einbinden",
			"en": "online-booking-on-your-website"
		},
		"title": {
			"de": "Online-Terminbuchung einbinden",
			"en": "Online booking on your website"
		},
		"alt": {
			"de": "Kalender, Terminmarkierung und Uhr als Symbol für Online-Terminbuchung.",
			"en": "Calendar, appointment marker and clock illustrating online appointment booking."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/online-terminbuchung-einbinden.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"keyword-plan-fuer-ihre-leistungen": {
		"slug": "keyword-plan-fuer-ihre-leistungen",
		"slugs": {
			"de": "keyword-plan-fuer-ihre-leistungen",
			"en": "keyword-plan-for-your-services"
		},
		"title": {
			"de": "Keyword-Plan für Ihre Leistungen",
			"en": "Keyword plan for your services"
		},
		"alt": {
			"de": "Thematisch gruppierte Karten und Lupe als Symbol für einen Keyword-Plan.",
			"en": "Topic cards and magnifying glass illustrating a keyword plan."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/keyword-plan-fuer-ihre-leistungen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"keyword-plan-for-your-services": {
		"slug": "keyword-plan-fuer-ihre-leistungen",
		"slugs": {
			"de": "keyword-plan-fuer-ihre-leistungen",
			"en": "keyword-plan-for-your-services"
		},
		"title": {
			"de": "Keyword-Plan für Ihre Leistungen",
			"en": "Keyword plan for your services"
		},
		"alt": {
			"de": "Thematisch gruppierte Karten und Lupe als Symbol für einen Keyword-Plan.",
			"en": "Topic cards and magnifying glass illustrating a keyword plan."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/keyword-plan-fuer-ihre-leistungen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"ki-sichtbarkeit-geo-verbessern": {
		"slug": "ki-sichtbarkeit-geo-verbessern",
		"slugs": {
			"de": "ki-sichtbarkeit-geo-verbessern",
			"en": "improve-ai-visibility-geo"
		},
		"title": {
			"de": "KI-Sichtbarkeit (GEO) verbessern",
			"en": "Improve AI visibility (GEO)"
		},
		"alt": {
			"de": "Nachschlagewerk und Quellenkarten als Symbol für verständliche Inhalte in KI-Suchdiensten.",
			"en": "Reference book and source cards illustrating clear content for AI search."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/ki-sichtbarkeit-geo-verbessern.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"improve-ai-visibility-geo": {
		"slug": "ki-sichtbarkeit-geo-verbessern",
		"slugs": {
			"de": "ki-sichtbarkeit-geo-verbessern",
			"en": "improve-ai-visibility-geo"
		},
		"title": {
			"de": "KI-Sichtbarkeit (GEO) verbessern",
			"en": "Improve AI visibility (GEO)"
		},
		"alt": {
			"de": "Nachschlagewerk und Quellenkarten als Symbol für verständliche Inhalte in KI-Suchdiensten.",
			"en": "Reference book and source cards illustrating clear content for AI search."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/ki-sichtbarkeit-geo-verbessern.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"technische-seo-grundlagen": {
		"slug": "technische-seo-grundlagen",
		"slugs": {
			"de": "technische-seo-grundlagen",
			"en": "technical-seo-basics"
		},
		"title": {
			"de": "Technische SEO-Grundlagen umsetzen",
			"en": "Technical SEO basics"
		},
		"alt": {
			"de": "Präzise ausgerichtete Bauteile und Prüfwerkzeug als Symbol für technische SEO.",
			"en": "Aligned components and inspection tool illustrating technical SEO."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/technische-seo-grundlagen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"technical-seo-basics": {
		"slug": "technische-seo-grundlagen",
		"slugs": {
			"de": "technische-seo-grundlagen",
			"en": "technical-seo-basics"
		},
		"title": {
			"de": "Technische SEO-Grundlagen umsetzen",
			"en": "Technical SEO basics"
		},
		"alt": {
			"de": "Präzise ausgerichtete Bauteile und Prüfwerkzeug als Symbol für technische SEO.",
			"en": "Aligned components and inspection tool illustrating technical SEO."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/technische-seo-grundlagen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"strukturierte-daten-einbauen": {
		"slug": "strukturierte-daten-einbauen",
		"slugs": {
			"de": "strukturierte-daten-einbauen",
			"en": "add-structured-data"
		},
		"title": {
			"de": "Strukturierte Daten (Schema.org) einbauen",
			"en": "Add structured data (Schema.org)"
		},
		"alt": {
			"de": "Geordnete Hierarchie aus beschriftungsfreien Blöcken als Symbol für strukturierte Daten.",
			"en": "An ordered hierarchy of blank blocks illustrating structured data."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/strukturierte-daten-einbauen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"add-structured-data": {
		"slug": "strukturierte-daten-einbauen",
		"slugs": {
			"de": "strukturierte-daten-einbauen",
			"en": "add-structured-data"
		},
		"title": {
			"de": "Strukturierte Daten (Schema.org) einbauen",
			"en": "Add structured data (Schema.org)"
		},
		"alt": {
			"de": "Geordnete Hierarchie aus beschriftungsfreien Blöcken als Symbol für strukturierte Daten.",
			"en": "An ordered hierarchy of blank blocks illustrating structured data."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/strukturierte-daten-einbauen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"ladezeit-optimieren": {
		"slug": "ladezeit-optimieren",
		"slugs": {
			"de": "ladezeit-optimieren",
			"en": "website-speed-optimisation"
		},
		"title": {
			"de": "Ladezeit optimieren",
			"en": "Website speed optimisation"
		},
		"alt": {
			"de": "Stoppuhr und Laptop als Symbol für die Optimierung der Website-Ladezeit.",
			"en": "Stopwatch and laptop illustrating website loading-time optimisation."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/ladezeit-optimieren.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-speed-optimisation": {
		"slug": "ladezeit-optimieren",
		"slugs": {
			"de": "ladezeit-optimieren",
			"en": "website-speed-optimisation"
		},
		"title": {
			"de": "Ladezeit optimieren",
			"en": "Website speed optimisation"
		},
		"alt": {
			"de": "Stoppuhr und Laptop als Symbol für die Optimierung der Website-Ladezeit.",
			"en": "Stopwatch and laptop illustrating website loading-time optimisation."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/ladezeit-optimieren.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"google-search-console-einrichten": {
		"slug": "google-search-console-einrichten",
		"slugs": {
			"de": "google-search-console-einrichten",
			"en": "google-search-console-setup"
		},
		"title": {
			"de": "Google Search Console einrichten",
			"en": "Google Search Console setup"
		},
		"alt": {
			"de": "Laptop, Lupe und Berichtskarten als Symbol für die Einrichtung einer Suchanalyse.",
			"en": "Laptop, magnifying glass and report cards illustrating search monitoring setup."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/google-search-console-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"google-search-console-setup": {
		"slug": "google-search-console-einrichten",
		"slugs": {
			"de": "google-search-console-einrichten",
			"en": "google-search-console-setup"
		},
		"title": {
			"de": "Google Search Console einrichten",
			"en": "Google Search Console setup"
		},
		"alt": {
			"de": "Laptop, Lupe und Berichtskarten als Symbol für die Einrichtung einer Suchanalyse.",
			"en": "Laptop, magnifying glass and report cards illustrating search monitoring setup."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/google-search-console-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-wartung-12-monate": {
		"slug": "website-wartung-12-monate",
		"slugs": {
			"de": "website-wartung-12-monate",
			"en": "website-maintenance-12-months"
		},
		"title": {
			"de": "Website-Wartung für 12 Monate",
			"en": "Website maintenance for 12 months"
		},
		"alt": {
			"de": "Zwölf Wartungskarten im Jahreskreis als Symbol für zwölf Monate Website-Wartung.",
			"en": "Twelve maintenance cards in a yearly cycle illustrating annual website maintenance."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/website-wartung-12-monate.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-maintenance-12-months": {
		"slug": "website-wartung-12-monate",
		"slugs": {
			"de": "website-wartung-12-monate",
			"en": "website-maintenance-12-months"
		},
		"title": {
			"de": "Website-Wartung für 12 Monate",
			"en": "Website maintenance for 12 months"
		},
		"alt": {
			"de": "Zwölf Wartungskarten im Jahreskreis als Symbol für zwölf Monate Website-Wartung.",
			"en": "Twelve maintenance cards in a yearly cycle illustrating annual website maintenance."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/website-wartung-12-monate.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"externe-dienste-pruefen": {
		"slug": "externe-dienste-pruefen",
		"slugs": {
			"de": "externe-dienste-pruefen",
			"en": "external-services-check"
		},
		"title": {
			"de": "Externe Dienste prüfen",
			"en": "External services check"
		},
		"alt": {
			"de": "Zentrale Mappe, separate Bausteine und Lupe als Symbol für die Prüfung externer Dienste.",
			"en": "Central folder, separate components and magnifying glass illustrating an external-service review."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/externe-dienste-pruefen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"external-services-check": {
		"slug": "externe-dienste-pruefen",
		"slugs": {
			"de": "externe-dienste-pruefen",
			"en": "external-services-check"
		},
		"title": {
			"de": "Externe Dienste prüfen",
			"en": "External services check"
		},
		"alt": {
			"de": "Zentrale Mappe, separate Bausteine und Lupe als Symbol für die Prüfung externer Dienste.",
			"en": "Central folder, separate components and magnifying glass illustrating an external-service review."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/externe-dienste-pruefen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-wartung-3-monate": {
		"slug": "website-wartung-3-monate",
		"slugs": {
			"de": "website-wartung-3-monate",
			"en": "website-maintenance-3-months"
		},
		"title": {
			"de": "Website-Wartung für 3 Monate",
			"en": "Website maintenance for 3 months"
		},
		"alt": {
			"de": "Drei Wartungskarten und Werkzeug als Symbol für drei Monate Website-Wartung.",
			"en": "Three maintenance cards and a tool illustrating three months of website maintenance."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/website-wartung-3-monate.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-maintenance-3-months": {
		"slug": "website-wartung-3-monate",
		"slugs": {
			"de": "website-wartung-3-monate",
			"en": "website-maintenance-3-months"
		},
		"title": {
			"de": "Website-Wartung für 3 Monate",
			"en": "Website maintenance for 3 months"
		},
		"alt": {
			"de": "Drei Wartungskarten und Werkzeug als Symbol für drei Monate Website-Wartung.",
			"en": "Three maintenance cards and a tool illustrating three months of website maintenance."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/website-wartung-3-monate.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"sicherheits-update-wordpress": {
		"slug": "sicherheits-update-wordpress",
		"slugs": {
			"de": "sicherheits-update-wordpress",
			"en": "wordpress-security-update"
		},
		"title": {
			"de": "Sicherheits-Update für WordPress",
			"en": "WordPress security update"
		},
		"alt": {
			"de": "Laptop, Softwarehülle und Werkzeug als Symbol für ein Sicherheits-Update.",
			"en": "Laptop, software case and tool illustrating a security update."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/sicherheits-update-wordpress.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"wordpress-security-update": {
		"slug": "sicherheits-update-wordpress",
		"slugs": {
			"de": "sicherheits-update-wordpress",
			"en": "wordpress-security-update"
		},
		"title": {
			"de": "Sicherheits-Update für WordPress",
			"en": "WordPress security update"
		},
		"alt": {
			"de": "Laptop, Softwarehülle und Werkzeug als Symbol für ein Sicherheits-Update.",
			"en": "Laptop, software case and tool illustrating a security update."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/sicherheits-update-wordpress.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"backup-einrichten-und-testen": {
		"slug": "backup-einrichten-und-testen",
		"slugs": {
			"de": "backup-einrichten-und-testen",
			"en": "website-backup-setup-and-test"
		},
		"title": {
			"de": "Website-Backup einrichten und testen",
			"en": "Website backup setup and test"
		},
		"alt": {
			"de": "Zwei Datenträger und Prüfkarte als Symbol für eingerichtete und getestete Website-Backups.",
			"en": "Two storage drives and a test card illustrating configured and tested website backups."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/backup-einrichten-und-testen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-backup-setup-and-test": {
		"slug": "backup-einrichten-und-testen",
		"slugs": {
			"de": "backup-einrichten-und-testen",
			"en": "website-backup-setup-and-test"
		},
		"title": {
			"de": "Website-Backup einrichten und testen",
			"en": "Website backup setup and test"
		},
		"alt": {
			"de": "Zwei Datenträger und Prüfkarte als Symbol für eingerichtete und getestete Website-Backups.",
			"en": "Two storage drives and a test card illustrating configured and tested website backups."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/backup-einrichten-und-testen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-umzug-zu-neuem-hoster": {
		"slug": "website-umzug-zu-neuem-hoster",
		"slugs": {
			"de": "website-umzug-zu-neuem-hoster",
			"en": "website-move-to-new-host"
		},
		"title": {
			"de": "Website-Umzug zu neuem Hoster",
			"en": "Website move to a new host"
		},
		"alt": {
			"de": "Zwei verbundene Servergehäuse als Symbol für einen Website-Umzug.",
			"en": "Two connected server enclosures illustrating a website migration."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/website-umzug-zu-neuem-hoster.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-move-to-new-host": {
		"slug": "website-umzug-zu-neuem-hoster",
		"slugs": {
			"de": "website-umzug-zu-neuem-hoster",
			"en": "website-move-to-new-host"
		},
		"title": {
			"de": "Website-Umzug zu neuem Hoster",
			"en": "Website move to a new host"
		},
		"alt": {
			"de": "Zwei verbundene Servergehäuse als Symbol für einen Website-Umzug.",
			"en": "Two connected server enclosures illustrating a website migration."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/website-umzug-zu-neuem-hoster.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"gehackte-website-bereinigen": {
		"slug": "gehackte-website-bereinigen",
		"slugs": {
			"de": "gehackte-website-bereinigen",
			"en": "hacked-website-clean-up"
		},
		"title": {
			"de": "Gehackte Website bereinigen",
			"en": "Hacked website clean-up"
		},
		"alt": {
			"de": "Laptop und Wartungswerkzeug als Symbol für die Bereinigung einer gehackten Website.",
			"en": "Laptop and maintenance tools illustrating the cleanup of a compromised website."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/gehackte-website-bereinigen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"hacked-website-clean-up": {
		"slug": "gehackte-website-bereinigen",
		"slugs": {
			"de": "gehackte-website-bereinigen",
			"en": "hacked-website-clean-up"
		},
		"title": {
			"de": "Gehackte Website bereinigen",
			"en": "Hacked website clean-up"
		},
		"alt": {
			"de": "Laptop und Wartungswerkzeug als Symbol für die Bereinigung einer gehackten Website.",
			"en": "Laptop and maintenance tools illustrating the cleanup of a compromised website."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/gehackte-website-bereinigen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"https-umstellung": {
		"slug": "https-umstellung",
		"slugs": {
			"de": "https-umstellung",
			"en": "https-switch-with-ssl"
		},
		"title": {
			"de": "HTTPS-Umstellung mit SSL-Zertifikat",
			"en": "HTTPS switch with SSL certificate"
		},
		"alt": {
			"de": "Schloss und Netzwerkkabel als Symbol für eine verschlüsselte HTTPS-Verbindung.",
			"en": "Padlock and network cable illustrating an encrypted HTTPS connection."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/https-umstellung.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"https-switch-with-ssl": {
		"slug": "https-umstellung",
		"slugs": {
			"de": "https-umstellung",
			"en": "https-switch-with-ssl"
		},
		"title": {
			"de": "HTTPS-Umstellung mit SSL-Zertifikat",
			"en": "HTTPS switch with SSL certificate"
		},
		"alt": {
			"de": "Schloss und Netzwerkkabel als Symbol für eine verschlüsselte HTTPS-Verbindung.",
			"en": "Padlock and network cable illustrating an encrypted HTTPS connection."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/https-umstellung.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"impressum-und-datenschutz-einbinden": {
		"slug": "impressum-und-datenschutz-einbinden",
		"slugs": {
			"de": "impressum-und-datenschutz-einbinden",
			"en": "legal-notice-and-privacy-policy-setup"
		},
		"title": {
			"de": "Impressum und Datenschutzerklärung einbinden",
			"en": "Legal notice and privacy policy setup"
		},
		"alt": {
			"de": "Zwei Dokumentmappen als Symbol für Impressum und Datenschutzerklärung.",
			"en": "Two document folders illustrating legal notice and privacy policy pages."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/impressum-und-datenschutz-einbinden.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"legal-notice-and-privacy-policy-setup": {
		"slug": "impressum-und-datenschutz-einbinden",
		"slugs": {
			"de": "impressum-und-datenschutz-einbinden",
			"en": "legal-notice-and-privacy-policy-setup"
		},
		"title": {
			"de": "Impressum und Datenschutzerklärung einbinden",
			"en": "Legal notice and privacy policy setup"
		},
		"alt": {
			"de": "Zwei Dokumentmappen als Symbol für Impressum und Datenschutzerklärung.",
			"en": "Two document folders illustrating legal notice and privacy policy pages."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/impressum-und-datenschutz-einbinden.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"cookie-banner-einrichten": {
		"slug": "cookie-banner-einrichten",
		"slugs": {
			"de": "cookie-banner-einrichten",
			"en": "cookie-consent-banner-setup"
		},
		"title": {
			"de": "Cookie-Banner einrichten",
			"en": "Cookie consent banner setup"
		},
		"alt": {
			"de": "Drei gleich große Auswahlfelder als Symbol für einen Cookie-Einwilligungsdialog.",
			"en": "Three equally sized choice tiles illustrating a cookie consent dialog."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/cookie-banner-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"cookie-consent-banner-setup": {
		"slug": "cookie-banner-einrichten",
		"slugs": {
			"de": "cookie-banner-einrichten",
			"en": "cookie-consent-banner-setup"
		},
		"title": {
			"de": "Cookie-Banner einrichten",
			"en": "Cookie consent banner setup"
		},
		"alt": {
			"de": "Drei gleich große Auswahlfelder als Symbol für einen Cookie-Einwilligungsdialog.",
			"en": "Three equally sized choice tiles illustrating a cookie consent dialog."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/cookie-banner-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"barrierefreiheits-check-bfsg": {
		"slug": "barrierefreiheits-check-bfsg",
		"slugs": {
			"de": "barrierefreiheits-check-bfsg",
			"en": "accessibility-check"
		},
		"title": {
			"de": "Barrierefreiheits-Check (BFSG)",
			"en": "Accessibility check"
		},
		"alt": {
			"de": "Lupe, kontrastreiche Vorlage und taktile Karte als Symbol für einen Barrierefreiheits-Check.",
			"en": "Magnifier, high-contrast layout and tactile card illustrating an accessibility review."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/barrierefreiheits-check-bfsg.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"accessibility-check": {
		"slug": "barrierefreiheits-check-bfsg",
		"slugs": {
			"de": "barrierefreiheits-check-bfsg",
			"en": "accessibility-check"
		},
		"title": {
			"de": "Barrierefreiheits-Check (BFSG)",
			"en": "Accessibility check"
		},
		"alt": {
			"de": "Lupe, kontrastreiche Vorlage und taktile Karte als Symbol für einen Barrierefreiheits-Check.",
			"en": "Magnifier, high-contrast layout and tactile card illustrating an accessibility review."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/barrierefreiheits-check-bfsg.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"barrierefreiheit-verbessern": {
		"slug": "barrierefreiheit-verbessern",
		"slugs": {
			"de": "barrierefreiheit-verbessern",
			"en": "improve-accessibility"
		},
		"title": {
			"de": "Barrierefreiheit verbessern",
			"en": "Improve accessibility"
		},
		"alt": {
			"de": "Kontrastflächen, taktile Karte und Tastatur als Symbol für bessere digitale Barrierefreiheit.",
			"en": "Contrast swatches, tactile card and keyboard illustrating improved digital accessibility."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/barrierefreiheit-verbessern.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"improve-accessibility": {
		"slug": "barrierefreiheit-verbessern",
		"slugs": {
			"de": "barrierefreiheit-verbessern",
			"en": "improve-accessibility"
		},
		"title": {
			"de": "Barrierefreiheit verbessern",
			"en": "Improve accessibility"
		},
		"alt": {
			"de": "Kontrastflächen, taktile Karte und Tastatur als Symbol für bessere digitale Barrierefreiheit.",
			"en": "Contrast swatches, tactile card and keyboard illustrating improved digital accessibility."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/barrierefreiheit-verbessern.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"google-fonts-lokal-einbinden": {
		"slug": "google-fonts-lokal-einbinden",
		"slugs": {
			"de": "google-fonts-lokal-einbinden",
			"en": "host-google-fonts-locally"
		},
		"title": {
			"de": "Google Fonts lokal einbinden",
			"en": "Host Google Fonts locally"
		},
		"alt": {
			"de": "Druckklötze und lokaler Datenträger als Symbol für lokal eingebundene Schriften.",
			"en": "Printing blocks and local storage illustrating self-hosted fonts."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/google-fonts-lokal-einbinden.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"host-google-fonts-locally": {
		"slug": "google-fonts-lokal-einbinden",
		"slugs": {
			"de": "google-fonts-lokal-einbinden",
			"en": "host-google-fonts-locally"
		},
		"title": {
			"de": "Google Fonts lokal einbinden",
			"en": "Host Google Fonts locally"
		},
		"alt": {
			"de": "Druckklötze und lokaler Datenträger als Symbol für lokal eingebundene Schriften.",
			"en": "Printing blocks and local storage illustrating self-hosted fonts."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/google-fonts-lokal-einbinden.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"erklaerung-zur-barrierefreiheit": {
		"slug": "erklaerung-zur-barrierefreiheit",
		"slugs": {
			"de": "erklaerung-zur-barrierefreiheit",
			"en": "accessibility-statement-setup"
		},
		"title": {
			"de": "Erklärung zur Barrierefreiheit einbinden",
			"en": "Accessibility statement setup"
		},
		"alt": {
			"de": "Dokumentmappe mit taktiler Karte als Symbol für eine Barrierefreiheitserklärung.",
			"en": "Document folder and tactile card illustrating an accessibility statement."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/erklaerung-zur-barrierefreiheit.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"accessibility-statement-setup": {
		"slug": "erklaerung-zur-barrierefreiheit",
		"slugs": {
			"de": "erklaerung-zur-barrierefreiheit",
			"en": "accessibility-statement-setup"
		},
		"title": {
			"de": "Erklärung zur Barrierefreiheit einbinden",
			"en": "Accessibility statement setup"
		},
		"alt": {
			"de": "Dokumentmappe mit taktiler Karte als Symbol für eine Barrierefreiheitserklärung.",
			"en": "Document folder and tactile card illustrating an accessibility statement."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/erklaerung-zur-barrierefreiheit.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"domain-und-e-mail-einrichten": {
		"slug": "domain-und-e-mail-einrichten",
		"slugs": {
			"de": "domain-und-e-mail-einrichten",
			"en": "domain-and-email-setup"
		},
		"title": {
			"de": "Domain und E-Mail einrichten",
			"en": "Domain and email setup"
		},
		"alt": {
			"de": "Umschlag, Adresskarte und Netzwerkgerät als Symbol für Domain und E-Mail.",
			"en": "Envelope, address card and network device illustrating domain and email setup."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/domain-und-e-mail-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"domain-and-email-setup": {
		"slug": "domain-und-e-mail-einrichten",
		"slugs": {
			"de": "domain-und-e-mail-einrichten",
			"en": "domain-and-email-setup"
		},
		"title": {
			"de": "Domain und E-Mail einrichten",
			"en": "Domain and email setup"
		},
		"alt": {
			"de": "Umschlag, Adresskarte und Netzwerkgerät als Symbol für Domain und E-Mail.",
			"en": "Envelope, address card and network device illustrating domain and email setup."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/domain-und-e-mail-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"spf-dkim-dmarc-einrichten": {
		"slug": "spf-dkim-dmarc-einrichten",
		"slugs": {
			"de": "spf-dkim-dmarc-einrichten",
			"en": "spf-dkim-dmarc-setup"
		},
		"title": {
			"de": "SPF, DKIM und DMARC einrichten",
			"en": "SPF, DKIM and DMARC setup"
		},
		"alt": {
			"de": "Drei Umschläge und ein Schloss als Symbol für E-Mail-Authentifizierung.",
			"en": "Three envelopes and a padlock illustrating email authentication."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/spf-dkim-dmarc-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"spf-dkim-dmarc-setup": {
		"slug": "spf-dkim-dmarc-einrichten",
		"slugs": {
			"de": "spf-dkim-dmarc-einrichten",
			"en": "spf-dkim-dmarc-setup"
		},
		"title": {
			"de": "SPF, DKIM und DMARC einrichten",
			"en": "SPF, DKIM and DMARC setup"
		},
		"alt": {
			"de": "Drei Umschläge und ein Schloss als Symbol für E-Mail-Authentifizierung.",
			"en": "Three envelopes and a padlock illustrating email authentication."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/spf-dkim-dmarc-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"e-mail-umzug": {
		"slug": "e-mail-umzug",
		"slugs": {
			"de": "e-mail-umzug",
			"en": "email-migration"
		},
		"title": {
			"de": "E-Mail-Umzug zu neuem Anbieter",
			"en": "Email migration to a new provider"
		},
		"alt": {
			"de": "Umschläge zwischen zwei Ablagen als Symbol für einen E-Mail-Umzug.",
			"en": "Envelopes between two trays illustrating an email migration."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/e-mail-umzug.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"email-migration": {
		"slug": "e-mail-umzug",
		"slugs": {
			"de": "e-mail-umzug",
			"en": "email-migration"
		},
		"title": {
			"de": "E-Mail-Umzug zu neuem Anbieter",
			"en": "Email migration to a new provider"
		},
		"alt": {
			"de": "Umschläge zwischen zwei Ablagen als Symbol für einen E-Mail-Umzug.",
			"en": "Envelopes between two trays illustrating an email migration."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/e-mail-umzug.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"einheitliche-e-mail-signaturen": {
		"slug": "einheitliche-e-mail-signaturen",
		"slugs": {
			"de": "einheitliche-e-mail-signaturen",
			"en": "consistent-email-signatures"
		},
		"title": {
			"de": "Einheitliche E-Mail-Signaturen",
			"en": "Consistent email signatures"
		},
		"alt": {
			"de": "Drei gleich gestaltete Korrespondenzkarten als Symbol für einheitliche E-Mail-Signaturen.",
			"en": "Three consistently designed correspondence cards illustrating uniform email signatures."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/einheitliche-e-mail-signaturen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"consistent-email-signatures": {
		"slug": "einheitliche-e-mail-signaturen",
		"slugs": {
			"de": "einheitliche-e-mail-signaturen",
			"en": "consistent-email-signatures"
		},
		"title": {
			"de": "Einheitliche E-Mail-Signaturen",
			"en": "Consistent email signatures"
		},
		"alt": {
			"de": "Drei gleich gestaltete Korrespondenzkarten als Symbol für einheitliche E-Mail-Signaturen.",
			"en": "Three consistently designed correspondence cards illustrating uniform email signatures."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/einheitliche-e-mail-signaturen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"domain-umzug": {
		"slug": "domain-umzug",
		"slugs": {
			"de": "domain-umzug",
			"en": "domain-transfer"
		},
		"title": {
			"de": "Domain-Umzug zu neuem Anbieter",
			"en": "Domain transfer to a new provider"
		},
		"alt": {
			"de": "Adressplakette zwischen zwei Mappen als Symbol für einen Domain-Umzug.",
			"en": "Address plaque between two folders illustrating a domain transfer."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/domain-umzug.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"domain-transfer": {
		"slug": "domain-umzug",
		"slugs": {
			"de": "domain-umzug",
			"en": "domain-transfer"
		},
		"title": {
			"de": "Domain-Umzug zu neuem Anbieter",
			"en": "Domain transfer to a new provider"
		},
		"alt": {
			"de": "Adressplakette zwischen zwei Mappen als Symbol für einen Domain-Umzug.",
			"en": "Address plaque between two folders illustrating a domain transfer."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/domain-umzug.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"rechnungen-digital-schreiben": {
		"slug": "rechnungen-digital-schreiben",
		"slugs": {
			"de": "rechnungen-digital-schreiben",
			"en": "digital-invoicing-setup"
		},
		"title": {
			"de": "Rechnungen digital schreiben",
			"en": "Digital invoicing setup"
		},
		"alt": {
			"de": "Rechnungsbogen, Rechner und Laptop als Symbol für digitale Rechnungen.",
			"en": "Invoice sheet, calculator and laptop illustrating digital invoicing."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/rechnungen-digital-schreiben.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"digital-invoicing-setup": {
		"slug": "rechnungen-digital-schreiben",
		"slugs": {
			"de": "rechnungen-digital-schreiben",
			"en": "digital-invoicing-setup"
		},
		"title": {
			"de": "Rechnungen digital schreiben",
			"en": "Digital invoicing setup"
		},
		"alt": {
			"de": "Rechnungsbogen, Rechner und Laptop als Symbol für digitale Rechnungen.",
			"en": "Invoice sheet, calculator and laptop illustrating digital invoicing."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/rechnungen-digital-schreiben.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"kundendaten-zusammenfuehren": {
		"slug": "kundendaten-zusammenfuehren",
		"slugs": {
			"de": "kundendaten-zusammenfuehren",
			"en": "customer-data-consolidation"
		},
		"title": {
			"de": "Kundendaten zusammenführen (CRM-Start)",
			"en": "Customer data consolidation (CRM start)"
		},
		"alt": {
			"de": "Kontaktkarten in einer gemeinsamen Kartei als Symbol für zusammengeführte Kundendaten.",
			"en": "Contact cards in a shared index box illustrating consolidated customer data."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/kundendaten-zusammenfuehren.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"customer-data-consolidation": {
		"slug": "kundendaten-zusammenfuehren",
		"slugs": {
			"de": "kundendaten-zusammenfuehren",
			"en": "customer-data-consolidation"
		},
		"title": {
			"de": "Kundendaten zusammenführen (CRM-Start)",
			"en": "Customer data consolidation (CRM start)"
		},
		"alt": {
			"de": "Kontaktkarten in einer gemeinsamen Kartei als Symbol für zusammengeführte Kundendaten.",
			"en": "Contact cards in a shared index box illustrating consolidated customer data."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/kundendaten-zusammenfuehren.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"digitale-ablage-einrichten": {
		"slug": "digitale-ablage-einrichten",
		"slugs": {
			"de": "digitale-ablage-einrichten",
			"en": "digital-filing-system-setup"
		},
		"title": {
			"de": "Digitale Ablage einrichten",
			"en": "Digital filing system setup"
		},
		"alt": {
			"de": "Geordnete Mappen und Datenträger als Symbol für eine digitale Ablage.",
			"en": "Organised folders and storage drive illustrating a digital filing system."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/digitale-ablage-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"digital-filing-system-setup": {
		"slug": "digitale-ablage-einrichten",
		"slugs": {
			"de": "digitale-ablage-einrichten",
			"en": "digital-filing-system-setup"
		},
		"title": {
			"de": "Digitale Ablage einrichten",
			"en": "Digital filing system setup"
		},
		"alt": {
			"de": "Geordnete Mappen und Datenträger als Symbol für eine digitale Ablage.",
			"en": "Organised folders and storage drive illustrating a digital filing system."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/digitale-ablage-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"anfragen-automatisch-als-ticket": {
		"slug": "anfragen-automatisch-als-ticket",
		"slugs": {
			"de": "anfragen-automatisch-als-ticket",
			"en": "enquiries-as-tickets"
		},
		"title": {
			"de": "Anfragen automatisch als Ticket",
			"en": "Enquiries as tickets"
		},
		"alt": {
			"de": "Posteingang und geordnete Aufgabenkarten als Symbol für ein Ticketsystem.",
			"en": "Inbox and arranged task cards illustrating a ticketing system."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/anfragen-automatisch-als-ticket.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"enquiries-as-tickets": {
		"slug": "anfragen-automatisch-als-ticket",
		"slugs": {
			"de": "anfragen-automatisch-als-ticket",
			"en": "enquiries-as-tickets"
		},
		"title": {
			"de": "Anfragen automatisch als Ticket",
			"en": "Enquiries as tickets"
		},
		"alt": {
			"de": "Posteingang und geordnete Aufgabenkarten als Symbol für ein Ticketsystem.",
			"en": "Inbox and arranged task cards illustrating a ticketing system."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/anfragen-automatisch-als-ticket.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"einen-ablauf-automatisieren": {
		"slug": "einen-ablauf-automatisieren",
		"slugs": {
			"de": "einen-ablauf-automatisieren",
			"en": "automate-one-workflow"
		},
		"title": {
			"de": "Einen Arbeitsablauf automatisieren",
			"en": "Automate one workflow"
		},
		"alt": {
			"de": "Zwei verbundene Geräte und eine geordnete Folge als Symbol für einen automatisierten Ablauf.",
			"en": "Two connected devices and an ordered sequence illustrating an automated workflow."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/einen-ablauf-automatisieren.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"automate-one-workflow": {
		"slug": "einen-ablauf-automatisieren",
		"slugs": {
			"de": "einen-ablauf-automatisieren",
			"en": "automate-one-workflow"
		},
		"title": {
			"de": "Einen Arbeitsablauf automatisieren",
			"en": "Automate one workflow"
		},
		"alt": {
			"de": "Zwei verbundene Geräte und eine geordnete Folge als Symbol für einen automatisierten Ablauf.",
			"en": "Two connected devices and an ordered sequence illustrating an automated workflow."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/einen-ablauf-automatisieren.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"passwortmanager-fuer-das-team": {
		"slug": "passwortmanager-fuer-das-team",
		"slugs": {
			"de": "passwortmanager-fuer-das-team",
			"en": "password-manager-for-your-team"
		},
		"title": {
			"de": "Passwortmanager für das Team",
			"en": "Password manager for your team"
		},
		"alt": {
			"de": "Fünf Sicherheitsschlüssel in einem geordneten Tresor als Symbol für einen Team-Passwortmanager.",
			"en": "Five security keys in an organised vault illustrating a team password manager."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/passwortmanager-fuer-das-team.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"password-manager-for-your-team": {
		"slug": "passwortmanager-fuer-das-team",
		"slugs": {
			"de": "passwortmanager-fuer-das-team",
			"en": "password-manager-for-your-team"
		},
		"title": {
			"de": "Passwortmanager für das Team",
			"en": "Password manager for your team"
		},
		"alt": {
			"de": "Fünf Sicherheitsschlüssel in einem geordneten Tresor als Symbol für einen Team-Passwortmanager.",
			"en": "Five security keys in an organised vault illustrating a team password manager."
		},
		"width": 1440,
		"height": 960,
		"src": "/images/products/passwortmanager-fuer-das-team.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	}
};
var productImage = (slug) => productImageCatalog[slug];
var origin = "https://shop.tracht-digital.de";
function withProductImage(product) {
	const image = productImage(product.slug);
	const own = product.offers.some((o) => o.kind === "own");
	const existing = product.imageUrl;
	const generic = !existing || /^https:\/\/tracht-digital\.de\/images\/services\//.test(existing);
	return image && own && generic ? {
		...product,
		imageUrl: origin + image.src
	} : product;
}
function productImageAttributes(product, lang, detail = false) {
	const image = productImage(product.slug);
	if (!image || product.imageUrl !== origin + image.src) return void 0;
	return {
		alt: image.alt[lang],
		width: image.width,
		height: image.height,
		srcSet: productImageSrcset(image.src),
		sizes: detail ? "(min-width: 64rem) 60vw, 100vw" : "(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw",
		loading: detail ? "eager" : "lazy",
		decoding: "async"
	};
}
function productImageSrcset(src, format = "webp") {
	return [
		480,
		960,
		1440
	].map((w) => `${origin}${src.replace(".webp", (w === 1440 ? "" : "-" + w) + "." + format)} ${w}w`).join(", ");
}
// node_modules/@tracht-digital-solutions/tds-shared/dist/chunk-N6TATNUU.js
var PORTAL_PERMISSIONS = [
	"projects:read",
	"invoices:read",
	"invoices:pay",
	"documents:read",
	"documents:write",
	"messages:read",
	"messages:write",
	"tickets:read",
	"tickets:write"
];
var PERMISSION_KEY_PATTERN = /^[a-z0-9][a-z0-9-]{0,31}:[a-z0-9][a-z0-9-]{0,31}$/;
[...PORTAL_PERMISSIONS], PORTAL_PERMISSIONS.filter((p) => p.endsWith(":read"));
// node_modules/@tracht-digital-solutions/tds-shared/dist/schemas/index.js
var HeadingBlock = object({
	type: literal("heading"),
	level: union([literal(2), literal(3)]),
	text: string().max(300)
});
var ParagraphBlock = object({
	type: literal("paragraph"),
	text: string().max(5e3)
});
var ListBlock = object({
	type: literal("list"),
	ordered: boolean(),
	items: array(string().max(2e3)).max(100)
});
var QuoteBlock = object({
	type: literal("quote"),
	text: string().max(2e3),
	cite: string().max(200).optional().nullable()
});
var CodeBlock = object({
	type: literal("code"),
	lang: string().max(30),
	code: string().max(2e4)
});
var ImageBlock = object({
	type: literal("image"),
	url: string().max(600),
	alt: string().max(300),
	caption: string().max(300).optional().nullable()
});
var DividerBlock = object({ type: literal("divider") });
var CalloutBlock = object({
	type: literal("callout"),
	variant: _enum([
		"info",
		"warn",
		"tip"
	]),
	text: string().max(3e3)
});
var ButtonBlock = object({
	type: literal("button"),
	label: string().max(120),
	href: string().max(600),
	style: _enum(["primary", "ghost"])
});
var VideoBlock = object({
	type: literal("video"),
	provider: _enum(["youtube", "vimeo"]),
	url: string().max(600)
});
var AdsenseBlock = object({
	type: literal("adsense"),
	placement: literal("inline"),
	slot: string().max(60).optional().nullable()
});
var CustomBlock = object({
	type: literal("custom"),
	snippetId: number().int().positive()
});
var ProductBlock = object({
	type: literal("product"),
	slug: string().max(120),
	/** `card` = full product card, `inline` = one compact row, `list` = card + all offers. */
	variant: _enum([
		"card",
		"inline",
		"list"
	])
});
var BlogBlockSchema = discriminatedUnion("type", [
	HeadingBlock,
	ParagraphBlock,
	ListBlock,
	QuoteBlock,
	CodeBlock,
	ImageBlock,
	DividerBlock,
	CalloutBlock,
	ButtonBlock,
	VideoBlock,
	AdsenseBlock,
	CustomBlock,
	ProductBlock
]);
object({
	version: literal(1),
	blocks: array(BlogBlockSchema).min(1).max(400)
});
var ALLOWED_SCHEMES = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function isSafeHref(value) {
	const trimmed = value.trim();
	if (trimmed === "") return false;
	let url;
	try {
		url = new URL(trimmed);
	} catch {
		return false;
	}
	return ALLOWED_SCHEMES.includes(url.protocol);
}
var SafeHref = string().max(600).refine((v) => v.trim() === "" || isSafeHref(v), { message: "href" });
var LinkItem = object({
	label: string().max(120),
	href: SafeHref,
	/** One short line under the label, e.g. "Mo–Fr, 8–17 Uhr". */
	note: string().max(160).optional().nullable(),
	/**
	* Which glyph the renderer draws. A closed vocabulary, not a free string:
	* an icon name the renderer does not know renders as nothing at all, and the
	* editor should not be able to produce that state.
	*/
	icon: _enum([
		"link",
		"phone",
		"mail",
		"map",
		"calendar",
		"download",
		"shop",
		"chat"
	]).optional().nullable()
});
var LinksBlock = object({
	type: literal("links"),
	/** Optional heading above the group. */
	label: string().max(120).optional().nullable(),
	items: array(LinkItem).max(30)
});
var HeadingBlock2 = object({
	type: literal("heading"),
	text: string().max(160)
});
var TextBlock = object({
	type: literal("text"),
	text: string().max(2e3)
});
var DividerBlock2 = object({ type: literal("divider") });
var HoursRow = object({
	/** "Mo–Do" — free text, because business reality does not fit an enum. */
	days: string().max(60),
	/** "08:00–17:00" or "geschlossen". */
	time: string().max(60)
});
var HoursBlock = object({
	type: literal("hours"),
	label: string().max(120).optional().nullable(),
	rows: array(HoursRow).max(14)
});
var SocialItem = object({
	network: _enum([
		"linkedin",
		"xing",
		"instagram",
		"facebook",
		"youtube",
		"github",
		"whatsapp",
		"website"
	]),
	href: SafeHref
});
var SocialsBlock = object({
	type: literal("socials"),
	items: array(SocialItem).max(12)
});
var CardBlockSchema = discriminatedUnion("type", [
	LinksBlock,
	HeadingBlock2,
	TextBlock,
	HoursBlock,
	SocialsBlock,
	DividerBlock2
]);
object({
	version: literal(1),
	blocks: array(CardBlockSchema).max(60)
});
var ShopOfferSchema = object({
	id: number().int().positive(),
	kind: _enum(["own", "affiliate"]),
	network: _enum([
		"amazon",
		"awin",
		"belboon",
		"digistore",
		"direct"
	]),
	/** Merchant-facing label ("Amazon", "Hetzner"), already localised by the API. */
	merchant: string().max(120),
	/** The outbound URL, affiliate tag already appended by the API. */
	url: string().max(1e3),
	/** Net-of-nothing gross price in minor units; null when we have no quote. */
	priceCents: number().int().nonnegative().nullable(),
	currency: string().length(3).default("EUR"),
	/**
	* When {@link priceCents} was last confirmed, ISO-8601. Null means "never
	* fetched" — which is not the same as a stale price and renders differently:
	* a never-fetched offer simply shows no price, a stale one shows why.
	*/
	priceCheckedAt: string().datetime({ offset: true }).nullable(),
	availability: _enum([
		"in_stock",
		"out_of_stock",
		"unknown"
	]).default("unknown"),
	position: number().int().nonnegative().default(0)
});
var ShopProductRefSchema = object({
	slug: string().max(120),
	lang: _enum(["de", "en"]),
	title: string().max(200),
	teaser: string().max(400),
	category: string().max(60),
	imageUrl: string().max(1e3).nullable(),
	/** Absolute URL of the product page on the shop site. */
	url: string().max(1e3),
	offers: array(ShopOfferSchema).max(20).default([])
});
ShopProductRefSchema.extend({
	/** Blocks JSON or markdown, same dual format as a blog post body. */
	body: string(),
	bodyFormat: _enum(["markdown", "blocks"]).default("blocks"),
	tags: array(string().max(60)).max(20).default([]),
	metaDescription: string().max(300).nullable(),
	publishedAt: string().datetime({ offset: true }).nullable(),
	updatedAt: string().datetime({ offset: true }).nullable(),
	machineTranslated: boolean().default(false)
});
object({
	key: string().max(60),
	/** Heading shown above the slot, already localised. Null renders no heading. */
	heading: string().max(120).nullable(),
	/**
	* The legally required advertising label ("Anzeige" / "Advertisement").
	*
	* Served rather than hard-coded so the label is right in both languages and
	* cannot be forgotten by a consumer — see `ProductCard`, which refuses to
	* render an affiliate offer without one.
	*/
	label: string().max(60),
	products: array(ShopProductRefSchema).max(12).default([])
});
function emptyPlacement(key, lang = "de") {
	return {
		key,
		heading: null,
		label: lang === "de" ? "Anzeige" : "Advertisement",
		products: []
	};
}
object({
	name: string().min(2, "name"),
	email: string().email("email"),
	company: string().optional(),
	subject: string().max(200).optional(),
	message: string().min(20, "message"),
	consent: literal(true, { error: () => ({ message: "consent" }) }),
	website: string().max(0).optional()
});
object({
	slug: string().min(3).max(120).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only."),
	lang: _enum(["de", "en"]).default("de"),
	category: string().min(2).max(40),
	title: string().min(4).max(200),
	excerpt: string().min(10).max(400),
	body: string().min(20),
	/** Storage format of `body`. `markdown` keeps the legacy single-string path. */
	bodyFormat: _enum(["markdown", "blocks"]).default("markdown"),
	coverHint: string().max(400).optional().nullable(),
	publishedAt: date().optional().nullable(),
	draft: boolean().default(false),
	/** Per-post ad rendering mode (blog only). Mirrors the PHP validator. */
	adsMode: _enum([
		"default",
		"off",
		"auto",
		"manual"
	]).default("default"),
	/**
	* auth-api `app_user.id` of the author. Admins may set any eligible author;
	* for a non-admin blog author the server forces it to themselves. Null /
	* omitted leaves the post unassigned. The PHP validator mirrors this.
	*/
	authorId: number().int().positive().optional().nullable()
});
object({
	name: string().min(1).max(200),
	slug: string().min(1).max(120).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only."),
	avatarUrl: string().max(500).optional().nullable(),
	bio: string().max(500).optional().nullable(),
	active: boolean().default(true)
});
object({
	email: string().email().optional(),
	password: string().min(1).optional(),
	token: string().min(1).optional()
});
_enum(PORTAL_PERMISSIONS);
var PermissionKeySchema = string().regex(PERMISSION_KEY_PATTERN, "expected <resource>:<action>");
var MembershipSchema = object({
	companyId: number().int().positive().optional(),
	/** @deprecated legacy name for `companyId`; removed in the follow-up release. */
	customerId: number().int().positive().optional(),
	permissions: array(PermissionKeySchema).max(128).default([]),
	/** Ids of the groups assigned to this user IN this company. */
	groupIds: array(number().int().positive()).default([]),
	/** Whether this membership may manage the company's own users. */
	isCompanyAdmin: boolean().default(false),
	/**
	* The most this membership may ever be granted, `null` = inherit the
	* company policy. Platform-admin only — a company admin cannot raise it.
	*/
	permissionCeiling: array(PermissionKeySchema).nullish(),
	/**
	* Rights withheld from THIS person even where an assigned group grants
	* them — the per-person override of the group's decision.
	*
	* Not the same field as `permissionCeiling`, and the difference is easy to
	* lose: the ceiling is the platform admin's limit on what a company admin
	* may ever hand out; this is the ordinary decision about one person, which
	* a company admin owns. A right can be inside the ceiling and denied; it
	* cannot be outside the ceiling and granted.
	*
	* Unlike the ceiling there is no null/empty distinction — an empty deny
	* list and no deny list say the same thing — so this defaults to `[]`
	* rather than being nullish.
	*/
	permissionDenies: array(PermissionKeySchema).max(128).default([])
}).refine((m) => m.companyId !== void 0 || m.customerId !== void 0, { message: "companyId is required" }).transform((m) => ({
	...m,
	companyId: m.companyId ?? m.customerId
}));
object({
	email: string().email(),
	name: string().min(1).max(200).optional().nullable(),
	password: string().min(12).optional(),
	isAdmin: boolean().default(false),
	isSupportAgent: boolean().default(false),
	/** Grants blog-authoring access (see `AppUser.isBlogAuthor`). */
	isBlogAuthor: boolean().default(false),
	/** Author bio shown on the public blog author page. */
	bio: string().max(500).optional().nullable(),
	memberships: array(MembershipSchema).optional(),
	/** @deprecated use `memberships` — kept as a single-company fallback. */
	customerId: number().int().positive().optional().nullable(),
	/** @deprecated use `memberships`. */
	permissions: array(PermissionKeySchema).max(128).default([]),
	status: _enum(["active", "disabled"]).default("active")
});
object({
	email: string().email().optional(),
	name: string().min(1).max(200).optional().nullable(),
	isAdmin: boolean().optional(),
	isSupportAgent: boolean().optional(),
	/** Grants blog-authoring access (see `AppUser.isBlogAuthor`). */
	isBlogAuthor: boolean().optional(),
	/** Author bio shown on the public blog author page. */
	bio: string().max(500).optional().nullable(),
	memberships: array(MembershipSchema).optional(),
	/** @deprecated use `memberships`. */
	customerId: number().int().positive().optional().nullable(),
	/** @deprecated use `memberships`. */
	permissions: array(PermissionKeySchema).max(128).optional(),
	status: _enum(["active", "disabled"]).optional()
});
var TICKET_PRIORITIES = [
	"low",
	"normal",
	"high",
	"urgent"
];
var TICKET_TYPES = [
	"question",
	"bug",
	"feature",
	"other"
];
var TicketPrioritySchema = _enum(TICKET_PRIORITIES);
var TicketTypeSchema = _enum(TICKET_TYPES);
object({
	subject: string().min(3).max(200),
	description: string().min(10).max(1e4),
	priority: TicketPrioritySchema.default("normal"),
	type: TicketTypeSchema.default("question"),
	projectId: number().int().positive().optional().nullable()
});
object({
	body: string().min(1).max(1e4),
	isInternal: boolean().default(false)
});
// src/lib/shop-api.ts
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
function read(path, fallback, label) {
	return memoisedOr(`shop:${path}`, () => readContentJson(`${contentApiBase()}${path}`), fallback, `shop ${label} (rendering nothing)`);
}
/** One product for an inline block. Null when it does not exist or is unreachable. */
function getShopProduct(slug, lang) {
	return read(`/shop/${encodeURIComponent(slug)}?lang=${lang}`, null, `product ${slug}`);
}
/**
* A resolved advertising slot.
*
* `category` passes the article's own category so an automatic slot can match
* the piece it sits in — the API treats the caller's context as the more
* specific signal and prefers it over the placement's stored selector.
*/
function getShopPlacement(key, lang, category) {
	const params = new URLSearchParams({ lang });
	if (category) params.set("category", category);
	return read(`/shop/placement/${encodeURIComponent(key)}?${params}`, emptyPlacement(key, lang), `placement ${key}`);
}
/**
* Point an offer's link at the shop's click redirect with this surface's
* attribution.
*
* `offer.url` already IS the redirect — the API builds it — so this only adds
* the query. Never rebuild the URL here: the partner tag belongs in one
* database row, not in the journal.
*/
function attributeOffers(product, lang, placement) {
	return {
		...product,
		offers: product.offers.map((offer) => {
			const params = new URLSearchParams({
				source: "blog",
				lang
			});
			if (placement) params.set("placement", placement);
			return {
				...offer,
				url: `${offer.url}?${params}`
			};
		})
	};
}
// src/components/ProductSlot.astro
createAstro("https://blog.tracht-digital.de");
var $$ProductSlot = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ProductSlot;
	const { slotKey, lang = "de", category, layout = "strip", class: className } = Astro.props;
	const placement = await getShopPlacement(slotKey, lang, category);
	const products = placement.products.map(withProductImage).map((product) => attributeOffers({
		...product,
		offers: product.offers.map((offer) => ({
			...offer,
			priceCents: null,
			priceCheckedAt: null
		}))
	}, lang, slotKey));
	return renderTemplate`${products.length > 0 ? renderTemplate`${maybeRenderHead($$result)}<aside${addAttribute(["tds-product-slot jnl-panel jnl-tone-sand", className], "class:list")}${addAttribute(placement.label, "aria-label")} data-astro-cid-vg5rydmf><p class="tds-product-slot__label" data-astro-cid-vg5rydmf>${placement.label}</p>${placement.heading ? renderTemplate`<h2 class="tds-product-slot__title" data-astro-cid-vg5rydmf>${placement.heading}</h2>` : null}<div${addAttribute(layout === "strip" ? "tds-product-strip" : "", "class")} data-astro-cid-vg5rydmf>${products.map((product) => renderTemplate`${renderComponent($$result, "ProductCard", ProductCard, {
		"image": productImageAttributes(product, lang),
		"product": product,
		"lang": lang,
		"variant": layout === "single" ? "card" : "card",
		"data-astro-cid-vg5rydmf": true
	})}`)}</div></aside>` : null}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/ProductSlot.astro", void 0);
// src/components/AdSlot.astro
createAstro("https://blog.tracht-digital.de");
var $$AdSlot = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$AdSlot;
	const { client, slot, lang = "de" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<aside class="tds-adslot"${addAttribute(lang === "de" ? "Werbung" : "Advertisement", "aria-label")} data-astro-cid-ygkiugat><span class="tds-adslot__label" data-astro-cid-ygkiugat>${lang === "de" ? "Anzeige" : "Advertisement"}</span><ins class="adsbygoogle" style="display:block"${addAttribute(client, "data-ad-client")}${addAttribute(slot, "data-ad-slot")} data-ad-format="auto" data-full-width-responsive="true" data-astro-cid-ygkiugat></ins><script>
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  <\/script></aside>`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/AdSlot.astro", void 0);
// src/components/ProductEmbed.astro
createAstro("https://blog.tracht-digital.de");
var $$ProductEmbed = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ProductEmbed;
	const { slug, variant, lang = "de" } = Astro.props;
	const fetched = await getShopProduct(slug, lang);
	const product = fetched ? withProductImage(fetched) : null;
	const shown = product ? attributeOffers({
		...product,
		offers: product.offers.map((offer) => ({
			...offer,
			priceCents: null,
			priceCheckedAt: null
		}))
	}, lang, "blog-inline") : null;
	return renderTemplate`${shown ? renderTemplate`${maybeRenderHead($$result)}<div class="tds-block-product" data-astro-cid-jv3m5vhh>${renderComponent($$result, "ProductCard", ProductCard, {
		"image": productImageAttributes(shown, lang),
		"product": shown,
		"lang": lang,
		"variant": variant,
		"data-astro-cid-jv3m5vhh": true
	})}</div>` : null}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/ProductEmbed.astro", void 0);
// src/components/BlockRenderer.astro
createAstro("https://blog.tracht-digital.de");
var $$BlockRenderer = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BlockRenderer;
	const { blocks, ads = null, showAds = false, lang = "de", snippets = [], dropCap = false } = Astro.props;
	const parts = [];
	let buf = "";
	const flush = () => {
		if (buf.trim() !== "") parts.push({
			kind: "prose",
			html: buf
		});
		buf = "";
	};
	for (const block of blocks) {
		if (block.type === "adsense") {
			flush();
			parts.push({
				kind: "ad",
				slot: block.slot ?? null
			});
			continue;
		}
		if (block.type === "product") {
			flush();
			if (block.slug.trim() !== "") parts.push({
				kind: "product",
				slug: block.slug,
				variant: block.variant
			});
			continue;
		}
		if (block.type === "custom") {
			const s = snippets.find((x) => x.id === block.snippetId);
			if (!s) continue;
			if (s.kind === "embed" && typeof s.definition.html === "string") {
				flush();
				parts.push({
					kind: "raw",
					html: s.definition.html
				});
			} else if (s.kind === "preset" && typeof s.definition.type === "string") buf += await renderBlockHtml(s.definition);
			continue;
		}
		buf += await renderBlockHtml(block);
	}
	flush();
	const firstProse = parts.findIndex((p) => p.kind === "prose");
	return renderTemplate`${parts.map((part, i) => part.kind === "prose" ? renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["tds-prose", dropCap && i === firstProse && "drop-cap"], "class:list")}>${unescapeHTML(part.html)}</div>` : part.kind === "product" ? renderTemplate`${renderComponent($$result, "ProductEmbed", $$ProductEmbed, {
		"slug": part.slug,
		"variant": part.variant,
		"lang": lang
	})}` : part.kind === "raw" ? renderTemplate`<div class="tds-block-embed">${unescapeHTML(part.html)}</div>` : showAds && ads?.publisherId ? renderTemplate`${renderComponent($$result, "AdSlot", $$AdSlot, {
		"client": ads.publisherId,
		"slot": part.slot ?? ads.slotInArticle ?? "",
		"lang": lang
	})}` : null)}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/BlockRenderer.astro", void 0);
// src/lib/articleFaq.ts
var FAQ_HEADING = /^(häufige fragen|fragen und antworten|faq|frequently asked questions|common questions)$/i;
var text = (html) => html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
/** Questions and answers from the article's FAQ section, if it has one. */
function faqFromSections(sections) {
	const section = sections.find((s) => FAQ_HEADING.test(s.heading.trim()));
	if (!section) return [];
	const out = [];
	const pieces = section.html.split(/<h3\b[^>]*>/i).slice(1);
	for (const piece of pieces) {
		const end = piece.search(/<\/h3>/i);
		if (end < 0) continue;
		const q = text(piece.slice(0, end));
		const a = text(piece.slice(end + 5));
		if (q !== "" && a !== "") out.push({
			q,
			a
		});
	}
	return out;
}
// src/lib/sections.ts
function slugify(text) {
	return text.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64) || "abschnitt";
}
function stripTags(html) {
	return html.replace(/<[^>]+>/g, "").trim();
}
function splitSections(html) {
	const matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)];
	if (matches.length === 0) return {
		intro: html,
		sections: []
	};
	const intro = html.slice(0, matches[0].index);
	const sections = [];
	const seen = /* @__PURE__ */ new Set();
	matches.forEach((m, i) => {
		const heading = stripTags(m[1]);
		let id = slugify(heading);
		while (seen.has(id)) id = `${id}-${i}`;
		seen.add(id);
		const bodyStart = (m.index ?? 0) + m[0].length;
		const bodyEnd = i + 1 < matches.length ? matches[i + 1].index : html.length;
		sections.push({
			id,
			heading,
			html: html.slice(bodyStart, bodyEnd)
		});
	});
	return {
		intro,
		sections
	};
}
// src/lib/blockSections.ts
function splitBlockSections(blocks) {
	const intro = [];
	const sections = [];
	const seen = /* @__PURE__ */ new Set();
	let current = null;
	for (const block of blocks) {
		if (block.type === "heading" && block.level === 2) {
			let id = slugify$1(block.text);
			while (seen.has(id)) id = `${id}-${sections.length}`;
			seen.add(id);
			current = {
				id,
				heading: block.text,
				blocks: []
			};
			sections.push(current);
			continue;
		}
		if (current) current.blocks.push(block);
		else intro.push(block);
	}
	return {
		intro,
		sections
	};
}
// src/components/Article.astro
createAstro("https://blog.tracht-digital.de");
var $$Article = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Article;
	const { localized, lang, posts } = Astro.props;
	const { post, bodyHtml, blocks, translated } = localized;
	const isBlocks = blocks != null;
	const snippets = isBlocks ? await blogSnippets() : [];
	const ads = await adsConfig();
	const adsMode = effectiveAdsMode(post.adsMode, ads);
	const showManualAds = adsMode === "manual" && !isBlocks;
	const showBlockAds = adsMode !== "off";
	const pfx = lang === "en" ? "/en" : "";
	const postHref = (slug) => `${pfx}/${slug}`;
	const mdSplit = isBlocks ? {
		intro: "",
		sections: []
	} : splitSections(bodyHtml);
	const blkSplit = isBlocks ? splitBlockSections(blocks) : {
		intro: [],
		sections: []
	};
	const sections = isBlocks ? blkSplit.sections.map((s) => ({
		id: s.id,
		heading: s.heading
	})) : mdSplit.sections.map((s) => ({
		id: s.id,
		heading: s.heading
	}));
	const intro = mdSplit.intro;
	const introParts = splitProductShortcodes(intro);
	const sectionParts = mdSplit.sections.map((sec) => ({
		...sec,
		parts: splitProductShortcodes(sec.html)
	}));
	const faq = isBlocks ? [] : faqFromSections(mdSplit.sections);
	const showToc = sections.length >= 2;
	const ordered = [...posts].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
	const orderedIdx = ordered.findIndex((p) => p.slug === post.slug);
	const newerPost = orderedIdx > 0 ? ordered[orderedIdx - 1] : null;
	const olderPost = orderedIdx >= 0 && orderedIdx < ordered.length - 1 ? ordered[orderedIdx + 1] : null;
	const interestTopics = Array.from(new Set([post.category, ...(post.tags ?? "").split(",")].map((t) => t.trim().toLowerCase()).filter(Boolean)));
	const explicitCover = post.coverHint?.startsWith("http") ? post.coverHint : void 0;
	const dateLabel = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : null;
	const plain = isBlocks ? blocks.map((b) => {
		if (b.type === "paragraph" || b.type === "heading" || b.type === "quote" || b.type === "callout") return b.text;
		if (b.type === "list") return b.items.join(" ");
		if (b.type === "code") return b.code;
		return "";
	}).join(" ") : stripProductShortcodes(bodyHtml).replace(/<[^>]+>/g, " ");
	const wordCount = plain.split(/\s+/).filter(Boolean).length;
	const readingMinutes = Math.max(1, Math.round(wordCount / 220));
	const citations = Array.from(new Set([...isBlocks ? blocks.flatMap((b) => b.type === "button" && b.href ? [b.href] : []) : [...bodyHtml.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1])].filter((href) => {
		try {
			return !new URL(href).hostname.endsWith("tracht-digital.de");
		} catch {
			return false;
		}
	}))).slice(0, 10);
	const updatedLabel = post.updatedAt && post.publishedAt && Date.parse(post.updatedAt) > Date.parse(post.publishedAt) ? new Date(post.updatedAt).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : null;
	const ogImagePath = explicitCover ?? `/og/${lang}/${post.slug}.png`;
	const imageUrl = ogImagePath.startsWith("http") ? ogImagePath : new URL(ogImagePath, siteConfig.url).toString();
	const journalLabel = "Ratgeber";
	const journalHomeUrl = `${siteConfig.url}${pfx}/`;
	const postUrl = new URL(postHref(post.slug), siteConfig.url).toString();
	const contactUrl = `https://tracht-digital.de${pfx}/#contact`;
	const metaDesc = postDescription(post.metaDescription, post.excerpt, lang);
	const tx = lang === "de" ? {
		back: "Alle Beiträge",
		read: "Min. Lesezeit",
		updated: "aktualisiert",
		contents: "Inhalt",
		tocCollapse: "Inhalt einklappen",
		tocExpand: "Inhalt ausklappen",
		aboutAuthor: "Über den Autor",
		owner: "Inhaber, Tracht Digital Solutions",
		bio: "Entwickelt Software, Websites und Digitalisierungslösungen für kleine und mittlere Unternehmen — ansässig in Schwarzenbek bei Hamburg.",
		newer: "Neuerer Artikel",
		older: "Älterer Artikel",
		nav: "Artikel-Navigation",
		allArticles: "Alle Artikel",
		rss: "RSS abonnieren",
		print: "Drucken",
		tools: "Lesewerkzeuge",
		zoomIn: "Text vergrößern",
		zoomOut: "Text verkleinern",
		focus: "Fokusmodus",
		focusTitle: "Fokusmodus (Taste F)",
		machine: "Automatisch übersetzt — das Original ist auf Englisch verfasst.",
		contactHead: "Zusammenarbeiten",
		contactLead: "Ich baue Websites, Webshops und individuelle Lösungen für Selbstständige, kleine Unternehmen und lokale Betriebe — aus Schwarzenbek bei Hamburg.",
		contactCta: "Unverbindlich anfragen"
	} : {
		back: "All posts",
		read: "min read",
		updated: "updated",
		contents: "Contents",
		tocCollapse: "Collapse contents",
		tocExpand: "Expand contents",
		aboutAuthor: "About the author",
		owner: "Owner, Tracht Digital Solutions",
		bio: "Builds software, websites and digitalization solutions for small and medium-sized businesses — based in Schwarzenbek near Hamburg.",
		newer: "Newer article",
		older: "Older article",
		nav: "Article navigation",
		allArticles: "All articles",
		rss: "Subscribe via RSS",
		print: "Print",
		tools: "Reading tools",
		zoomIn: "Larger text",
		zoomOut: "Smaller text",
		focus: "Focus mode",
		focusTitle: "Focus mode (press F)",
		machine: "Machine-translated — the original is written in German.",
		contactHead: "Work together",
		contactLead: "I build websites, online shops and custom solutions for freelancers, small companies and local businesses — from Schwarzenbek near Hamburg.",
		contactCta: "Get in touch"
	};
	const author = post.author ?? null;
	const authorName = author?.name ?? (lang === "de" ? "Tracht Digital Redaktion" : "Tracht Digital Editorial");
	const authorPageHref = author ? authorHref(lang, author.slug) : null;
	const authorAvatar = author?.avatarUrl ?? null;
	const authorBio = author?.bio ?? tx.bio;
	const authorInitials = authorName.split(/\s+/).map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase() || "TD";
	const jsonLd = [
		blogPostingSchema({
			slug: post.slug,
			title: post.title,
			excerpt: metaDesc,
			body: plain,
			category: post.category,
			publishedAt: post.publishedAt,
			updatedAt: post.updatedAt ?? null,
			lang,
			imageUrl,
			wordCount,
			readingMinutes,
			citations,
			author: author ? {
				name: author.name,
				url: authorPageHref ? new URL(authorPageHref, siteConfig.url).toString() : null
			} : null,
			tags: post.tags
		}),
		organizationSchema(),
		breadcrumbSchema([
			{
				name: journalLabel,
				url: journalHomeUrl
			},
			{
				name: post.category,
				url: new URL(categoryHref(lang, categorySlug(post.category)), siteConfig.url).toString()
			},
			{
				name: post.title,
				url: postUrl
			}
		]),
		...faq.length > 0 ? [faqPageSchema(faq)] : []
	];
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": pageTitle(post.title),
		"description": metaDesc,
		"lang": lang,
		"ogImage": explicitCover,
		"article": {
			publishedTime: post.publishedAt,
			modifiedTime: post.updatedAt,
			author: authorName,
			section: post.category,
			slug: post.slug
		},
		"jsonLd": jsonLd,
		"sidebar": true,
		"focusable": true,
		"adsMode": adsMode,
		"reader": { printHref: `${pfx}/${post.slug}/print` },
		"hasToc": showToc
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div id="reading-progress" class="fixed top-0 left-0 right-0 z-50 h-[3px] origin-left scale-x-0 bg-[var(--color-accent)]" aria-hidden="true"></div><main id="main"${addAttribute(["article-shell px-5 sm:px-6 md:px-8 py-10 lg:py-12", showToc && "has-toc"], "class:list")}>${showToc && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<nav class="toc"${addAttribute(tx.contents, "aria-label")} id="article-toc"><div class="toc-head"><p class="eyebrow toc-title">${tx.contents}</p><button type="button" class="toc-toggle" id="toc-toggle" aria-expanded="true" aria-controls="article-toc"${addAttribute(tx.tocCollapse, "title")}${addAttribute(tx.tocCollapse, "aria-label")}${addAttribute(tx.tocCollapse, "data-label-collapse")}${addAttribute(tx.tocExpand, "data-label-expand")}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"></path></svg></button></div><ol class="toc-list jnl-stack">${sections.map((sec) => renderTemplate`<li><a${addAttribute(`#${sec.id}`, "href")}${addAttribute(sec.id, "data-toc")} class="toc-link"><span class="toc-tick" aria-hidden="true"></span><span class="toc-label">${sec.heading}</span></a></li>`)}</ol></nav><script>
          (function () {
            try {
              var saved = (window.__tdsPrefs || {}).reader_toc || localStorage.getItem("tds-blog-toc");
              if (saved === "collapsed") {
                var m = document.getElementById("main");
                if (m) m.classList.add("toc-collapsed");
                var t = document.getElementById("toc-toggle");
                if (t) t.setAttribute("aria-expanded", "false");
              }
            } catch (e) {
              /* storage disabled — start expanded */
            }
          })();
        <\/script>` })}`}<article class="article-col"><div class="article-read"><div class="article-zoom"><header class="mb-7"><div class="flex flex-wrap items-center gap-3.5 mb-3.5"><p class="eyebrow" style="color: var(--color-accent);">${post.category}</p><span aria-hidden="true" class="w-1 h-1 bg-[var(--color-line)] max-sm:hidden"></span><p class="text-[0.8125rem] text-[var(--color-muted)] tabular">${dateLabel && post.publishedAt && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<time${addAttribute(post.publishedAt, "datetime")}>${dateLabel}</time> ·${" "}` })}`}~${readingMinutes} ${tx.read}${updatedLabel && post.updatedAt && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`${" · "}${tx.updated} <time${addAttribute(post.updatedAt, "datetime")}>${updatedLabel}</time>` })}`}</p></div><div class="title-row"><a${addAttribute(`${pfx}/`, "href")} class="back-rail"${addAttribute(tx.back, "aria-label")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></a><h1 class="display page-title" style="text-wrap: balance;">${post.title}</h1></div><p class="lead mt-3.5 text-[var(--color-muted)]" style="text-wrap: pretty;">${post.excerpt}</p><p class="mt-4 inline-flex items-center gap-2.5">${authorAvatar ? renderTemplate`<img${addAttribute(authorAvatar, "src")} alt="" class="w-7 h-7 rounded-full object-cover" width="28" height="28" loading="lazy">` : renderTemplate`<span aria-hidden="true" class="w-7 h-7 inline-flex items-center justify-center text-[11px] font-semibold tracking-wide" style="background: var(--tds-flat-tint); color: var(--color-primary);">${authorInitials}</span>`}${authorPageHref ? renderTemplate`<a${addAttribute(authorPageHref, "href")} class="text-[0.8125rem] font-medium link-underline">${authorName}</a>` : renderTemplate`<span class="text-[0.8125rem] font-medium">${authorName}</span>`}</p>${translated && renderTemplate`<p class="mt-4 text-[0.8125rem] text-[var(--color-muted)] border-l-2 pl-3" style="border-color: var(--color-accent);"><span aria-hidden="true">🌐 </span>${tx.machine}</p>`}</header>${explicitCover && renderTemplate`<img${addAttribute(explicitCover, "src")}${addAttribute(imageHints(explicitCover, lang)?.alt ?? post.title, "alt")}${addAttribute(imageHints(explicitCover, lang)?.srcSet, "srcset")} sizes="(min-width: 64rem) 65vw, 100vw"${addAttribute(imageHints(explicitCover, lang)?.width ?? 1440, "width")}${addAttribute(imageHints(explicitCover, lang)?.height ?? 960, "height")} loading="eager" decoding="async" class="w-full aspect-[3/2] object-cover mb-7">`}</div><div class="reader-tools-anchor"><div class="reader-tools" role="toolbar"${addAttribute(tx.tools, "aria-label")} aria-orientation="vertical"><button type="button" class="reader-tool" id="zoom-in"${addAttribute(tx.zoomIn, "aria-label")}${addAttribute(tx.zoomIn, "title")}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path><path d="M11 8v6"></path><path d="M8 11h6"></path></svg></button><button type="button" class="reader-tool" id="zoom-out"${addAttribute(tx.zoomOut, "aria-label")}${addAttribute(tx.zoomOut, "title")}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path><path d="M8 11h6"></path></svg></button><button type="button" class="reader-tool" id="focus-toggle" aria-pressed="false"${addAttribute(tx.focus, "aria-label")}${addAttribute(tx.focusTitle, "title")}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path></svg></button><a${addAttribute(`${pfx}/${post.slug}/print`, "href")} target="_blank" rel="noopener" class="reader-tool"${addAttribute(tx.print, "aria-label")}${addAttribute(tx.print, "title")}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><path d="M6 14h12v8H6z"></path></svg></a></div></div><div class="article-zoom mt-4 pb-10">${isBlocks ? blkSplit.intro.length > 0 && renderTemplate`${renderComponent($$result, "BlockRenderer", $$BlockRenderer, {
		"blocks": blkSplit.intro,
		"ads": ads,
		"showAds": showBlockAds,
		"lang": lang,
		"snippets": snippets,
		"dropCap": true
	})}` : introParts.map((part, i) => part.kind === "html" ? renderTemplate`<div${addAttribute(["tds-prose", i === 0 && "drop-cap"], "class:list")}>${unescapeHTML(part.html)}</div>` : renderTemplate`${renderComponent($$result, "ProductEmbed", $$ProductEmbed, {
		"slug": part.slug,
		"variant": part.variant,
		"lang": lang
	})}`)}${showManualAds && ads.slotInArticle && renderTemplate`${renderComponent($$result, "AdSlot", $$AdSlot, {
		"client": ads.publisherId,
		"slot": ads.slotInArticle,
		"lang": lang
	})}`}${isBlocks ? blkSplit.sections.map((sec) => renderTemplate`<section class="article-sec"><h2${addAttribute(sec.id, "id")}><button class="sec-head" aria-expanded="true"${addAttribute(`${sec.id}-body`, "aria-controls")}><span>${sec.heading}</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg></button></h2><div class="sec-body"${addAttribute(`${sec.id}-body`, "id")}><div class="sec-body-inner">${renderComponent($$result, "BlockRenderer", $$BlockRenderer, {
		"blocks": sec.blocks,
		"ads": ads,
		"showAds": showBlockAds,
		"lang": lang,
		"snippets": snippets
	})}</div></div></section>`) : sectionParts.map((sec) => renderTemplate`<section class="article-sec"><h2${addAttribute(sec.id, "id")}><button class="sec-head" aria-expanded="true"${addAttribute(`${sec.id}-body`, "aria-controls")}><span>${sec.heading}</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg></button></h2><div class="sec-body"${addAttribute(`${sec.id}-body`, "id")}><div class="sec-body-inner">${sec.parts.map((part) => part.kind === "html" ? renderTemplate`<div class="tds-prose">${unescapeHTML(part.html)}</div>` : renderTemplate`${renderComponent($$result, "ProductEmbed", $$ProductEmbed, {
		"slug": part.slug,
		"variant": part.variant,
		"lang": lang
	})}`)}</div></div></section>`)}${showManualAds && ads.slotEndArticle && renderTemplate`${renderComponent($$result, "AdSlot", $$AdSlot, {
		"client": ads.publisherId,
		"slot": ads.slotEndArticle,
		"lang": lang
	})}`}</div></div><div class="jnl-article-end"><aside class="focus-hide jnl-panel jnl-tone-accent flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"${addAttribute(tx.contactHead, "aria-label")}><div><p class="eyebrow mb-1.5">${tx.contactHead}</p><p class="text-sm text-[var(--color-muted)]" style="max-width: 44ch; text-wrap: pretty;">${tx.contactLead}</p></div><a${addAttribute(contactUrl, "href")} class="btn-flat shrink-0" data-track="article-contact"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16"></rect><path d="m22 6-10 7L2 6"></path></svg><span>${tx.contactCta}</span></a></aside><aside class="focus-hide jnl-panel jnl-tone-tint grid grid-cols-[64px_1fr] gap-5 items-start">${authorAvatar ? renderTemplate`<img${addAttribute(authorAvatar, "src")} alt="" class="w-16 h-16 rounded-full object-cover" width="64" height="64" loading="lazy">` : renderTemplate`<span aria-hidden="true" class="w-16 h-16 inline-flex items-center justify-center text-lg font-semibold tracking-wide text-white" style="background: var(--color-surface-navy); font-family: var(--font-display);">${authorInitials}</span>`}<div><p class="eyebrow mb-2">${tx.aboutAuthor}</p><p class="font-semibold">${authorPageHref ? renderTemplate`<a${addAttribute(authorPageHref, "href")} class="link-underline">${authorName}</a>` : authorName}${!author && renderTemplate`<span class="font-normal text-sm text-[var(--color-muted)]">· ${tx.owner}</span>`}</p><p class="text-sm leading-relaxed text-[var(--color-muted)] mt-2" style="text-wrap: pretty;">${authorBio}</p></div></aside>${renderComponent($$result, "ProductSlot", $$ProductSlot, {
		"class": "focus-hide",
		"slotKey": "blog-article-end",
		"lang": lang,
		"category": post.category
	})}${renderComponent($$result, "RelatedArticles", $$RelatedArticles, {
		"class": "focus-hide",
		"posts": posts,
		"currentSlug": post.slug,
		"currentCategory": post.category,
		"lang": lang
	})}${renderComponent($$result, "TagList", $$TagList, {
		"class": "focus-hide jnl-panel jnl-tone-sand",
		"tags": post.tags,
		"lang": lang,
		"label": "Tags"
	})}${(newerPost || olderPost) && renderTemplate`<nav class="focus-hide jnl-panel jnl-tone-tint grid sm:grid-cols-2 gap-px"${addAttribute(tx.nav, "aria-label")}>${newerPost ? renderTemplate`<a${addAttribute(postHref(newerPost.slug), "href")} class="jnl-tile block px-5 py-4 group"><p class="eyebrow mb-2">← ${tx.newer}</p><p class="display-tight text-lg group-hover:text-[var(--color-primary)] transition-colors">${newerPost.title}</p></a>` : renderTemplate`<span class="hidden sm:block" aria-hidden="true"></span>`}${olderPost && renderTemplate`<a${addAttribute(postHref(olderPost.slug), "href")} class="jnl-tile block px-5 py-4 group sm:text-right"><p class="eyebrow mb-2">${tx.older} →</p><p class="display-tight text-lg group-hover:text-[var(--color-primary)] transition-colors">${olderPost.title}</p></a>`}</nav>`}<footer class="jnl-panel jnl-tone-sand flex flex-wrap items-baseline justify-between gap-4 text-sm"><a${addAttribute(`${pfx}/`, "href")} class="link-underline text-[var(--color-accent)]">← ${tx.allArticles}</a><a${addAttribute(`${pfx}/rss`, "href")} class="link-underline text-[var(--color-muted)]">${tx.rss}</a></footer></div></article></main>${renderScript($$result, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/Article.astro?astro&type=script&index=0&lang.ts")}${renderScript($$result, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/Article.astro?astro&type=script&index=1&lang.ts")}${renderScript($$result, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/Article.astro?astro&type=script&index=2&lang.ts")}<div hidden${addAttribute(JSON.stringify(interestTopics), "data-interest-topics")}></div>${renderScript($$result, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/Article.astro?astro&type=script&index=3&lang.ts")}` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/Article.astro", void 0);
export { $$Article as t };
