/**
* Last-resort clamp. Cuts on a word boundary so the result never ends
* mid-word; only reached when even the short form overflows, i.e. when a
* taxonomy name is itself pathologically long.
*/
function clampToWord(text, max = 160) {
	if (text.length <= max) return text;
	const cut = text.slice(0, max - 1);
	const lastSpace = cut.lastIndexOf(" ");
	return `${(lastSpace > max * .5 ? cut.slice(0, lastSpace) : cut).trimEnd().replace(/[\s.,;:—–-]+$/, "")}…`;
}
/** Pick the rich sentence when it fits, else the short one. */
function fit(rich, short) {
	return rich.length <= 160 ? rich : clampToWord(short);
}
function categoryDescription(name, lang) {
	return lang === "de" ? fit(`Beiträge im TDS Journal zur Kategorie „${name}“: praxisnahe Artikel über Webentwicklung, Automatisierung und Software für Unternehmen.`, `Alle Beiträge im TDS Journal zur Kategorie „${name}“.`) : fit(`Posts in the TDS Journal filed under “${name}” — hands-on articles on web development, automation and software for businesses.`, `All posts in the TDS Journal filed under “${name}”.`);
}
function tagDescription(tag, lang) {
	return lang === "de" ? fit(`Alle Beiträge im TDS Journal mit dem Tag „${tag}“ — praxisnahe Artikel über Digitalisierung und Software-Entwicklung für Unternehmen.`, `Alle Beiträge im TDS Journal mit dem Tag „${tag}“.`) : fit(`All posts in the TDS Journal tagged “${tag}” — hands-on articles on digitalization and software development for businesses.`, `All posts in the TDS Journal tagged “${tag}”.`);
}
function archiveDescription(page, lang) {
	return lang === "de" ? `Seite ${page} des TDS-Journal-Archivs: ältere Beiträge über Digitalisierung für Unternehmen, Webentwicklung und Automatisierung im Arbeitsalltag.` : `Page ${page} of the TDS Journal archive: older posts on digitalization for businesses, web development and everyday automation.`;
}
/**
* Fallback for an author with no bio. A real bio is CMS-authored and used
* verbatim — it is the better description whenever it exists.
*/
function authorDescription(name, lang) {
	return lang === "de" ? fit(`Beiträge von ${name} im TDS Journal — Artikel über Digitalisierung für Unternehmen, Webentwicklung und Automatisierung.`, `Beiträge von ${name} im Journal von Tracht Digital Solutions.`) : fit(`Posts by ${name} in the TDS Journal — articles on digitalization for businesses, web development and automation.`, `Posts by ${name} in the Tracht Digital Solutions journal.`);
}
function postDescription(metaDescription, excerpt, lang = "de") {
	const chosen = (metaDescription ?? "").trim() || (excerpt ?? "").trim();
	if (chosen.length >= 80) return clampToWord(chosen);
	const topUp = lang === "de" ? "Aus dem TDS Journal von Tracht Digital Solutions — Artikel über Digitalisierung für Unternehmen." : "From the TDS Journal by Tracht Digital Solutions — articles on digitalization for businesses.";
	return clampToWord(chosen ? `${chosen} ${topUp}` : topUp);
}
//#endregion
export { postDescription as a, clampToWord as i, authorDescription as n, tagDescription as o, categoryDescription as r, archiveDescription as t };
