import { chmod, mkdir, readFile, rename, rm, writeFile } from "fs/promises";
import { isAbsolute, resolve } from "path";
import { chmodSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "fs";
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/connection/index.js
var PROFILE = /^(blog|landingpage|tools)$/;
function cleanBase(value, root) {
	return isAbsolute(value) ? resolve(value) : resolve(root, value);
}
function resolveConnectionDirectory(options) {
	if (!PROFILE.test(options.profile)) throw new Error("invalid_connection_profile");
	const root = resolve(options.root ?? process.cwd());
	const env = options.env ?? process.env;
	const configured = (options.stateDir ?? env.TDS_STATE_DIR ?? "").trim();
	const base = configured === "" ? resolve(root, "..", ".tds-state") : cleanBase(configured, root);
	return resolve(base, options.profile);
}
function isPlainObject(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
function pureHttpsOrigin(value) {
	if (typeof value !== "string") return null;
	try {
		const url = new URL(value);
		if (url.protocol !== "https:") return null;
		if (url.username || url.password || url.search || url.hash || url.pathname !== "/") return null;
		return url.origin;
	} catch {
		return null;
	}
}
function parseConnection(value, profile) {
	if (!isPlainObject(value) || value.version !== 1 || value.profile !== profile) return null;
	const origin = pureHttpsOrigin(value.origin);
	const apiBase = pureHttpsOrigin(value.apiBase);
	if (!origin || !apiBase) return null;
	if (typeof value.siteKey !== "string" || value.siteKey.trim() === "") return null;
	if (typeof value.cacheToken !== "string" || value.cacheToken.trim() === "") return null;
	if (typeof value.pairingId !== "string" || value.pairingId.trim() === "") return null;
	if (typeof value.connectedAt !== "string" || !Number.isFinite(Date.parse(value.connectedAt))) return null;
	if (!isPlainObject(value.resource) || typeof value.resource.type !== "string") return null;
	if (typeof value.resource.id !== "string" && typeof value.resource.id !== "number") return null;
	if (!isPlainObject(value.runtime)) return null;
	return {
		version: 1,
		profile,
		origin,
		apiBase,
		siteKey: value.siteKey,
		cacheToken: value.cacheToken,
		resource: {
			type: value.resource.type,
			id: value.resource.id
		},
		runtime: value.runtime,
		pairingId: value.pairingId,
		connectedAt: new Date(value.connectedAt).toISOString()
	};
}
var ConnectionStore = class {
	profile;
	directory;
	file;
	constructor(options) {
		this.profile = options.profile;
		this.directory = resolveConnectionDirectory(options);
		this.file = resolve(this.directory, "connection.json");
	}
	readSync() {
		try {
			return parseConnection(JSON.parse(readFileSync(this.file, "utf8")), this.profile);
		} catch {
			return null;
		}
	}
	async read() {
		try {
			return parseConnection(JSON.parse(await readFile(this.file, "utf8")), this.profile);
		} catch {
			return null;
		}
	}
	writeSync(connection) {
		const parsed = parseConnection(connection, this.profile);
		if (!parsed) throw new Error("invalid_connection_state");
		mkdirSync(this.directory, {
			recursive: true,
			mode: 448
		});
		const temporary = `${this.file}.${process.pid}.${crypto.randomUUID()}.tmp`;
		try {
			writeFileSync(temporary, `${JSON.stringify(parsed, null, 2)}
`, {
				encoding: "utf8",
				flag: "wx",
				mode: 384
			});
			chmodSync(temporary, 384);
			renameSync(temporary, this.file);
			chmodSync(this.file, 384);
		} catch (error) {
			rmSync(temporary, { force: true });
			throw error;
		}
	}
	async write(connection) {
		const parsed = parseConnection(connection, this.profile);
		if (!parsed) throw new Error("invalid_connection_state");
		await mkdir(this.directory, {
			recursive: true,
			mode: 448
		});
		const temporary = `${this.file}.${process.pid}.${crypto.randomUUID()}.tmp`;
		try {
			await writeFile(temporary, `${JSON.stringify(parsed, null, 2)}
`, {
				encoding: "utf8",
				flag: "wx",
				mode: 384
			});
			await chmod(temporary, 384);
			await rename(temporary, this.file);
			await chmod(this.file, 384);
		} catch (error) {
			await rm(temporary, { force: true });
			throw error;
		}
	}
	async remove() {
		await rm(this.file, { force: true });
	}
};
var RUNTIME_KEYS = [
	"apiBase",
	"authBase",
	"loginUrl",
	"contactUrl",
	"liveChatFrontend"
];
function valueOf(value) {
	return (typeof value === "function" ? value() : value ?? "").trim();
}
function runtimeOf(value) {
	return typeof value === "function" ? value() : value ?? {};
}
function json(body, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "no-store",
			"x-content-type-options": "nosniff"
		}
	});
}
function normalizeSecureOrigin(value) {
	try {
		const url = new URL(value);
		const loopback = url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]";
		if (url.protocol !== "https:" && !(url.protocol === "http:" && loopback)) return null;
		if (url.username || url.password || url.search || url.hash || url.pathname !== "/") return null;
		return url.origin;
	} catch {
		return null;
	}
}
function runtimeConfig(profile, apiBase, supplied, generatedAt) {
	const out = {
		version: 1,
		site: profile,
		mode: "direct",
		generatedAt,
		apiBase
	};
	for (const key of RUNTIME_KEYS) {
		const value = supplied?.[key];
		if (typeof value === "string" && value.trim() !== "") out[key] = value.trim().replace(/\/+$/, "");
	}
	out.apiBase = apiBase;
	return out;
}
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
function parseExchange(value, profile, origin, apiBase, connectedAt) {
	if (!isRecord(value) || typeof value.pairing_id !== "string" || typeof value.finalize_token !== "string") return null;
	const wire = value.connection;
	if (!isRecord(wire) || wire.version !== 1 || wire.profile !== profile) return null;
	if (normalizeSecureOrigin(String(wire.origin ?? "")) !== origin) return null;
	if (normalizeSecureOrigin(String(wire.api_base ?? "")) !== apiBase) return null;
	if (typeof wire.site_key !== "string" || wire.site_key.trim() === "") return null;
	if (typeof wire.cache_token !== "string" || wire.cache_token.trim() === "") return null;
	if (!isRecord(wire.resource) || typeof wire.resource.type !== "string") return null;
	if (typeof wire.resource.id !== "string" && typeof wire.resource.id !== "number") return null;
	const suppliedRuntime = isRecord(wire.runtime) ? wire.runtime : void 0;
	return {
		finalizeToken: value.finalize_token,
		connection: {
			version: 1,
			profile,
			origin,
			apiBase,
			siteKey: wire.site_key,
			cacheToken: wire.cache_token,
			resource: {
				type: wire.resource.type,
				id: wire.resource.id
			},
			runtime: runtimeConfig(profile, apiBase, suppliedRuntime, connectedAt),
			pairingId: value.pairing_id,
			connectedAt
		}
	};
}
function deadline() {
	return typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(1e4) : void 0;
}
var SiteConnectionService = class {
	profile;
	store;
	options;
	fetcher;
	constructor(options) {
		this.profile = options.profile;
		this.options = options;
		this.store = new ConnectionStore(options);
		this.fetcher = options.fetch ?? fetch;
	}
	current() {
		return this.store.readSync();
	}
	apiBase() {
		return this.current()?.apiBase ?? normalizeSecureOrigin(valueOf(this.options.fallbackApiBase)) ?? "";
	}
	siteKey() {
		return this.current()?.siteKey ?? valueOf(this.options.fallbackSiteKey);
	}
	cacheToken() {
		return this.current()?.cacheToken ?? valueOf(this.options.fallbackCacheToken);
	}
	siteKeyHeaders() {
		const key = this.siteKey();
		return key === "" ? void 0 : { "X-TDS-Site-Key": key };
	}
	publicRuntime() {
		const current = this.current();
		if (current) return {
			...current.runtime,
			apiBase: current.apiBase
		};
		const base = this.apiBase();
		return runtimeConfig(this.profile, base, runtimeOf(this.options.fallbackRuntime), (this.options.now ?? (() => /* @__PURE__ */ new Date()))().toISOString());
	}
	status() {
		const current = this.current();
		return {
			connected: current !== null,
			profile: this.profile,
			origin: current?.origin ?? null,
			api_base: current?.apiBase ?? (this.apiBase() || null),
			resource: current?.resource ?? null,
			connected_at: current?.connectedAt ?? null,
			legacy_environment: current === null && (this.siteKey() !== "" || this.cacheToken() !== "")
		};
	}
	/** Execute exchange → durable write/verify → finalize, rolling back on failure. */
	async connect(body, requestOrigin) {
		const origin = normalizeSecureOrigin(requestOrigin);
		const apiBase = normalizeSecureOrigin(body.api_base);
		if (!origin || !apiBase) throw new ConnectionError("invalid_origin", 422);
		if (!new Set([
			normalizeSecureOrigin(valueOf(this.options.fallbackApiBase)),
			this.current()?.apiBase ?? null,
			...(this.options.trustedApiBases ?? []).map(normalizeSecureOrigin)
		].filter((value) => value !== null)).has(apiBase)) throw new ConnectionError("untrusted_api_origin", 422);
		if (!/^[A-Za-z0-9_-]{32,512}$/.test(body.pairing_token)) throw new ConnectionError("invalid_pairing_token", 422);
		const exchangeResponse = await this.request(`${apiBase}/sites/pairings/exchange`, {
			pairing_token: body.pairing_token,
			profile: this.profile,
			origin
		});
		if (!exchangeResponse.ok) throw new ConnectionError("exchange_failed", exchangeResponse.status === 401 || exchangeResponse.status === 410 ? exchangeResponse.status : 502);
		const connectedAt = (this.options.now ?? (() => /* @__PURE__ */ new Date()))().toISOString();
		const parsed = parseExchange(await exchangeResponse.json().catch(() => null), this.profile, origin, apiBase, connectedAt);
		if (!parsed) throw new ConnectionError("invalid_exchange_response", 502);
		const previous = await this.store.read();
		try {
			await this.store.write(parsed.connection);
			const verified = await this.store.read();
			if (!verified || verified.pairingId !== parsed.connection.pairingId || verified.siteKey !== parsed.connection.siteKey || verified.cacheToken !== parsed.connection.cacheToken) throw new Error("connection_verification_failed");
		} catch (error) {
			await this.restore(previous);
			throw new ConnectionError("state_write_failed", 500, error);
		}
		let finalized;
		try {
			finalized = await this.request(`${apiBase}/sites/pairings/finalize`, {
				pairing_id: parsed.connection.pairingId,
				finalize_token: parsed.finalizeToken,
				profile: this.profile,
				origin
			});
		} catch (error) {
			await this.restore(previous);
			throw error;
		}
		if (!finalized.ok) {
			await this.restore(previous);
			throw new ConnectionError("finalize_failed", 502);
		}
		let warning;
		try {
			await this.options.onConnected?.(parsed.connection);
		} catch {
			warning = "post_connect_failed";
		}
		return {
			connected: true,
			profile: this.profile,
			origin,
			resource: parsed.connection.resource,
			connected_at: connectedAt,
			...warning ? { warning } : {}
		};
	}
	async handleConnect(request) {
		if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
		const size = Number(request.headers.get("content-length") ?? 0);
		if (Number.isFinite(size) && size > 16384) return json({ error: "payload_too_large" }, 413);
		let body;
		try {
			body = await request.json();
		} catch {
			return json({ error: "invalid_json" }, 400);
		}
		if (!isRecord(body) || typeof body.pairing_token !== "string" || typeof body.api_base !== "string") return json({ error: "invalid_payload" }, 422);
		try {
			return json(await this.connect(body, new URL(request.url).origin));
		} catch (error) {
			if (error instanceof ConnectionError) return json({ error: error.code }, error.status);
			return json({ error: "connection_failed" }, 502);
		}
	}
	async request(url, body) {
		try {
			return await this.fetcher(url, {
				method: "POST",
				redirect: "error",
				headers: {
					"content-type": "application/json",
					accept: "application/json"
				},
				body: JSON.stringify(body),
				signal: deadline()
			});
		} catch (error) {
			throw new ConnectionError("api_unreachable", 502, error);
		}
	}
	async restore(previous) {
		try {
			if (previous) await this.store.write(previous);
			else await this.store.remove();
		} catch {}
	}
};
var ConnectionError = class extends Error {
	constructor(code, status, options) {
		super(code, options === void 0 ? void 0 : { cause: options });
		this.code = code;
		this.status = status;
		this.name = "ConnectionError";
	}
	code;
	status;
};
function siteConnection(options) {
	return new SiteConnectionService(options);
}
function connectionStatusResponse(service) {
	return json(service.status());
}
function runtimeConfigResponse(service) {
	return json(service.publicRuntime());
}
//#endregion
//#region src/lib/connection.ts
var DEFAULT_API_BASE = "https://api.tracht-digital.de";
function buildApiBase() {
	return `${DEFAULT_API_BASE}/content`.trim().replace(/\/+$/, "").replace(/\/content$/, "") || DEFAULT_API_BASE;
}
function buildLoginUrl() {
	return "https://auth.tracht-digital.de".trim().replace(/\/+$/, "") || "https://auth.tracht-digital.de";
}
var connection = siteConnection({
	profile: "blog",
	fallbackApiBase: buildApiBase,
	fallbackSiteKey: () => process.env.TDS_SITE_KEY ?? "",
	fallbackCacheToken: () => process.env.TDS_CACHE_TOKEN ?? "",
	fallbackRuntime: () => {
		const apiBase = buildApiBase();
		return {
			apiBase,
			loginUrl: buildLoginUrl(),
			contactUrl: `${apiBase}/contact`,
			liveChatFrontend: "blog"
		};
	}
});
var contentApiBase = () => `${connection.apiBase() || DEFAULT_API_BASE}/content`;
var connectResponse = (request) => connection.handleConnect(request);
var connectStatusResponse = () => connectionStatusResponse(connection);
var publicRuntimeResponse = () => runtimeConfigResponse(connection);
//#endregion
export { publicRuntimeResponse as a, contentApiBase as i, connectStatusResponse as n, connection as r, connectResponse as t };
