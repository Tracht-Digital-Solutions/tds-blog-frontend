import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { O as renderTemplate, S as renderComponent } from "./sequence_C9xNxrDs.mjs";
import { f as createComponent } from "./Layout_BMcC3_Tl.mjs";
import { t as createAstro } from "./compiler_EL8fTkBE.mjs";
import { t as $$PrintDoc } from "./PrintDoc_PuEdquI-.mjs";
import { t as resolveLocalizedPost } from "./localizedPost_MFrFLejq.mjs";
// src/pages/[slug]/print.astro
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
// \0virtual:astro:page:src/pages/[slug]/print@_@astro
var page = () => print_exports;
export { page };
