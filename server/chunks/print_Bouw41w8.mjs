import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { A as renderTemplate, V as createAstro, w as renderComponent } from "./sequence_CbUbm3Cx.mjs";
import { t as createComponent } from "./compiler_aMwP8CK8.mjs";
import { t as $$PrintDoc } from "./PrintDoc_DR-2cmdH.mjs";
import { t as resolveLocalizedPost } from "./localizedPost_CWfKcvt3.mjs";
//#region src/pages/en/[slug]/print.astro
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
	const localized = await resolveLocalizedPost(slug, "en");
	if (!localized) return new Response("Not found", { status: 404 });
	return renderTemplate`${renderComponent($$result, "PrintDoc", $$PrintDoc, {
		"localized": localized,
		"lang": "en"
	})}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/[slug]/print.astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/[slug]/print.astro";
var $$url = "/en/[slug]/print";
//#endregion
//#region \0virtual:astro:page:src/pages/en/[slug]/print@_@astro
var page = () => print_exports;
//#endregion
export { page };
