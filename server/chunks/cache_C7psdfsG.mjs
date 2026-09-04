import { i as contentApiBase, r as connection } from "./connection_C3w8iWPQ.mjs";
import { createHash, timingSafeEqual } from "crypto";
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from "fs/promises";
import { dirname, isAbsolute, join, resolve, sep } from "path";
import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from "fs";
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/cache/index.js
var FORBIDDEN = /* @__PURE__ */ new Set([
	"/",
	"\\",
	":",
	"*",
	"?",
	"\"",
	"<",
	">",
	"|"
]);
function isSafeSegment(segment) {
	if (segment === "" || segment === "." || segment === "..") return false;
	if (segment.startsWith(".")) return false;
	for (const ch of segment) {
		if (FORBIDDEN.has(ch)) return false;
		const code = ch.codePointAt(0) ?? 0;
		if (code < 32 || code === 127) return false;
	}
	return true;
}
function hasExtension(segment) {
	const dot = segment.lastIndexOf(".");
	if (dot <= 0 || dot === segment.length - 1) return false;
	const ext = segment.slice(dot + 1);
	for (const ch of ext) if (!(ch >= "0" && ch <= "9") && !(ch >= "a" && ch <= "z") && !(ch >= "A" && ch <= "Z")) return false;
	return true;
}
function cacheLocation(pathname) {
	let decoded;
	try {
		decoded = decodeURIComponent(pathname);
	} catch {
		return null;
	}
	const segments = decoded.split("/").filter((s) => s !== "");
	if (!segments.every(isSafeSegment)) return null;
	if (segments.length === 0) return {
		file: "index.html",
		meta: "index.json",
		path: "/"
	};
	const joined = segments.join("/");
	const last = segments[segments.length - 1];
	return {
		file: hasExtension(last) ? joined : joined + "/index.html",
		meta: joined + ".json",
		path: "/" + joined
	};
}
function isCacheableMethod(method) {
	const m = method.toUpperCase();
	return m === "GET" || m === "HEAD";
}
var PageCacheStore = class {
	/**
	* @param dir      Where the served files go. In production this is what the
	*                 document root's `_tds-cache` symlink points at, so the web
	*                 server can answer a hit without waking Node.
	* @param metaDir  Where the sidecars go. Defaults to `<dir>/.meta` for local
	*                 use; production passes a directory OUTSIDE the web tree,
	*                 so nothing but rendered public HTML is ever reachable.
	*/
	constructor(dir, metaDir) {
		this.dir = dir;
		this.metaDir = metaDir ?? join(dir, ".meta");
	}
	dir;
	metaDir;
	/** Absolute path of a page file inside the cache directory. */
	abs(relative) {
		return join(this.dir, ...relative.split("/"));
	}
	/** Absolute path of a metadata sidecar. */
	absMeta(relative) {
		return join(this.metaDir, ...relative.split("/"));
	}
	/**
	* Read an entry, or `null` when there is none.
	*
	* Missing metadata is treated as a miss rather than a partially usable
	* entry: without the content type we would have to guess, and guessing
	* `text/html` for a cached `rss.xml` serves a feed the browser renders as a
	* broken page.
	*/
	async read(pathname) {
		const loc = cacheLocation(pathname);
		if (!loc) return null;
		try {
			const [body, metaRaw] = await Promise.all([readFile(this.abs(loc.file)), readFile(this.absMeta(loc.meta), "utf8")]);
			const meta = JSON.parse(metaRaw);
			if (typeof meta?.contentType !== "string") return null;
			return {
				body,
				meta
			};
		} catch {
			return null;
		}
	}
	/**
	* Write an entry atomically: a temporary file next to the target, then a
	* `rename` over it.
	*
	* The atomicity is the load-bearing part of "rebuild = render then swap".
	* A plain `writeFile` over a live entry leaves a window in which a visitor
	* reads a half-written document, and a truncated HTML page renders as a
	* blank white screen rather than as an error anyone would notice.
	*/
	async write(pathname, body, contentType) {
		const loc = cacheLocation(pathname);
		if (!loc) return null;
		const meta = {
			path: loc.path,
			contentType,
			renderedAt: (/* @__PURE__ */ new Date()).toISOString(),
			etag: "\"" + createHash("sha256").update(body).digest("hex").slice(0, 32) + "\""
		};
		await this.swap(this.abs(loc.file), body);
		await this.swap(this.absMeta(loc.meta), Buffer.from(JSON.stringify(meta), "utf8"));
		return meta;
	}
	async swap(target, body) {
		await mkdir(dirname(target), { recursive: true });
		const tmp = `${target}.${process.pid}.${Math.random().toString(36).slice(2, 10)}.tmp`;
		await writeFile(tmp, body);
		try {
			await rename(tmp, target);
		} catch (err) {
			await rm(tmp, { force: true });
			throw err;
		}
	}
	/** Remove one entry. Missing is success — purging twice is not an error. */
	async remove(pathname) {
		const loc = cacheLocation(pathname);
		if (!loc) return;
		await Promise.all([rm(this.abs(loc.file), { force: true }), rm(this.absMeta(loc.meta), { force: true })]);
	}
	/**
	* Empty both directories — their CONTENTS, never the directories themselves.
	*
	* Both, not just the pages: metadata left behind would make {@link list}
	* report entries that no longer exist, and a status screen that lies about
	* an empty cache is worse than none.
	*
	* And contents rather than the directory, because in production the pages
	* directory is reached through a symlink the document root owns. `rm -r` on
	* a symlink removes the LINK, so a "clear the cache" click would silently
	* disconnect the web server from the store until the next app restart
	* recreated it — every page a miss, no error anywhere, and nothing in the
	* cache directory to suggest why.
	*/
	async clear() {
		const empty = async (dir) => {
			let items;
			try {
				items = await readdir(dir);
			} catch {
				return;
			}
			await Promise.all(items.map((name) => rm(join(dir, name), {
				recursive: true,
				force: true
			})));
		};
		await Promise.all([empty(this.dir), empty(this.metaDir)]);
	}
	/**
	* Every entry currently stored, newest first.
	*
	* Derived from the metadata tree rather than the HTML tree, because the
	* metadata file names carry the request path directly and the HTML tree
	* would require re-deriving `/preise` from `preise/index.html`.
	*/
	async list() {
		const metaRoot = this.metaDir;
		const found = [];
		const walk = async (dir) => {
			let items;
			try {
				items = await readdir(dir, { withFileTypes: true });
			} catch {
				return;
			}
			for (const item of items) {
				const full = join(dir, item.name);
				if (item.isDirectory()) {
					await walk(full);
					continue;
				}
				if (!item.name.endsWith(".json")) continue;
				try {
					const meta = JSON.parse(await readFile(full, "utf8"));
					const body = await stat(this.abs(cacheLocation(meta.path)?.file ?? ""));
					found.push({
						path: meta.path,
						renderedAt: meta.renderedAt,
						bytes: body.size
					});
				} catch {}
			}
		};
		await walk(metaRoot);
		found.sort((a, b) => a.renderedAt < b.renderedAt ? 1 : -1);
		return found;
	}
	/** Where this store keeps its files — for the status endpoint and logs. */
	get directory() {
		return this.dir.endsWith(sep) ? this.dir.slice(0, -1) : this.dir;
	}
};
function tokenMatches(expected, given) {
	if (!expected || !given) return false;
	const a = createHash("sha256").update(expected).digest();
	const b = createHash("sha256").update(given).digest();
	return timingSafeEqual(a, b);
}
async function resolveEvents(map, events) {
	const paths = /* @__PURE__ */ new Set();
	const unknown = /* @__PURE__ */ new Set();
	for (const event of events) {
		const resolver = map[event.type];
		if (!resolver) {
			unknown.add(event.type);
			continue;
		}
		let resolved;
		try {
			resolved = await resolver(event);
		} catch {
			continue;
		}
		for (const path of resolved) if (typeof path === "string" && path.startsWith("/")) paths.add(path);
	}
	return {
		paths: [...paths].sort(),
		unknown: [...unknown].sort()
	};
}
function forLanguages(event, build) {
	if (event.lang === "de") return build("de");
	if (event.lang === "en") return build("en");
	return [...build("de"), ...build("en")];
}
function isStorable(contentType) {
	const t = contentType.toLowerCase();
	return t.includes("text/html") || t.includes("application/xml") || t.includes("text/xml") || t.includes("application/rss+xml") || t.includes("application/json") || t.includes("application/pdf") || t.includes("image/png");
}
function json(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "no-store"
		}
	});
}
function pageCache(options) {
	const { dir, metaDir, events, token = process.env.TDS_CACHE_TOKEN ?? "", tokenProvider, enabled = true, onInvalidate, alwaysPaths = [], concurrency = 4, logger = (m) => console.warn(m) } = options;
	const store = new PageCacheStore(dir, metaDir);
	const REFRESH = "x-tds-cache-refresh";
	const currentToken = () => {
		try {
			return (tokenProvider?.() ?? token).trim();
		} catch {
			return token.trim();
		}
	};
	async function control(action, request, url) {
		const activeToken = currentToken();
		if (!activeToken) return json({ error: "cache_token_not_configured" }, 503);
		if (!tokenMatches(activeToken, request.headers.get("x-tds-cache-token") ?? request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? null)) return json({ error: "unauthorized" }, 401);
		if (action === "status" && request.method === "GET") {
			const entries = await store.list();
			return json({
				directory: store.directory,
				count: entries.length,
				newest: entries[0]?.renderedAt ?? null,
				oldest: entries[entries.length - 1]?.renderedAt ?? null,
				bytes: entries.reduce((sum, e) => sum + e.bytes, 0),
				entries: entries.slice(0, 500)
			});
		}
		if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
		let payload;
		try {
			payload = await request.json();
		} catch {
			return json({ error: "invalid_json" }, 400);
		}
		const resolved = await resolveEvents(events, payload.events ?? []);
		const explicit = (payload.paths ?? []).filter((p) => typeof p === "string" && p.startsWith("/"));
		if (action === "purge") {
			if (payload.all) {
				await store.clear();
				onInvalidate?.();
				return json({ purged: "all" });
			}
			const paths2 = [.../* @__PURE__ */ new Set([...resolved.paths, ...explicit])];
			await Promise.all(paths2.map((p) => store.remove(p)));
			onInvalidate?.();
			return json({
				purged: paths2,
				unknownEvents: resolved.unknown
			});
		}
		if (action !== "rebuild") return json({ error: "not_found" }, 404);
		let paths;
		if (payload.all) {
			const cached = (await store.list()).map((e) => e.path);
			paths = [.../* @__PURE__ */ new Set([...cached, ...alwaysPaths])].sort();
		} else paths = [.../* @__PURE__ */ new Set([...resolved.paths, ...explicit])];
		onInvalidate?.();
		const rebuilt = [];
		const skipped = [];
		const failed = [];
		const queue = [...paths];
		const worker = async () => {
			for (;;) {
				const path = queue.shift();
				if (path === void 0) return;
				try {
					const res = await fetch(new URL(path, url.origin), { headers: { [REFRESH]: activeToken } });
					await res.arrayBuffer();
					if (!res.ok) failed.push({
						path,
						status: res.status
					});
					else if (res.headers.get("x-tds-cache") === "BYPASS") skipped.push(path);
					else rebuilt.push(path);
				} catch (err) {
					failed.push({
						path,
						status: String(err)
					});
				}
			}
		};
		await Promise.all(Array.from({ length: Math.max(1, concurrency) }, worker));
		return json({
			rebuilt: rebuilt.sort(),
			skipped: skipped.sort(),
			failed,
			unknownEvents: resolved.unknown
		});
	}
	async function middleware(context, next) {
		const { request, url } = context;
		if (context.isPrerendered) return next();
		if (!enabled || !isCacheableMethod(request.method)) return next();
		const activeToken = currentToken();
		const refreshing = activeToken !== "" && tokenMatches(activeToken, request.headers.get(REFRESH));
		if (!refreshing) {
			const hit = await store.read(url.pathname);
			if (hit) {
				if (request.headers.get("if-none-match") === hit.meta.etag) return new Response(null, {
					status: 304,
					headers: {
						etag: hit.meta.etag,
						"x-tds-cache": "HIT"
					}
				});
				return new Response(request.method === "HEAD" ? null : new Uint8Array(hit.body), {
					status: 200,
					headers: {
						"content-type": hit.meta.contentType,
						etag: hit.meta.etag,
						"x-tds-cache": "HIT",
						"cache-control": "public, max-age=0, must-revalidate"
					}
				});
			}
		}
		const response = await next();
		const contentType = response.headers.get("content-type") ?? "";
		if (!(request.method === "GET" && response.status === 200 && isStorable(contentType) && !response.headers.has("set-cookie") && !(response.headers.get("cache-control") ?? "").includes("no-store"))) {
			const out = new Response(response.body, response);
			out.headers.set("x-tds-cache", "BYPASS");
			return out;
		}
		const body = Buffer.from(await response.arrayBuffer());
		let etag;
		try {
			etag = (await store.write(url.pathname, body, contentType))?.etag;
		} catch (err) {
			logger(`[tds-cache] could not store ${url.pathname}: ${String(err)}`);
		}
		const headers = new Headers(response.headers);
		headers.set("x-tds-cache", refreshing ? "REFRESH" : "MISS");
		headers.set("cache-control", "public, max-age=0, must-revalidate");
		if (etag) headers.set("etag", etag);
		return new Response(new Uint8Array(body), {
			status: 200,
			headers
		});
	}
	return {
		middleware,
		control: async (action, request, url) => {
			try {
				return await control(action, request, url);
			} catch (err) {
				logger(`[tds-cache] control request failed: ${String(err)}`);
				return json({ error: "internal" }, 500);
			}
		}
	};
}
function createGenerationCache() {
	let entries = /* @__PURE__ */ new Map();
	let generation = 0;
	return {
		get(key, load) {
			const existing = entries.get(key);
			if (existing) return existing;
			const bornIn = generation;
			const pending = load().catch((err) => {
				if (generation === bornIn && entries.get(key) === pending) entries.delete(key);
				throw err;
			});
			entries.set(key, pending);
			return pending;
		},
		invalidate() {
			generation += 1;
			entries = /* @__PURE__ */ new Map();
		},
		get generation() {
			return generation;
		}
	};
}
var CACHE_LINK_NAME = "_tds-cache";
var BUILD_MARKER_NAME = ".build-id";
var DEFAULT_ASSETS_DIR = "_astro";
function resolveCacheDirs(options = {}) {
	const { root = process.cwd(), publicDir = "client", assetsDir = DEFAULT_ASSETS_DIR, logger = (m) => console.warn(m) } = options;
	const fromEnv = (name) => {
		const value = (process.env[name] ?? "").trim();
		if (value === "") return null;
		return isAbsolute(value) ? value : resolve(root, value);
	};
	const base = join(root, "var", "page-cache");
	const dir = fromEnv("TDS_CACHE_DIR") ?? join(base, "pages");
	const metaDir = fromEnv("TDS_CACHE_META_DIR") ?? join(base, "meta");
	try {
		mkdirSync(dir, { recursive: true });
		mkdirSync(metaDir, { recursive: true });
	} catch (err) {
		logger(`[tds-cache] could not create the cache directories: ${String(err)}`);
		return {
			dir,
			metaDir
		};
	}
	discardCacheOfOtherBuild(join(root, publicDir), assetsDir, dir, metaDir, logger);
	linkIntoDocumentRoot(join(root, publicDir), dir, logger);
	return {
		dir,
		metaDir
	};
}
function discardCacheOfOtherBuild(documentRoot, assetsDir, dir, metaDir, logger) {
	const fingerprint = buildFingerprint(join(documentRoot, assetsDir));
	if (!fingerprint) return;
	const marker = join(metaDir, BUILD_MARKER_NAME);
	let previous = null;
	try {
		previous = readFileSync(marker, "utf8").trim();
	} catch {
		previous = null;
	}
	if (previous === fingerprint) return;
	emptyContents(dir, logger);
	emptyContents(metaDir, logger);
	logger(`[tds-cache] cache discarded: it was filled by build ${previous ?? "unknown"}, this is ${fingerprint}`);
	try {
		writeFileSync(marker, `${fingerprint}
`);
	} catch (err) {
		logger(`[tds-cache] could not record the build marker: ${String(err)}`);
	}
}
function buildFingerprint(assetsPath) {
	let names;
	try {
		names = readdirSync(assetsPath);
	} catch {
		return null;
	}
	if (names.length === 0) return null;
	return createHash("sha256").update(names.sort().join("\n")).digest("hex").slice(0, 16);
}
function emptyContents(dir, logger) {
	let items;
	try {
		items = readdirSync(dir);
	} catch {
		return;
	}
	for (const name of items) try {
		rmSync(join(dir, name), {
			recursive: true,
			force: true
		});
	} catch (err) {
		logger(`[tds-cache] could not remove ${join(dir, name)}: ${String(err)}`);
	}
}
function linkIntoDocumentRoot(documentRoot, target, logger) {
	if (!existsSync(documentRoot)) return;
	const link = join(documentRoot, CACHE_LINK_NAME);
	try {
		let entry = null;
		try {
			entry = lstatSync(link);
		} catch {
			entry = null;
		}
		if (entry) {
			if (!entry.isSymbolicLink()) return;
			if (existsSync(link)) return;
			unlinkSync(link);
		}
		symlinkSync(target, link, process.platform === "win32" ? "junction" : "dir");
	} catch (err) {
		logger(`[tds-cache] could not link ${link} -> ${target}: ${String(err)}`);
	}
}
//#endregion
//#region src/lib/demoContent.ts
var DEMO_AUTHOR = {
	id: 1,
	name: "Julian Tracht",
	slug: "julian-tracht",
	avatarUrl: null,
	bio: "Freier Entwickler aus Schwarzenbek bei Hamburg. Baut Websites, Webshops und individuelle Werkzeuge für Selbstständige, kleine Unternehmen und lokale Betriebe."
};
var day = 864e5;
var date = (offsetDays) => new Date(Date.now() + offsetDays * day).toISOString().slice(0, 10);
var SEEDS = [
	{
		slug: "digitalisierung-faengt-klein-an",
		publishedAt: date(-4),
		de: {
			category: "Digitalisierung",
			title: "Digitalisierung fängt nicht beim Großprojekt an",
			excerpt: "Sie fängt bei dem einen Ablauf an, der jede Woche Stunden kostet — und den außer Ihnen niemand sieht.",
			tags: "digitalisierung,prozesse,kleine-unternehmen",
			body: [
				"Wenn von Digitalisierung die Rede ist, denken viele sofort an ein großes Vorhaben: neue Software für den ganzen Betrieb, Schulungen, Umstellung, monatelang Unruhe. Das schreckt zu Recht ab. Und es ist meistens gar nicht der richtige Anfang.",
				"Der bessere Anfang ist kleiner und unspektakulärer. Er liegt bei der einen Aufgabe, die jede Woche Zeit frisst und über die sich niemand mehr beschwert, weil alle sich daran gewöhnt haben.",
				"## Drei Fragen, die den Anfang finden",
				"**Welche Zahl schreiben Sie mehr als einmal auf?** Ein Preis, der in der Kasse steht, in einer Preisliste und noch einmal auf der Website. Jede Stelle, an der dieselbe Information ein zweites Mal eingegeben wird, ist eine Stelle, an der sie auseinanderlaufen kann.",
				"**Was fragen Sie regelmäßig bei jemand anderem nach?** Wenn Sie nicht selbst nachsehen können, wie viel noch da ist, dann hängt eine Information an einer Person statt an einem Ort. Das funktioniert, solange die Person da ist.",
				"**Welche Aufgabe schieben Sie regelmäßig auf?** Aufschieben ist ein zuverlässiger Hinweis darauf, dass etwas unnötig umständlich ist. Nicht unwichtig — umständlich.",
				"## Warum klein anfangen der schnellere Weg ist",
				"Ein kleiner Anfang ist schnell wieder rückgängig zu machen. Wenn sich nach vier Wochen zeigt, dass die Lösung nicht passt, haben Sie vier Wochen verloren und nicht ein Jahr.",
				"Er beweist außerdem etwas: Nach der ersten Umstellung wissen Sie nicht mehr theoretisch, sondern konkret, ob digitale Abläufe in Ihrem Betrieb Zeit sparen. Und er zieht den Rest hinter sich her — wer die Artikeldaten einmal sauber an einem Ort hat, hat den Webshop, die Preisliste und die Inventur schon halb gelöst.",
				"## Wo es sich nicht lohnt",
				"Auch das gehört dazu. Ein Ablauf, den Sie zweimal im Jahr durchlaufen, lohnt keine eigene Lösung, egal wie lästig er ist. Und wenn eine bestehende Standardlösung das Problem zu achtzig Prozent trifft, ist das oft besser als eine eigene, die zu hundert Prozent trifft und gepflegt werden muss.",
				"Die Frage ist nie „geht das digital?“ — es geht fast immer. Die Frage ist, ob der Aufwand sich innerhalb eines überschaubaren Zeitraums zurückzahlt."
			].join("\n\n")
		},
		en: {
			category: "Digitalization",
			title: "Digitalization doesn't start with a big project",
			excerpt: "It starts with the one routine that costs hours every week — the one nobody but you can see.",
			tags: "digitalization,workflows,small-business",
			body: [
				"When digitalization comes up, most people picture something large: new software for the whole company, training, migration, months of disruption. That is off-putting for good reason. It is also, usually, the wrong place to start.",
				"The better start is smaller and far less dramatic. It sits with the one task that eats time every week and that nobody complains about any more, because everyone has got used to it.",
				"## Three questions that find the start",
				"**Which number do you write down more than once?** A price that lives in the till, in a price list, and again on the website. Every place the same information is entered a second time is a place where the two can drift apart.",
				"**What do you regularly have to ask somebody else?** If you can't look up yourself how much is left, then a piece of information is attached to a person rather than to a place. That works for exactly as long as the person is there.",
				"**Which task do you keep putting off?** Procrastination is a reliable sign that something is needlessly awkward. Not unimportant — awkward.",
				"## Why starting small is the faster route",
				"A small start is quick to undo. If it turns out after four weeks that the solution doesn't fit, you have lost four weeks and not a year.",
				"It also proves something: after the first change you no longer know in theory but concretely whether digital workflows save time in your business. And it pulls the rest along — get your product data into one place properly and you have half-solved the online shop, the price list and the stocktake.",
				"## Where it isn't worth it",
				"That matters too. A workflow you go through twice a year doesn't justify its own solution, however irritating it is. And where an existing off-the-shelf product hits eighty per cent of the problem, that is often better than a bespoke one that hits a hundred per cent and has to be maintained.",
				"The question is never “can this be done digitally?” — it almost always can. The question is whether the effort pays for itself within a sensible period."
			].join("\n\n")
		}
	},
	{
		slug: "lohnt-sich-ein-webshop",
		publishedAt: date(-18),
		de: {
			category: "Webshop",
			title: "Lohnt sich ein Webshop für mein Ladengeschäft?",
			excerpt: "Nicht für jedes Sortiment. Vier Fragen, die die Antwort meist schon vorwegnehmen.",
			tags: "webshop,onlineverkauf,lokaler-handel",
			body: [
				"Ein Webshop wird oft als naheliegender nächster Schritt gehandelt: Sie haben Produkte, also verkaufen Sie sie eben auch online. In der Praxis ist die Entscheidung weniger eindeutig, weil ein Shop etwas mitbringt, was eine Website nicht hat — **laufende Arbeit**.",
				"Eine Website ist irgendwann fertig. Ein Shop nie: Bestände ändern sich, Preise ändern sich, Bestellungen wollen bearbeitet, verpackt und versendet werden. Das ist der eigentliche Kostenpunkt, nicht die Einrichtung.",
				"## 1. Ist Ihr Sortiment gut versendbar?",
				"Leicht, haltbar, unempfindlich, nicht zu sperrig — das ist die freundliche Seite. Schwer, zerbrechlich, kühlpflichtig oder frisch macht den Versand schnell teurer als die Marge hergibt. Dann kann **Abholung** das bessere Modell sein: online aussuchen und bezahlen, im Laden mitnehmen.",
				"## 2. Wie oft ändern sich Preise und Bestände?",
				"Die kritische Frage ist nicht, ob Sie die Pflege schaffen, sondern **wo** Sie sie tun. Ist sie nur am Rechner im Büro möglich, passiert sie abends oder gar nicht. Geht sie vom Handy aus, während Sie ohnehin an der Ware stehen, passiert sie nebenbei.",
				"## 3. Wer soll dort kaufen?",
				"Es macht einen großen Unterschied, ob der Shop Ihre bestehenden Kunden bequemer bedienen oder neue Kunden aus ganz Deutschland bringen soll. Das erste ist realistisch und schnell zu erreichen. Das zweite bedeutet Wettbewerb mit Anbietern, die Versand im großen Stil betreiben.",
				"## 4. Wer bearbeitet die Bestellungen?",
				"Die unspektakulärste und wichtigste Frage. Eine Bestellung, die drei Tage liegt, weil im Laden Betrieb war, kostet Sie den Kunden. Wenn es keine Antwort darauf gibt, ist der Shop noch nicht bereit — unabhängig davon, wie gut er gebaut ist.",
				"## Ein guter Zwischenschritt",
				"Wenn Sie bei zwei der vier Fragen zögern: eine Seite, die Ihr Sortiment mit Preisen und Verfügbarkeit **zeigt**, ohne zu verkaufen. Das bringt einen großen Teil des Nutzens ohne Zahlungsabwicklung, Versandkosten und tägliche Bestellbearbeitung — und ist die Grundlage, auf der ein echter Shop später aufsetzt."
			].join("\n\n")
		},
		en: {
			category: "Online shop",
			title: "Is an online shop worth it for my local business?",
			excerpt: "Not for every range of products. Four questions that usually answer it for you.",
			tags: "online-shop,ecommerce,local-retail",
			body: [
				"An online shop gets treated as the obvious next step: you have products, so sell them online as well. In practice the decision is less clear-cut, because a shop brings something a website doesn't — **ongoing work**.",
				"A website is finished at some point. A shop never is: stock changes, prices change, orders need processing, packing and sending. That is the real cost, not the setup.",
				"## 1. Does your range ship well?",
				"Light, durable, robust, not too bulky — that's the friendly end. Heavy, fragile, chilled or fresh makes shipping more expensive than the margin allows, fast. Then **collection** may be the better model: choose and pay online, pick up in the shop.",
				"## 2. How often do prices and stock change?",
				"The critical question isn't whether you can manage the upkeep but **where** you do it. If it's only possible at the office computer, it happens in the evening or not at all. If it works from a phone while you're standing next to the goods anyway, it happens in passing.",
				"## 3. Who is meant to buy there?",
				"There's a large difference between serving your existing customers more conveniently and winning new customers from across the country. The first is realistic and quick to reach. The second means competing with sellers who ship at scale.",
				"## 4. Who processes the orders?",
				"The least glamorous and most important question. An order left sitting for three days because the shop was busy costs you the customer. If there's no answer to it, the shop isn't ready — regardless of how well it's built.",
				"## A sensible halfway step",
				"If you hesitate on two of the four questions: a page that **shows** your range with prices and availability without selling. That delivers a large share of the benefit without payment handling, shipping costs and daily order processing — and it is the foundation a real shop can later sit on."
			].join("\n\n")
		}
	},
	{
		slug: "excel-oder-eigenes-werkzeug",
		publishedAt: date(-33),
		de: {
			category: "Werkzeuge",
			title: "Excel-Tabelle oder eigenes Werkzeug? Eine ehrliche Entscheidungshilfe",
			excerpt: "Eine Tabelle trägt erstaunlich weit. Es gibt aber drei Punkte, an denen sie zuverlässig kippt.",
			tags: "excel,werkzeuge,auswertung",
			body: [
				"Excel bekommt zu Unrecht einen schlechten Ruf. Eine Tabelle ist sofort verfügbar, kostet nichts extra, jeder kann sie bedienen, und für erstaunlich viele Aufgaben ist sie schlicht die richtige Antwort. Ich habe schon Kunden davon abgeraten, eine gut funktionierende Tabelle zu ersetzen.",
				"Es gibt aber drei Punkte, an denen eine Tabelle zuverlässig kippt. Wenn Sie zwei davon erreicht haben, wird ein eigenes Werkzeug meistens billiger — nicht in der Anschaffung, sondern über das Jahr gerechnet.",
				"## Kipppunkt 1: Mehr als eine Person arbeitet daran",
				"Sobald zwei Leute gleichzeitig hineinschreiben, beginnt die bekannte Kette aus `Preise_final.xlsx` und `Preise_final_neu_Mai.xlsx`. Das eigentliche Problem ist nicht die gleichzeitige Bearbeitung, sondern dass niemand mehr sicher sagen kann, **welche Datei die richtige ist**.",
				"## Kipppunkt 2: Es gibt Regeln, die jemand einhalten muss",
				"Eine Tabelle nimmt alles an: ein Datum in der Mengenspalte, einen Text im Preisfeld, eine halb leere Zeile. Sie sagt nichts. Der Fehler fällt drei Wochen später auf, und dann ist unklar, seit wann er drin ist. Menschen halten Regeln unter Zeitdruck nicht zuverlässig ein — das ist keine Kritik, das ist einfach so.",
				"## Kipppunkt 3: Dieselben Daten liegen an zwei Orten",
				"Sobald Artikelnummern oder Preise sowohl in der Tabelle als auch in der Kasse oder im Shop stehen, laufen die Stände auseinander. Nicht vielleicht, sondern sicher. Der eigentliche Gewinn eines Werkzeugs ist dann nicht die schönere Oberfläche, sondern dass es **eine Quelle** gibt.",
				"## Was ein eigenes Werkzeug nicht besser kann",
				"In einer Tabelle probieren Sie schnell etwas aus, ohne jemanden zu fragen. Diese Freiheit verlieren Sie zum Teil. Deshalb ist der übliche Fehler, zu viel auf einmal ersetzen zu wollen: Meist übernimmt das Werkzeug die **strukturierte Erfassung**, während die **freie Auswertung** ein Export nach Excel bleiben darf.",
				"## Die einfache Faustregel",
				"Wenn Sie die Tabelle allein pflegen, sie nicht mit anderen Systemen abgleichen müssen und Fehler darin schnell auffallen, dann bleiben Sie dabei. Bei zwei von drei anderslautenden Antworten lohnt es sich zu rechnen."
			].join("\n\n")
		},
		en: {
			category: "Tools",
			title: "Spreadsheet or a tool of your own? An honest way to decide",
			excerpt: "A spreadsheet carries you surprisingly far. There are three points, though, where it reliably tips over.",
			tags: "spreadsheets,tools,reporting",
			body: [
				"Spreadsheets get an unfairly bad name. One is available immediately, costs nothing extra, everybody can use it, and for a surprising number of jobs it is simply the right answer. I have talked clients out of replacing a spreadsheet that was working fine.",
				"There are, however, three points at which a spreadsheet reliably tips over. Once you've hit two of them, a purpose-built tool usually works out cheaper — not to buy, but measured across the year.",
				"## Tipping point 1: more than one person works on it",
				"The moment two people write into it at once, the familiar chain of `prices_final.xlsx` and `prices_final_new_may.xlsx` begins. The real problem isn't simultaneous editing; it's that nobody can say with confidence **which file is the right one**.",
				"## Tipping point 2: there are rules somebody has to follow",
				"A spreadsheet accepts everything: a date in the quantity column, text in the price field, a half-empty row. It says nothing. The error surfaces three weeks later, and by then nobody knows how long it's been there. People don't hold to rules reliably under time pressure — that isn't a criticism, it's just how it is.",
				"## Tipping point 3: the same data lives in two places",
				"As soon as product codes or prices sit both in the spreadsheet and in the till or the shop, the two will drift apart. Not possibly; certainly. At that stage the real gain from a tool isn't the nicer interface but that there is **one source**.",
				"## What a purpose-built tool does worse",
				"In a spreadsheet you try something out quickly without asking anyone. You give up part of that freedom. Which is why the usual mistake is trying to replace too much at once: normally **structured capture** moves into the tool, while **free-form analysis** stays an export to a spreadsheet.",
				"## The simple rule of thumb",
				"If you maintain the spreadsheet on your own, don't have to reconcile it with other systems, and errors in it surface quickly, then stay with it. If two of those three go the other way, it's worth doing the sums."
			].join("\n\n")
		}
	},
	{
		slug: "vom-baukasten-shop-zum-eigenen-shop",
		publishedAt: date(-1),
		de: {
			category: "Webshop",
			title: "Wenn der Baukasten-Shop nicht mehr mitwächst",
			excerpt: "Ein gehosteter Shop-Baukasten trägt die ersten Jahre zuverlässig. Woran man merkt, dass er es nicht mehr tut — und was ein Umzug wirklich bedeutet.",
			tags: "webshop,produktdaten,preispflege",
			body: [
				"Ein gehosteter Shop-Baukasten ist für den Start eine vernünftige Entscheidung. Er kostet wenig, läuft ohne eigenen Server und bringt Zahlungsarten, Versandregeln und eine Bestellabwicklung mit. Irgendwann kippt das Verhältnis: Der Shop läuft weiter wie immer, aber jede Änderung daran kostet mehr Zeit als früher.",
				"## Woran man merkt, dass der Baukasten eng wird",
				"**Das Sortiment wächst schneller als die Werkzeuge.** Zweihundert Artikel pflegt man von Hand, zwanzigtausend nicht mehr. **Der Import bleibt ein Formular** — sobald die Daten des Lieferanten anders aussehen, entsteht Handarbeit. Und **kleine Wünsche werden zu großen Fragen**: In einem Baukasten ist etwas entweder vorgesehen oder es geht nicht.",
				"## Ein Umzug ist kein Design-Projekt",
				"Der Umzug entscheidet sich an den Daten, nicht am Aussehen. Aus dem alten System kommt ein Export, und der ist fast nie so, wie ihn das neue System braucht: Varianten stehen als eigene Artikel nebeneinander, Hersteller heißen an drei Stellen unterschiedlich, Preise enthalten mal Steuer und mal nicht.",
				"## Produktdaten sind das eigentliche Projekt",
				"Bei großen Sortimenten besteht die Pflege aus drei Dingen, die sich wiederholen: **analysieren** (was fehlt, was weicht ab), **filtern** (eine Marke, eine Serie, alles unter einer Marge) und **Preise aktualisieren** — als nachvollziehbarer Lauf, den man zurückdrehen kann, nicht als Reihe einzelner Eingaben.",
				"## Ein Sortiment, mehrere Vertriebskanäle",
				"Jeder Marktplatz will die Daten in seinem eigenen Zuschnitt. Jeden Kanal für sich zu pflegen funktioniert genau so lange, bis sich ein Preis ändert. Tragfähig ist ein gepflegter Datenbestand als Quelle, aus dem jeder Kanal seine Fassung bekommt."
			].join("\n\n")
		},
		en: {
			category: "Online shop",
			title: "When the hosted shop builder stops keeping up",
			excerpt: "A hosted shop builder carries you reliably for the first few years. How to tell when it no longer does — and what a migration actually involves.",
			tags: "online-shop,product-data,pricing",
			body: [
				"A hosted shop builder is a sensible decision at the start. It costs little, runs without a server of your own, and brings payment methods, shipping rules and order handling with it. At some point the balance tips: the shop keeps running exactly as before, but every change to it costs more time than it used to.",
				"## How to tell the builder is getting tight",
				"**The catalogue grows faster than the tools.** Two hundred articles can be maintained by hand, twenty thousand cannot. **The import stays a form** — as soon as a supplier's data looks different, manual work appears. And **small wishes turn into big questions**: in a builder something is either provided for or it is not.",
				"## A migration is not a design project",
				"A migration is decided by the data, not the appearance. The old system produces an export, and it is almost never what the new system needs: variants stand next to each other as separate articles, manufacturers are spelled three different ways, prices sometimes include tax and sometimes do not.",
				"## The product data is the real project",
				"With a large catalogue, upkeep is three repeating things: **analysis** (what is missing, what differs), **filtering** (one brand, one series, everything below a margin) and **price updates** — as a traceable, reversible run rather than a series of individual edits.",
				"## One catalogue, several sales channels",
				"Every marketplace wants the data in its own shape. Maintaining each channel separately works exactly until a price changes. What holds up is one maintained set of data as the source, from which every channel gets its own version."
			].join("\n\n")
		}
	}
];
function summaryFor(seed, id, lang) {
	const v = seed[lang];
	return {
		id,
		slug: seed.slug,
		lang,
		category: v.category,
		title: v.title,
		excerpt: v.excerpt,
		coverHint: null,
		tags: v.tags,
		publishedAt: seed.publishedAt,
		viewCount: id * 137,
		authorId: DEMO_AUTHOR.id,
		author: DEMO_AUTHOR
	};
}
function demoPostList(lang) {
	const langs = lang ? [lang] : ["de"];
	const out = [];
	let id = 1;
	for (const l of langs) for (const seed of SEEDS) out.push(summaryFor(seed, id++, l));
	return out;
}
function demoTopics(lang) {
	if (lang === "en") return {
		headline: "Browse by topic",
		intro: "Three ways into the journal, by the subject you came for.",
		items: [
			{
				title: "Digitalization",
				description: "Starting with one workflow instead of a big project.",
				href: "/en/tag/digitalization"
			},
			{
				title: "Online shops",
				description: "Selling online without complicating the shop floor.",
				href: "/en/tag/online-shop"
			},
			{
				title: "Tools",
				description: "When a spreadsheet stops being the right answer.",
				href: "/en/tag/tools"
			}
		]
	};
	return {
		headline: "Themen im Überblick",
		intro: "Drei Einstiege ins Journal — nach dem Thema, wegen dem Sie hier sind.",
		items: [
			{
				title: "Digitalisierung",
				description: "Mit einem Ablauf anfangen statt mit einem Großprojekt.",
				href: "/tag/digitalisierung"
			},
			{
				title: "Webshops",
				description: "Online verkaufen, ohne den Ladenalltag zu verkomplizieren.",
				href: "/tag/webshop"
			},
			{
				title: "Werkzeuge",
				description: "Wann eine Tabelle nicht mehr die richtige Antwort ist.",
				href: "/tag/werkzeuge"
			}
		]
	};
}
function demoPost(slug, lang) {
	const seed = SEEDS.find((s) => s.slug === slug);
	if (!seed) return null;
	const v = seed[lang];
	return {
		id: SEEDS.indexOf(seed) + 1,
		slug: seed.slug,
		lang,
		category: v.category,
		title: v.title,
		excerpt: v.excerpt,
		body: v.body,
		coverHint: null,
		tags: v.tags,
		publishedAt: seed.publishedAt,
		draft: false,
		createdAt: seed.publishedAt,
		updatedAt: seed.publishedAt,
		viewCount: (SEEDS.indexOf(seed) + 1) * 137,
		authorId: DEMO_AUTHOR.id,
		author: DEMO_AUTHOR
	};
}
//#endregion
//#region src/lib/siteKey.ts
/**
* Request-time protection for paired API reads.
*
* The private key is loaded dynamically from the server-side connection file.
* `connection.ts` retains `TDS_SITE_KEY` only as a one-release host fallback;
* builds and GitHub workflows no longer receive it.
*/
function currentSiteKey() {
	return connection.siteKey();
}
var SiteKeyRejectedError = class extends Error {
	status;
	constructor(status, url) {
		super(`[tds-blog] Der gekoppelte API-Zugang wurde abgelehnt (HTTP ${status}) von ${url}. Bitte den Blog in seinen CMS-Einstellungen neu verbinden.`);
		this.name = "SiteKeyRejectedError";
		this.status = status;
	}
};
var BUCKET = "__tdsSiteKeyRejections__";
var siteKeyRejections = globalThis[BUCKET] ??= [];
var COUNTER = "__tdsSiteKeyRejectionCount__";
function siteKeyRejectionCount() {
	return globalThis[COUNTER] ?? 0;
}
function siteKeyHeaders() {
	return connection.siteKeyHeaders();
}
function assertKeyAccepted(res, url) {
	if (currentSiteKey() === "") return;
	if (res.status !== 401 && res.status !== 403) return;
	const where = String(url);
	if (!siteKeyRejections.includes(where)) siteKeyRejections.push(where);
	const store = globalThis;
	store[COUNTER] = (store[COUNTER] ?? 0) + 1;
	throw new SiteKeyRejectedError(res.status, where);
}
//#endregion
//#region src/lib/content-api.ts
/**
* Make an uploaded cover URL absolute. The content-API's cover endpoint
* persists `coverHint` as a storage-relative `/uploads/...` path, but every
* consumer here (the `<img src>` in `PostCover`, the OG `explicitCover`) gates
* on `startsWith("http")` — a relative path would resolve against the blog
* origin (`blog.tracht-digital.de/uploads/...`) and 404. Resolving it against
* `BASE_URL` (`…/content`) at the data layer means every downstream check just
* works, retroactively, for whatever is already stored. Absolute or empty
* values pass through unchanged.
*/
function resolveCoverHint(coverHint) {
	if (!coverHint) return null;
	if (/^https?:\/\//.test(coverHint)) return coverHint;
	if (coverHint.startsWith("/")) return `${contentApiBase()}${coverHint}`;
	return coverHint;
}
/**
* Make an author's avatar URL absolute — same reasoning as
* {@link resolveCoverHint}. content-api stores `avatarUrl` as a storage-relative
* `/uploads/avatars/...` path; a relative `<img src>` would resolve against the
* blog origin and 404, so anchor it to the content-API origin at the data layer.
*/
function resolveAvatar(avatarUrl) {
	if (!avatarUrl) return null;
	if (/^https?:\/\//.test(avatarUrl)) return avatarUrl;
	if (avatarUrl.startsWith("/")) return `${contentApiBase()}${avatarUrl}`;
	return avatarUrl;
}
/** Resolve an embedded author's avatar to an absolute URL (null author passes through). */
function withResolvedAuthor(post) {
	if (!post.author) return post;
	return {
		...post,
		author: {
			...post.author,
			avatarUrl: resolveAvatar(post.author.avatarUrl)
		}
	};
}
function withResolvedCovers(posts) {
	return posts.map((p) => withResolvedAuthor({
		...p,
		coverHint: resolveCoverHint(p.coverHint)
	}));
}
/**
* Every published post, paginated out of the list endpoint until it is
* exhausted.
*
* ### Why this one is NOT memoised through `contentCache`
*
* It is the obvious candidate — it is the most expensive read on the site and
* the most repeated one — and memoising it would be a real bug.
*
* The cache's control plane resolves a rebuild's page list BEFORE it
* invalidates the generation memo (`resolveEvents(...)` then `onInvalidate()`
* in tds-shared's `pageCache`). Resolving a `post` event walks the corpus to
* find the saved article and derive its category, tag and author pages — so a
* memoised corpus would answer that lookup from the list read before the save.
* A newly published article would simply not be found, its taxonomy pages
* would never be rebuilt, and the rebuild would report success. Nothing would
* go red; the category page would just quietly keep the old list.
*
* The cost is bounded in practice: a page-cache miss reads the corpus once and
* the rendered page is then stored, so this runs per rebuilt page, not per
* visitor.
*/
async function listAllPosts(lang) {
	try {
		const all = [];
		let cursor = null;
		do {
			const url = new URL(`${contentApiBase()}/blog`);
			url.searchParams.set("limit", "50");
			if (lang) url.searchParams.set("lang", lang);
			if (cursor !== null) url.searchParams.set("cursor", String(cursor));
			const res = await fetch(url, { headers: siteKeyHeaders() });
			assertKeyAccepted(res, url);
			if (!res.ok) throw new Error(`content-api ${url.pathname} → ${res.status}`);
			const data = await res.json();
			all.push(...data.posts);
			cursor = data.nextCursor;
		} while (cursor !== null);
		return withResolvedCovers(all);
	} catch (err) {
		console.warn("[tds-blog] content-api unreachable — serving demo posts:", err);
		return demoPostList(lang);
	}
}
/**
* Most-viewed published posts for the blog hero's "Populär" tab. Baked
* at build time (the popularity ordering refreshes on each rebuild);
* view counts themselves accrue at runtime via the article-page beacon.
* Falls back to the newest demo/posts on a DEMO build or a build-time
* outage so the slider always has a populated tab.
*/
async function listPopular(lang, limit = 6) {
	const url = new URL(`${contentApiBase()}/blog/popular`);
	url.searchParams.set("lang", lang);
	url.searchParams.set("limit", String(limit));
	try {
		const res = await fetch(url, { headers: siteKeyHeaders() });
		assertKeyAccepted(res, url);
		if (!res.ok) throw new Error(`content-api ${url.pathname} → ${res.status}`);
		return withResolvedCovers((await res.json()).posts ?? []);
	} catch (err) {
		console.warn("[tds-blog] content-api unreachable — serving demo popular:", err);
		return demoPostList(lang).slice(0, limit);
	}
}
/**
* Curated "Aktuelle Themen" block for the /aktuelles page. Returns null when
* the API is reachable but nothing is maintained yet (or the endpoint isn't
* deployed) — the page then shows only the newest posts. Demo content is only
* served for an explicit DEMO build or a genuine connection failure at build
* time; a *reachable* API that errors stays null so we never bake demo topics
* onto a production page.
*/
async function listTopics(lang) {
	const url = new URL(`${contentApiBase()}/topics`);
	url.searchParams.set("lang", lang);
	try {
		const res = await fetch(url, { headers: siteKeyHeaders() });
		assertKeyAccepted(res, url);
		if (!res.ok) return null;
		return (await res.json()).topics ?? null;
	} catch (err) {
		console.warn("[tds-blog] content-api unreachable — serving demo topics:", err);
		return demoTopics(lang);
	}
}
function landingBlocks() {
	return contentCache.get("landing:blocks", loadLandingBlocks);
}
async function loadLandingBlocks() {
	const url = new URL(`${contentApiBase()}/landing`);
	url.searchParams.set("lang", "de");
	const res = await fetch(url, { headers: siteKeyHeaders() });
	assertKeyAccepted(res, url);
	if (!res.ok) return null;
	return (await res.json()).blocks ?? {};
}
/**
* Whether the public cookie banner is enabled — the language-agnostic
* `cookie_banner` landing content block ({ enabled }, stored under `lang=de`),
* toggled in tds-admin (the toggle fires a rebuild of the entry pages).
* Absent block, demo mode or an unreachable API mean "off" — the safe default.
*/
async function cookieBannerEnabled() {
	try {
		return (await landingBlocks())?.["cookie_banner"]?.enabled === true;
	} catch (err) {
		console.warn("[tds-blog] content-api unreachable — cookie banner off:", err);
		return false;
	}
}
var ADS_OFF = {
	enabled: false,
	publisherId: "",
	defaultMode: "auto",
	slotInArticle: "",
	slotEndArticle: ""
};
/**
* The global AdSense config. `enabled` is the master switch; without an
* `enabled` block or a `publisherId` the whole feature is off — the safe
* default.
*
* Read through {@link landingBlocks}, i.e. memoised per GENERATION rather than
* for the life of the process: under SSR a module-level memo never expires, so
* switching ads on in the panel would never reach a reader no matter how often
* the cache was rebuilt. See src/lib/cache.ts.
*/
async function adsConfig() {
	let block;
	try {
		block = (await landingBlocks())?.["ads"];
	} catch (err) {
		console.warn("[tds-blog] content-api unreachable — ads off:", err);
		return ADS_OFF;
	}
	if (!block || block.enabled !== true) return ADS_OFF;
	const publisherId = typeof block.publisherId === "string" ? block.publisherId : "";
	if (!publisherId) return ADS_OFF;
	return {
		enabled: true,
		publisherId,
		defaultMode: block.defaultMode === "manual" ? "manual" : "auto",
		slotInArticle: typeof block.slotInArticle === "string" ? block.slotInArticle : "",
		slotEndArticle: typeof block.slotEndArticle === "string" ? block.slotEndArticle : ""
	};
}
/** Resolve a post's effective ad mode against the global config. */
function effectiveAdsMode(postAdsMode, ads) {
	if (!ads.enabled || !ads.publisherId) return "off";
	const m = postAdsMode ?? "default";
	if (m === "off") return "off";
	if (m === "auto" || m === "manual") return m;
	return ads.defaultMode;
}
/**
* The custom-snippet catalog. Memoised through `contentCache` so every
* article rendering a `custom` block shares one fetch, while a cache rebuild
* still reads through. Empty on demo mode or an API outage.
*/
function blogSnippets() {
	return contentCache.get("blog:snippets", loadSnippets);
}
async function loadSnippets() {
	const url = new URL(`${contentApiBase()}/snippets`);
	try {
		const res = await fetch(url, { headers: siteKeyHeaders() });
		assertKeyAccepted(res, url);
		if (!res.ok) return [];
		return (await res.json()).snippets ?? [];
	} catch (err) {
		console.warn("[tds-blog] content-api unreachable — no custom snippets:", err);
		return [];
	}
}
async function getPost(slug, lang) {
	const url = new URL(`${contentApiBase()}/blog/${encodeURIComponent(slug)}`);
	url.searchParams.set("lang", lang);
	try {
		const res = await fetch(url, { headers: siteKeyHeaders() });
		assertKeyAccepted(res, url);
		if (res.status === 404) return null;
		if (!res.ok) throw new Error(`content-api ${url.pathname} → ${res.status}`);
		const { post } = await res.json();
		return withResolvedAuthor({
			...post,
			coverHint: resolveCoverHint(post.coverHint)
		});
	} catch (err) {
		console.warn("[tds-blog] content-api unreachable — serving demo post:", err);
		return demoPost(slug, lang);
	}
}
/**
* Slice an already-sorted (newest-first) array into a 1-indexed page
* window. Used by both `/` (page 1) and `/page/[num]`.
*/
function paginate(all, page, pageSize = 10) {
	const pageCount = Math.max(1, Math.ceil(all.length / pageSize));
	const clamped = Math.min(Math.max(1, page), pageCount);
	const start = (clamped - 1) * pageSize;
	return {
		items: all.slice(start, start + pageSize),
		page: clamped,
		pageCount,
		hasOlder: clamped < pageCount,
		hasNewer: clamped > 1
	};
}
/**
* URL-safe slug for a category name. Categories are free-text on the post,
* so transliterate the German umlauts first, then collapse everything else
* to single hyphens (matching the lowercase tag-slug convention).
*/
function categorySlug(name) {
	return name.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
async function getTaxonomy(lang) {
	return contentCache.get(`taxonomy:${lang}`, () => deriveTaxonomy(lang));
}
async function deriveTaxonomy(lang) {
	let posts = [];
	try {
		posts = await listAllPosts(lang);
	} catch {
		posts = [];
	}
	const catCounts = /* @__PURE__ */ new Map();
	for (const p of posts) {
		const name = p.category?.trim();
		if (!name) continue;
		const slug = categorySlug(name);
		if (!slug) continue;
		const entry = catCounts.get(slug);
		if (entry) entry.count += 1;
		else catCounts.set(slug, {
			name,
			count: 1
		});
	}
	const categories = Array.from(catCounts.entries()).map(([slug, { name, count }]) => ({
		name,
		slug,
		count
	})).sort((a, b) => a.name.localeCompare(b.name, lang));
	const tagCounts = /* @__PURE__ */ new Map();
	for (const p of posts) {
		if (!p.tags) continue;
		for (const t of p.tags.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
	}
	return {
		categories,
		topTags: Array.from(tagCounts.entries()).map(([name, count]) => ({
			name,
			count
		})).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)).slice(0, 8)
	};
}
//#endregion
//#region src/lib/routes.ts
/**
* The corpus queries the dynamic routes used to express as `getStaticPaths`.
*
* ### Why they moved here
*
* Under `output: "static"` each dynamic route enumerated its own pages and
* handed the matching subset in as props. Server-rendered, that inverts:
* **`getStaticPaths` is not allowed on an on-demand route** — the page reads
* `Astro.params` and has to answer 404 itself. Twelve routes needed the same
* shape, so the grouping lives here, once, and each page is left with a
* lookup and a guard.
*
* Every function returns `null` for "no such page", which is the signal to
* answer 404. Returning an empty list instead would render a category page
* for a category nobody wrote — indexable, empty and permanently 200.
*/
/**
* Every published post in a language.
*
* Thin wrapper so a failure is a failure: `listAllPosts` is fail-soft and
* answers `[]` when the API is unreachable, which for an index page is the
* right thing (an empty journal beats a 500) and for a *detail* page is not —
* see the individual lookups below, which cannot tell "no such tag" from
* "the API is down" and deliberately treat both as 404.
*/
async function corpus(lang) {
	return listAllPosts(lang);
}
/** Posts in one category, plus the original (unslugged) name. */
async function byCategory(lang, slug) {
	const wanted = slug.trim().toLowerCase();
	if (!wanted) return null;
	let name = null;
	const posts = [];
	for (const post of await corpus(lang)) {
		const category = post.category?.trim();
		if (!category || categorySlug(category) !== wanted) continue;
		name ??= category;
		posts.push(post);
	}
	return name === null ? null : {
		name,
		posts
	};
}
/** Posts carrying one tag. Tags are a comma-separated, case-insensitive list. */
async function byTag(lang, tag) {
	const wanted = tag.trim().toLowerCase();
	if (!wanted) return null;
	const allPosts = await corpus(lang);
	const posts = allPosts.filter((post) => (post.tags ?? "").split(",").map((t) => t.trim().toLowerCase()).filter(Boolean).includes(wanted));
	return posts.length === 0 ? null : {
		posts,
		allPosts
	};
}
/** Posts by one author, plus the author record. */
async function byAuthor(lang, slug) {
	const wanted = slug.trim();
	if (!wanted) return null;
	let author = null;
	const posts = [];
	for (const post of await corpus(lang)) {
		if (post.author?.slug !== wanted) continue;
		author ??= post.author;
		posts.push(post);
	}
	return author === null ? null : {
		author,
		posts
	};
}
/**
* One page of the paginated archive.
*
* Page 1 is `/` and is not served by `/page/[num]`, so a request for
* `/page/1` is a 404 here — exactly as under the static build, which never
* emitted it. Anything past the last page is a 404 too, rather than an empty
* list: a crawler that discovers `/page/99` should be told it does not exist.
*/
async function archivePage(lang, num) {
	if (!/^[0-9]+$/.test(num)) return null;
	const page = Number(num);
	if (page < 2) return null;
	const allPosts = await corpus(lang);
	if (page > Math.max(1, Math.ceil(allPosts.length / 10))) return null;
	return {
		allPosts,
		page
	};
}
//#endregion
//#region src/lib/cache.ts
/**
* This site's half of the page cache: which pages a content change dates, and
* the memo that a rebuild throws away.
*
* The API sends *what changed* (`{type:"post", id:"mein-artikel", lang:"de"}`);
* this file answers *which of my pages that is*. It is the richest of the three
* sites' maps, and that richness is exactly why the API must not own it: one
* saved article dates its own page, its print view, the journal index, the
* paginated archive, its category, each of its tags, its author page, the feed,
* the "Für Sie" index and the sitemap — and the English routes are not a prefix
* of the German ones (`/kategorie/…` vs `/en/category/…`, `/autor/…` vs
* `/en/author/…`).
*/
/**
* The one memo every content fetch on this site shares.
*
* It replaces the module-level caches `content-api.ts`, `taxonomy.ts` and
* `translate.ts` used to keep. Those were right while this site was a static
* build — one process, one walk of the corpus, then exit — and become
* *permanent* under SSR: the server would answer with the corpus it read at
* boot, for the life of the process, and a cache rebuild would faithfully
* re-render that stale content and report success.
*/
var contentCache = createGenerationCache();
/** Language-tree prefix. German lives at the root. */
var prefix = (lang) => lang === "de" ? "" : "/en";
/** Taxonomy segment names differ per tree — they do not mirror by prefix. */
var segments = {
	de: {
		category: "kategorie",
		author: "autor"
	},
	en: {
		category: "category",
		author: "author"
	}
};
/**
* The pages that LIST articles, per language.
*
* Every archive page is included because pagination shifts: publishing one
* article pushes the last item of every page onto the next, so rebuilding only
* page 1 leaves the rest showing one article twice and hiding another. The
* page count is derived from the corpus rather than guessed.
*/
async function indexPages(lang) {
	const p = prefix(lang);
	const posts = await corpus(lang);
	const pageCount = Math.max(1, Math.ceil(posts.length / 10));
	const archive = [];
	for (let n = 2; n <= pageCount; n++) archive.push(`${p}/page/${n}`);
	return [
		`${p}/`,
		...archive,
		`${p}/aktuelles`,
		`${p}/rss.xml`,
		"/interests-index.json",
		"/sitemap-0.xml"
	];
}
/** The taxonomy pages one article appears on, in its own language tree. */
function taxonomyPages(post, lang) {
	const p = prefix(lang);
	const s = segments[lang];
	const out = [];
	const category = post.category?.trim();
	if (category) {
		const slug = categorySlug(category);
		if (slug) out.push(`${p}/${s.category}/${slug}`);
	}
	for (const tag of (post.tags ?? "").split(",").map((t) => t.trim().toLowerCase())) if (tag) out.push(`${p}/tag/${encodeURIComponent(tag)}`);
	if (post.author?.slug) out.push(`${p}/${s.author}/${post.author.slug}`);
	return out;
}
/**
* The route table, as the cache sees it.
*
* **The taxonomy pages are resolved by LOOKING THE ARTICLE UP**, which is why
* the resolver is async. Category, tags and author are properties of the
* article, not of the event, so without the lookup a save would never refresh
* the category page that lists it.
*
* One limit worth stating plainly: this covers the article's CURRENT taxonomy.
* Re-categorising an article leaves its former category page listing it, and
* nothing in the event carries the old value. That is what "alles neu bauen"
* is for, and it is a deliberate trade rather than an oversight.
*/
var cacheEvents = {
	/** An article was saved, published, unpublished or deleted. */
	post: async (event) => {
		const slug = event.id;
		const langs = event.lang === "de" || event.lang === "en" ? [event.lang] : ["de", "en"];
		const paths = [];
		for (const lang of langs) {
			paths.push(...await indexPages(lang));
			if (!slug) continue;
			const p = prefix(lang);
			paths.push(`${p}/${slug}`, `${p}/${slug}/print`, `/og/${lang}/${slug}.png`);
			const post = (await corpus(lang)).find((candidate) => candidate.slug === slug);
			if (post) paths.push(...taxonomyPages(post, lang));
		}
		return paths;
	},
	/**
	* A landing content block changed.
	*
	* The blog reads `/content/landing` too — its cookie-banner switch and the
	* AdSense configuration live in that site's blocks, and both appear on every
	* page here. Only the entry points are rebuilt; the rest of the corpus
	* catches up on the next "alles neu bauen", because rebuilding every article
	* for a banner toggle would be a denial of service against our own API.
	*/
	block: (event) => forLanguages(event, (lang) => [prefix(lang) + "/"]),
	/**
	* The sitemap exclusion list changed.
	*
	* The widest event this site has, and it has to be. The list moves TWO
	* things: the sitemap, and the `robots` meta of every page that entered or
	* left it. Rebuilding only the sitemap would leave the excluded page itself
	* serving its old, indexable head out of cache — the omission visible in the
	* XML, the `noindex` nowhere, and nothing red.
	*
	* A pattern may be a prefix, so which pages it covers is not knowable from
	* the event. The corpus is walked for that reason, exactly as `post` walks it
	* for taxonomy: the article pages are what a `noindex` has to reach, and they
	* are deliberately absent from `alwaysPaths`.
	*/
	sitemap: async (event) => {
		const langs = event.lang === "de" || event.lang === "en" ? [event.lang] : ["de", "en"];
		const paths = ["/sitemap-index.xml"];
		for (const lang of langs) {
			paths.push(...await indexPages(lang));
			const p = prefix(lang);
			for (const post of await corpus(lang)) paths.push(`${p}/${post.slug}`, ...taxonomyPages(post, lang));
		}
		return paths;
	},
	/** The legal documents live on the landingpage; nothing here shows them. */
	legal: () => []
};
/**
* Pages a "rebuild everything" must include even when nothing is cached yet.
*
* Articles are deliberately absent: the cache cannot know the corpus, and
* enumerating it here would be a fourth copy of the route table. "Rebuild
* everything" covers whatever is already cached plus these entry points, which
* is what an operator means by it.
*/
var alwaysPaths = [
	"/",
	"/en/",
	"/aktuelles",
	"/en/aktuelles",
	"/rss.xml",
	"/en/rss.xml",
	"/interests-index.json",
	"/sitemap-0.xml",
	"/sitemap-index.xml"
];
//#endregion
export { pageCache as C, siteKeyRejectionCount as S, listAllPosts as _, byAuthor as a, assertKeyAccepted as b, corpus as c, paginate as d, adsConfig as f, getPost as g, effectiveAdsMode as h, archivePage as i, categorySlug as l, cookieBannerEnabled as m, cacheEvents as n, byCategory as o, blogSnippets as p, contentCache as r, byTag as s, alwaysPaths as t, getTaxonomy as u, listPopular as v, resolveCacheDirs as w, siteKeyHeaders as x, listTopics as y };
