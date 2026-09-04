import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as siteCache } from "./pageCache_CUKDMWr2.mjs";
//#region src/pages/tds/cache/[action].ts
var _action__exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST,
	prerender: () => false
});
var handle = ({ params, request, url }) => siteCache.control(String(params.action ?? ""), request, url);
var GET = handle;
var POST = handle;
//#endregion
//#region \0virtual:astro:page:src/pages/tds/cache/[action]@_@ts
var page = () => _action__exports;
//#endregion
export { page };
