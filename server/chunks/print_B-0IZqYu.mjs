import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, w as renderComponent } from "./sequence_BeD7A7Kt.mjs";
import { n as createComponent, t as createAstro } from "./compiler_DG-Tx2-f.mjs";
import { t as resolveLocalizedPost } from "./localizedPost_hUt_f0ea.mjs";
import { t as $$PrintDoc } from "./PrintDoc_SkTtLede.mjs";
//#region src/pages/[slug]/print.astro
var print_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Print,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://blog.tracht-digital.de");
var $$Print = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Print;
	const { slug } = Astro.params;
	const localized = await resolveLocalizedPost(slug, "de");
	if (!localized) return new Response(null, { status: 404 });
	return renderTemplate`${renderComponent($$result, "PrintDoc", $$PrintDoc, {
		"localized": localized,
		"lang": "de"
	})}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/[slug]/print.astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/[slug]/print.astro";
var $$url = "/[slug]/print";
//#endregion
//#region \0virtual:astro:page:src/pages/[slug]/print@_@astro
var page = () => print_exports;
//#endregion
export { page };
