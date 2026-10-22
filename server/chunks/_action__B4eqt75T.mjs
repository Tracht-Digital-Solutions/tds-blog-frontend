import { t as __exportAll } from "./rolldown-runtime_D8jQpDG7.mjs";
import { t as siteCache } from "./pageCache_DBolFWNS.mjs";
// src/pages/tds/cache/[action].ts
var _action__exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var handle = ({ params, request, url }) => siteCache.control(String(params.action ?? ""), request, url);
var GET = handle;
var POST = handle;
// \0virtual:astro:page:src/pages/tds/cache/[action]@_@ts
var page = () => _action__exports;
export { page };
