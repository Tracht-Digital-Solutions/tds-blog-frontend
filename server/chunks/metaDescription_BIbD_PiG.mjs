import { o as clampToWord } from "./Layout_CLtREmTt.mjs";
/** Pick the rich sentence when it fits, else the short one. */
function fit(rich, short) {
	return rich.length <= 160 ? rich : clampToWord(short);
}
function categoryDescription(name, lang) {
	return lang === "de" ? fit(`Beiträge im Ratgeber zur Kategorie „${name}“: praxisnahe Artikel über Webentwicklung, Automatisierung und Software für Unternehmen.`, `Alle Beiträge im Ratgeber zur Kategorie „${name}“.`) : fit(`Posts in the Ratgeber filed under “${name}” — hands-on articles on web development, automation and software for businesses.`, `All posts in the Ratgeber filed under “${name}”.`);
}
function tagDescription(tag, lang) {
	return lang === "de" ? fit(`Alle Beiträge im Ratgeber mit dem Tag „${tag}“ — praxisnahe Artikel über Digitalisierung und Software-Entwicklung für Unternehmen.`, `Alle Beiträge im Ratgeber mit dem Tag „${tag}“.`) : fit(`All posts in the Ratgeber tagged “${tag}” — hands-on articles on digitalization and software development for businesses.`, `All posts in the Ratgeber tagged “${tag}”.`);
}
function archiveDescription(page, lang) {
	return lang === "de" ? `Seite ${page} des Ratgeber-Archivs: ältere Beiträge über Digitalisierung für Unternehmen, Webentwicklung und Automatisierung im Arbeitsalltag.` : `Page ${page} of the Ratgeber archive: older posts on digitalization for businesses, web development and everyday automation.`;
}
/**
* Fallback for an author with no bio. A real bio is CMS-authored and used
* verbatim — it is the better description whenever it exists.
*/
function authorDescription(name, lang) {
	return lang === "de" ? fit(`Beiträge von ${name} im Ratgeber — Artikel über Digitalisierung für Unternehmen, Webentwicklung und Automatisierung.`, `Beiträge von ${name} im Ratgeber von Tracht Digital Solutions.`) : fit(`Posts by ${name} in the Ratgeber — articles on digitalization for businesses, web development and automation.`, `Posts by ${name} in the Tracht Digital Solutions journal.`);
}
function postDescription(metaDescription, excerpt, lang = "de") {
	const chosen = (metaDescription ?? "").trim() || (excerpt ?? "").trim();
	if (chosen.length >= 80) return clampToWord(chosen);
	const topUp = lang === "de" ? "Aus dem Ratgeber von Tracht Digital Solutions — Artikel über Digitalisierung für Unternehmen." : "From the Ratgeber by Tracht Digital Solutions — articles on digitalization for businesses.";
	return clampToWord(chosen ? `${chosen} ${topUp}` : topUp);
}
export { tagDescription as a, postDescription as i, authorDescription as n, categoryDescription as r, archiveDescription as t };
