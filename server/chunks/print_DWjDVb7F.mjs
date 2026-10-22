import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { A as renderTemplate, w as renderComponent } from "./sequence_ReSFEh7V.mjs";
import { n as createComponent, t as createAstro } from "./compiler_CpHEml6m.mjs";
import { t as resolveLocalizedPost } from "./localizedPost_bgBjfrzS.mjs";
import { t as $$PrintDoc } from "./PrintDoc_B2x1PiKy.mjs";
// src/pages/en/[slug]/print.astro
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
	if (!localized) return new Response(null, { status: 404 });
	return renderTemplate`${renderComponent($$result, "PrintDoc", $$PrintDoc, {
		"localized": localized,
		"lang": "en"
	})}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/[slug]/print.astro", void 0);
var $$file = "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/pages/en/[slug]/print.astro";
var $$url = "/en/[slug]/print";
// \0virtual:astro:page:src/pages/en/[slug]/print@_@astro
var page = () => print_exports;
export { page };
