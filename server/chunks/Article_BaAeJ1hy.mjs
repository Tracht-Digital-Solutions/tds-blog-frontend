import { A as maybeRenderHead, C as renderComponent, I as unescapeHTML, P as addAttribute, k as renderTemplate, w as Fragment } from "./sequence_4TwHRs5k.mjs";
import { a as ProductCard, d as renderScript, f as createComponent, l as imageHints, t as $$Layout } from "./Layout_CE6wMohm.mjs";
import { t as createAstro } from "./compiler_DUKTb6Ws.mjs";
import { T as readContentJson, f as categorySlug, g as blogSnippets, h as adsConfig, v as effectiveAdsMode, w as memoisedOr } from "./cache_hGs3QUYP.mjs";
import { i as contentApiBase } from "./connection_BFCPUvLv.mjs";
import { a as splitProductShortcodes, i as slugify$2, n as renderBlockHtml, o as stripProductShortcodes } from "./localizedPost_Bx8xW8l7.mjs";
import { i as categoryHref, r as authorHref } from "./nav_CgKRV2dv.mjs";
import { n as siteConfig, t as pageTitle } from "./seo_DXIXsesw.mjs";
import { r as PostCard } from "./PostCard_DupH8M-a.mjs";
import { t as $$TagList } from "./TagList_C3TZdAPu.mjs";
import { a as breadcrumbSchema, l as organizationSchema, r as blogPostingSchema, s as faqPageSchema } from "./jsonld_C09Kkd8q.mjs";
import { i as postDescription } from "./metaDescription_B0TO73mZ.mjs";
// node_modules/zod/v4/core/util.js
function getEnumValues(entries) {
	const numericValues = Object.values(entries).filter((v) => typeof v === "number");
	return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
}
function joinValues(array, separator = "|") {
	return array.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_, value) {
	if (typeof value === "bigint") return value.toString();
	return value;
}
var Cached = class {
	constructor(getter) {
		this._getter = getter;
		this._value = void 0;
	}
	get value() {
		const getter = this._getter;
		if (getter !== void 0) {
			this._value = getter();
			this._getter = void 0;
		}
		return this._value;
	}
};
function cached(getter) {
	return new Cached(getter);
}
function nullish(input) {
	return input === null || input === void 0;
}
function cleanRegex(source) {
	const start = source.startsWith("^") ? 1 : 0;
	const end = source.endsWith("$") ? source.length - 1 : source.length;
	return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
	const ratio = val / step;
	const roundedRatio = Math.round(ratio);
	const tolerance = 4 * Number.EPSILON * Math.max(Math.abs(ratio), 1);
	if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
	return ratio - roundedRatio;
}
function assignProp(target, prop, value) {
	Object.defineProperty(target, prop, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
}
/**
* Whichever object a def's `shape` currently answers from: the one the caller passed until the first read, the frozen copy after it.
*
* Its keys and descriptors read without invoking anything, which is what lets a discriminated union check its discriminator, and the cycle walk read a shape, without resolving a getter that references the schema being constructed. A def that answers `shape` from an accessor of its own has none.
*/
function rawShape(def) {
	const desc = Object.getOwnPropertyDescriptor(def, "shape");
	return desc?.get ? desc.get.raw : desc?.value;
}
function sourceShape(schema) {
	return rawShape(schema._zod.def) ?? schema._zod.def.shape;
}
function deferProp(target, key, getter) {
	Object.defineProperty(target, key, {
		get() {
			const value = getter();
			assignProp(this, key, value);
			return value;
		},
		enumerable: true,
		configurable: true
	});
}
function putProp(target, key, value) {
	if (key in target) assignProp(target, key, value);
	else target[key] = value;
}
/**
* Copies `keys` of `source`'s shape onto `target`, each value passed through `wrap`.
*
* A key the source has resolved is copied through now, so the derived shape states it outright and nothing has to resolve it to learn what it holds. A key the source still defers stays deferred, and reads back through the source's own `shape`, so it resolves once and both shapes get that one schema.
*/
function mirrorShape(target, source, keys, wrap) {
	const raw = sourceShape(source);
	for (const key of keys) {
		const desc = Object.getOwnPropertyDescriptor(raw, key);
		if (!desc.enumerable) continue;
		if (desc.get) deferProp(target, key, () => {
			const value = source._zod.def.shape[key];
			return wrap ? wrap(value, key) : value;
		});
		else putProp(target, key, wrap ? wrap(desc.value, key) : desc.value);
	}
}
function mirrorProps(target, source) {
	for (const key of Reflect.ownKeys(source)) {
		const desc = Object.getOwnPropertyDescriptor(source, key);
		if (!desc.enumerable) continue;
		if (desc.get) deferProp(target, key, () => source[key]);
		else putProp(target, key, desc.value);
	}
}
function mergeDefs(...defs) {
	const mergedDescriptors = {};
	for (const def of defs) {
		const descriptors = Object.getOwnPropertyDescriptors(def);
		Object.assign(mergedDescriptors, descriptors);
	}
	return Object.defineProperties({}, mergedDescriptors);
}
function esc(str) {
	return JSON.stringify(str);
}
function slugify$1(input) {
	return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject(data) {
	return typeof data === "object" && data !== null && !Array.isArray(data);
}
var allowsEval = /* @__PURE__*/ cached(() => {
	if (globalConfig.jitless) return false;
	if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
	try {
		new Function("");
		return true;
	} catch (_) {
		return false;
	}
});
function isPlainObject(o) {
	if (isObject(o) === false) return false;
	const ctor = o.constructor;
	if (ctor === void 0) return true;
	if (typeof ctor !== "function") return true;
	const prot = ctor.prototype;
	if (isObject(prot) === false) return false;
	if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
	return true;
}
function shallowClone(o) {
	if (isPlainObject(o)) return { ...o };
	if (Array.isArray(o)) return [...o];
	if (o instanceof Map) return new Map(o);
	if (o instanceof Set) return new Set(o);
	return o;
}
var propertyKeyTypes = /* @__PURE__*/ new Set([
	"string",
	"number",
	"symbol"
]);
function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
	const cl = new inst._zod.constr(def ?? inst._zod.def);
	if (!def || params?.parent) cl._zod.parent = inst;
	return cl;
}
function normalizeParams(_params) {
	const params = _params;
	if (!params) return {};
	if (typeof params === "string") return { error: () => params };
	if (params?.message !== void 0) {
		if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
		params.error = params.message;
	}
	delete params.message;
	if (typeof params.error === "string") return {
		...params,
		error: () => params.error
	};
	return params;
}
function stringifyPrimitive(value) {
	if (typeof value === "bigint") return value.toString() + "n";
	if (typeof value === "string") return `"${value}"`;
	return `${value}`;
}
function optionalKeys(shape) {
	return Object.keys(shape).filter((k) => {
		return shape[k]._zod.optin !== void 0 && shape[k]._zod.optout === "optional";
	});
}
var NUMBER_FORMAT_RANGES = /*@__PURE__*/ (() => ({
	safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}))();
var BIGINT_FORMAT_RANGES = {
	int64: [/* @__PURE__*/ BigInt("-9223372036854775808"), /* @__PURE__*/ BigInt("9223372036854775807")],
	uint64: [/* @__PURE__*/ BigInt(0), /* @__PURE__*/ BigInt("18446744073709551615")]
};
function pick(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
	const newShape = {};
	mirrorShape(newShape, schema, maskedKeys(schema, mask));
	return clone(schema, mergeDefs(currDef, {
		shape: newShape,
		checks: []
	}));
}
function maskedKeys(schema, mask) {
	const raw = sourceShape(schema);
	const keys = [];
	for (const key of Reflect.ownKeys(mask)) {
		if (!Object.getOwnPropertyDescriptor(raw, key)?.enumerable) throw new Error(`Unrecognized key: "${String(key)}"`);
		if (mask[key]) keys.push(key);
	}
	return keys;
}
function omit(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
	const omitted = new Set(maskedKeys(schema, mask));
	const newShape = {};
	mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)).filter((key) => !omitted.has(key)));
	return clone(schema, mergeDefs(currDef, {
		shape: newShape,
		checks: []
	}));
}
function extend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) {
		const existingShape = sourceShape(schema);
		for (const key of Reflect.ownKeys(shape)) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function extended(schema, shape) {
	const newShape = {};
	mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)));
	mirrorProps(newShape, shape);
	return newShape;
}
function safeExtend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
	return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function merge(a, b) {
	if (!b?._zod?.def) throw new Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
	if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
	const newShape = {};
	mirrorShape(newShape, a, Reflect.ownKeys(sourceShape(a)));
	mirrorShape(newShape, b, Reflect.ownKeys(sourceShape(b)));
	return clone(a, mergeDefs(a._zod.def, {
		shape: newShape,
		get catchall() {
			return b._zod.def.catchall;
		},
		checks: b._zod.def.checks ?? []
	}));
}
function partial(Class, schema, mask, name = "partial") {
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) throw new Error(`.${name}() cannot be used on object schemas containing refinements`);
	const selected = mask ? new Set(maskedKeys(schema, mask)) : void 0;
	const newShape = {};
	mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), Class && ((value, key) => selected && !selected.has(key) ? value : new Class({
		type: "optional",
		innerType: value
	})));
	return clone(schema, mergeDefs(schema._zod.def, {
		shape: newShape,
		checks: []
	}));
}
function required(Class, schema, mask) {
	const selected = mask ? new Set(maskedKeys(schema, mask)) : void 0;
	const newShape = {};
	mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), (value, key) => selected && !selected.has(key) ? value : new Class({
		type: "nonoptional",
		innerType: value
	}));
	return clone(schema, mergeDefs(schema._zod.def, { shape: newShape }));
}
function aborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
	return false;
}
function explicitlyAborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
	return false;
}
function prefixIssues(path, issues) {
	return issues.map((iss) => {
		var _a;
		(_a = iss).path ?? (_a.path = []);
		iss.path.unshift(path);
		return iss;
	});
}
function unwrapMessage(message) {
	return typeof message === "string" ? message : message?.message;
}
/** The leading size checks of `defChecks` that set an upper bound, each paired with it. */
function sizeCaps(defChecks) {
	const caps = [];
	for (const ch of defChecks ?? []) {
		const d = ch._zod.def;
		if (!/_(length|size)$|_equals$/.test(d.check)) break;
		const max = d.maximum ?? d.length ?? d.size;
		if (max >= 0) caps.push([max, ch]);
	}
	return caps;
}
function attachSchema(issues, start, inst) {
	var _a;
	for (let i = start; i < issues.length; i++) (_a = issues[i]).schema ?? (_a.schema = inst);
}
function finalizeIssue(iss, ctx, config) {
	var _a;
	const traits = iss.inst?._zod?.traits;
	if (traits?.has("$ZodType")) {
		if (traits.has("$ZodCheck")) (_a = iss).schema ?? (_a.schema = iss.inst);
		else iss.schema = iss.inst;
	}
	const schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : void 0;
	const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(schemaError?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
	const full = {};
	for (const k of Object.keys(iss)) {
		if (k === "inst" || k === "schema" || k === "continue" || k === "input" || k === "__proto__") continue;
		full[k] = iss[k];
	}
	full.path ?? (full.path = []);
	full.message = message;
	if (ctx?.reportInput) full.input = iss.input;
	return full;
}
var highSurrogate = /[\uD800-\uDBFF]/;
function codePointLength(str) {
	const units = str.length;
	if (!highSurrogate.test(str)) return units;
	let count = units;
	for (let i = 0; i < units - 1; i++) if ((str.charCodeAt(i) & 64512) === 55296 && (str.charCodeAt(i + 1) & 64512) === 56320) {
		count--;
		i++;
	}
	return count;
}
function getLengthableOrigin(input) {
	if (Array.isArray(input)) return "array";
	if (typeof input === "string") return "string";
	return "unknown";
}
function parsedType(data) {
	const t = typeof data;
	switch (t) {
		case "number": return Number.isNaN(data) ? "nan" : "number";
		case "object": {
			if (data === null) return "null";
			if (Array.isArray(data)) return "array";
			const obj = data;
			if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) return obj.constructor.name;
		}
	}
	return t;
}
function issue(...args) {
	const [iss, input, inst] = args;
	if (typeof iss === "string") return {
		message: iss,
		code: "custom",
		input,
		inst
	};
	return { ...iss };
}
/**
* Installs a trait's members on its prototype. Each value builds that member for the instance on first read; the built value shadows the accessor as an own property, so a detached `const { parse } = schema` keeps working.
*
* Call this from a `proto` initializer, which runs once per prototype — never per instance.
*/
function members(proto, table) {
	for (const key in table) {
		const desc = Object.getOwnPropertyDescriptor(table, key);
		if (desc.get) Object.defineProperty(proto, key, {
			...desc,
			enumerable: false
		});
		else defineBound(proto, key, desc.value);
	}
}
/** Shadows a prototype member with an own value, so a getter that builds from the instance runs once. */
function own(inst, key, value, enumerable = true) {
	Object.defineProperty(inst, key, {
		configurable: true,
		writable: true,
		enumerable,
		value
	});
	return value;
}
/** Like {@link own}, for a member that was never an own data property and has to stay out of `Object.keys`. */
function hide(inst, key, value) {
	return own(inst, key, value, false);
}
/** Adds members a table derives from the instance: each builds on first read and shadows as own data, and assignment shadows the same way, as when these were own properties. */
/* @__NO_SIDE_EFFECTS__ */
function derived(computes, table) {
	for (const key in computes) {
		const compute = computes[key];
		Object.defineProperty(table, key, {
			configurable: true,
			enumerable: true,
			get() {
				return own(this, key, compute(this));
			},
			set(value) {
				own(this, key, value);
			}
		});
	}
	return table;
}
function defineBound(proto, key, fn) {
	Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			return this == null ? fn : own(this, key, fn.bind(this));
		},
		set(value) {
			own(this, key, value);
		}
	});
}
/** Returns the prototype to install on, or `undefined` if this group is already installed on it. */
function claim(inst, sentinel) {
	const proto = Object.getPrototypeOf(inst);
	return sentinel in proto ? void 0 : proto;
}
var installing;
var broke = false;
var breaker = {
	configurable: true,
	get() {
		broke = true;
	}
};
/**
* Installs a lazily-derived internal on the `_zod` prototype of `inst`'s
* constructor, computed from the internals object itself and cached there on
* first read. One accessor per constructor rather than one per instance.
*/
function defineLazyInternal(inst, key, compute) {
	const proto = Object.getPrototypeOf(inst._zod);
	if (key in proto && installing !== inst._zod) {
		installing = void 0;
		return;
	}
	installing = inst._zod;
	Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			Object.defineProperty(this, key, breaker);
			const outer = broke;
			broke = false;
			try {
				const value = compute(this);
				if (broke) delete this[key];
				else Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					value
				});
				broke = broke || outer;
				return value;
			} catch (err) {
				delete this[key];
				broke = broke || outer;
				throw err;
			}
		},
		set(value) {
			Object.defineProperty(this, key, {
				configurable: true,
				writable: true,
				value
			});
		}
	});
}
/**
* Installs `key` on `inst`'s prototype, computed by `make` on first read and cached there as an own
* data property. One accessor per constructor rather than one per instance, because an own accessor
* puts every instance after the first into v8 dictionary mode. The key doubles as the sentinel.
*/
function installLazyProp(inst, key, make, enumerable) {
	const proto = claim(inst, key);
	if (!proto) return;
	Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			const desc = {
				configurable: true,
				writable: true,
				enumerable,
				value: void 0
			};
			Object.defineProperty(this, key, desc);
			desc.value = make(this);
			Object.defineProperty(this, key, desc);
			return desc.value;
		},
		set(value) {
			Object.defineProperty(this, key, {
				configurable: true,
				writable: true,
				enumerable,
				value
			});
		}
	});
}
/** Marks the thunk `_catch` synthesises for a constant catch value. `Function.length` cannot tell that thunk from a user callback — rest and defaulted parameters both report arity 0 — and a user callback reads `ctx.error`, whose issues only finalize correctly against the caller's per-parse error map. Provenance can say what arity cannot. A plain string key rather than `Symbol.for`, whose call at module scope no bundler can prove pure — the same shape that anchored `urlCanParse` into every build. */
var CONSTANT_CATCH = "~constantCatch";
/** Wraps a constant catch value in a thunk tagged with {@link CONSTANT_CATCH}. */
function constantCatch(value) {
	const fn = () => value;
	fn[CONSTANT_CATCH] = true;
	return fn;
}
// node_modules/zod/v4/core/core.js
var _a$1;
var _zodDesc = {
	value: void 0,
	enumerable: false
};
var _E = "captureStackTrace" in Error ? Error : null;
function newError(Definition) {
	const E = _E;
	if (E) {
		const saved = E.stackTraceLimit;
		if (typeof saved === "number") {
			try {
				E.stackTraceLimit = 0;
			} catch {
				_E = null;
				return new Definition();
			}
			try {
				return new Definition();
			} finally {
				E.stackTraceLimit = saved;
			}
		}
	}
	return new Definition();
}
/* @__NO_SIDE_EFFECTS__ */
function $constructor(name, initializer, proto, params) {
	const zodProto = {};
	function Internals(def) {
		this.def = def;
		this.constr = _;
		this.traits = /* @__PURE__ */ new Set();
	}
	Internals.prototype = zodProto;
	const protoMembers = proto;
	const initialized = protoMembers && /* @__PURE__ */ new WeakSet();
	function init(inst, def) {
		if (!inst._zod) {
			_zodDesc.value = new Internals(def);
			try {
				Object.defineProperty(inst, "_zod", _zodDesc);
			} finally {
				_zodDesc.value = void 0;
			}
		} else if (inst._zod.traits.has(name)) return;
		inst._zod.traits.add(name);
		initializer(inst, def);
		if (initialized) {
			const own = Object.getPrototypeOf(inst);
			const ctorProto = inst._zod.constr.prototype;
			let up = own;
			while (up && up !== ctorProto) up = Object.getPrototypeOf(up);
			const target = up ?? own;
			if (!initialized.has(target)) {
				initialized.add(target);
				members(target, protoMembers);
			}
		}
		const proto = _.prototype;
		for (const k in proto) {
			if (!Object.prototype.hasOwnProperty.call(proto, k)) continue;
			if (!(k in inst)) inst[k] = proto[k].bind(inst);
		}
	}
	const Parent = params?.Parent ?? Object;
	class Definition extends Parent {}
	Object.defineProperty(Definition, "name", { value: name });
	function _(def) {
		const inst = params?.Parent ? newError(Definition) : this;
		init(inst, def);
		const deferred = inst._zod.deferred;
		if (deferred) {
			for (const fn of deferred) fn();
			inst._zod.deferred = void 0;
		}
		const pp = globalThis.__zod_globalConfig?.postProcessor;
		if (pp) pp(inst);
		return inst;
	}
	Object.defineProperty(_, "init", { value: init });
	Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
		if (params?.Parent && inst instanceof params.Parent) return true;
		return inst?._zod?.traits?.has(name);
	} });
	Object.defineProperty(_, "name", { value: name });
	return _;
}
var $ZodAsyncError = class extends Error {
	constructor() {
		super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
	}
};
var $ZodEncodeError = class extends Error {
	constructor(name) {
		super(`Encountered unidirectional transform during encode: ${name}`);
		this.name = "ZodEncodeError";
	}
};
(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
var globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
	if (newConfig) Object.assign(globalConfig, newConfig);
	return globalConfig;
}
// node_modules/zod/v4/core/errors.js
function _getMessage() {
	const internals = this._zod;
	internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer, 2));
	return internals.message;
}
function _setMessage(value) {
	this._zod.message = value;
}
var _messageDesc = {
	get: _getMessage,
	set: _setMessage,
	enumerable: true,
	configurable: true
};
var _issuesDesc = {
	value: void 0,
	enumerable: false
};
var _installedToString = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
var initializer$1 = (inst, def) => {
	inst.name = "$ZodError";
	_issuesDesc.value = def;
	Object.defineProperty(inst, "issues", _issuesDesc);
	_issuesDesc.value = void 0;
	Object.defineProperty(inst, "message", _messageDesc);
	const proto = Object.getPrototypeOf(inst);
	if (!_installedToString.has(proto)) {
		_installedToString.add(proto);
		Object.defineProperty(proto, "toString", {
			configurable: true,
			enumerable: false,
			get() {
				const value = () => this.message;
				Object.defineProperty(this, "toString", {
					value,
					configurable: true,
					writable: true
				});
				return value;
			},
			set(value) {
				Object.defineProperty(this, "toString", {
					value,
					configurable: true,
					writable: true
				});
			}
		});
	}
};
var $ZodError = /* @__PURE__ */ $constructor("$ZodError", initializer$1);
/** Get-or-create `obj[key]` as an own data property. A path segment naming an inherited member
* ("toString", "constructor") would otherwise read through to the prototype, and assigning
* "__proto__" would hit the setter instead of creating a key. */
function node(obj, key, make) {
	if (!Object.prototype.hasOwnProperty.call(obj, key)) {
		if (key === "__proto__") Object.defineProperty(obj, key, {
			value: make(),
			writable: true,
			enumerable: true,
			configurable: true
		});
		else obj[key] = make();
	}
	return obj[key];
}
function flattenError(error, mapper = (issue) => issue.message) {
	const fieldErrors = {};
	const formErrors = [];
	for (const sub of error.issues) if (sub.path.length > 0) node(fieldErrors, sub.path[0], () => []).push(mapper(sub));
	else formErrors.push(mapper(sub));
	return {
		formErrors,
		fieldErrors
	};
}
function formatError(error, mapper = (issue) => issue.message) {
	const fieldErrors = { _errors: [] };
	const processError = (error, path = []) => {
		for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
		else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
		else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
		else {
			const fullpath = [...path, ...issue.path];
			if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
			else {
				let curr = fieldErrors;
				let i = 0;
				while (i < fullpath.length) {
					const el = fullpath[i];
					const terminal = i === fullpath.length - 1;
					if (el === "_errors") {
						if (terminal) curr._errors.push(mapper(issue));
						i++;
						continue;
					}
					if (!Object.prototype.hasOwnProperty.call(curr, el)) Object.defineProperty(curr, el, {
						value: { _errors: [] },
						enumerable: true,
						writable: true,
						configurable: true
					});
					const node = curr[el];
					if (terminal) node._errors.push(mapper(issue));
					curr = node;
					i++;
				}
			}
		}
	};
	processError(error);
	return fieldErrors;
}
// node_modules/zod/v4/core/parse.js
function finalizeParams(callee, params) {
	return {
		callee: params?.callee ?? callee,
		Err: params?.Err
	};
}
var _parse = (_Err) => {
	const fn = (schema, value, _ctx, _params) => {
		const ctx = _ctx ? {
			..._ctx,
			async: false
		} : { async: false };
		const result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) throw new $ZodAsyncError();
		if (result.issues.length) {
			const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
			captureStackTrace(e, _params?.callee ?? fn);
			throw e;
		}
		return result.value;
	};
	return fn;
};
var _parseAsync = (_Err) => {
	const fn = async (schema, value, _ctx, params) => {
		const ctx = _ctx ? {
			..._ctx,
			async: true
		} : { async: true };
		let result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) result = await result;
		if (result.issues.length) {
			const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
			captureStackTrace(e, params?.callee ?? fn);
			throw e;
		}
		return result.value;
	};
	return fn;
};
var _safeParse = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	return result.issues.length ? failure(_Err, result.issues, ctx) : {
		success: true,
		data: result.value
	};
};
function failure(Err, issues, ctx) {
	let error;
	return {
		success: false,
		get error() {
			if (!error) {
				error = new Err(issues.map((iss) => finalizeIssue(iss, ctx, config())));
				issues = void 0;
				ctx = void 0;
			}
			return error;
		},
		set error(e) {
			error = e;
			issues = void 0;
			ctx = void 0;
		}
	};
}
var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true
	} : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	return result.issues.length ? failure(_Err, result.issues, ctx) : {
		success: true,
		data: result.value
	};
};
var COMPILE_INVALID = /* @__PURE__ */ Symbol.for("zod.compile.invalid");
var COMPILE_FALLBACK = /* @__PURE__ */ Symbol.for("zod.compile.fallback");
var validate = ((schema, value, _ctx) => {
	const validator = schema._zod.bag.validator;
	if (validator !== void 0) {
		if (validator(value) !== COMPILE_INVALID) return true;
		if (validator.definite === true && _ctx === void 0) return false;
	}
	return validateFallback(schema, value, _ctx);
});
function validateFallback(schema, value, _ctx) {
	const ctx = _ctx ? {
		..._ctx,
		async: false,
		abortEarly: true
	} : {
		async: false,
		abortEarly: true
	};
	const fallbackRun = schema._zod.bag.fallbackRun;
	let result;
	if (fallbackRun) {
		ctx[COMPILE_FALLBACK] = true;
		result = fallbackRun({
			value,
			issues: []
		}, ctx);
	} else result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	return result.issues.length === 0;
}
var validateAsync$1 = async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true,
		abortEarly: true
	} : {
		async: true,
		abortEarly: true
	};
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	return result.issues.length === 0;
};
var _encode = (_Err) => {
	const parse = _parse(_Err);
	const fn = (schema, value, _ctx, _params) => {
		const ctx = _ctx ? {
			..._ctx,
			direction: "backward"
		} : { direction: "backward" };
		return parse(schema, value, ctx, finalizeParams(fn, _params));
	};
	return fn;
};
var _decode = (_Err) => {
	const parse = _parse(_Err);
	const fn = (schema, value, _ctx, _params) => {
		return parse(schema, value, _ctx, finalizeParams(fn, _params));
	};
	return fn;
};
var _encodeAsync = (_Err) => {
	const parseAsync = _parseAsync(_Err);
	const fn = async (schema, value, _ctx, _params) => {
		const ctx = _ctx ? {
			..._ctx,
			direction: "backward"
		} : { direction: "backward" };
		return await parseAsync(schema, value, ctx, finalizeParams(fn, _params));
	};
	return fn;
};
var _decodeAsync = (_Err) => {
	const parseAsync = _parseAsync(_Err);
	const fn = async (schema, value, _ctx, _params) => {
		return await parseAsync(schema, value, _ctx, finalizeParams(fn, _params));
	};
	return fn;
};
var _safeEncode = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParse(_Err)(schema, value, ctx);
};
var _safeDecode = (_Err) => (schema, value, _ctx) => {
	return _safeParse(_Err)(schema, value, _ctx);
};
var _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParseAsync(_Err)(schema, value, ctx);
};
var _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
	return _safeParseAsync(_Err)(schema, value, _ctx);
};
// node_modules/zod/v4/core/regexes.js
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link cuid2} instead.
* See https://github.com/paralleldrive/cuid.
*/
var cuid = /^[cC][0-9a-z]{6,}$/;
var cuid2 = /^[0-9a-z]+$/;
var ulid = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/;
var xid = /^[0-9a-vA-V]{20}$/;
var ksuid = /^[A-Za-z0-9]{27}$/;
var nanoid = /^[a-zA-Z0-9_-]{21}$/;
function nanoidOfLength(length) {
	return new RegExp(`^[a-zA-Z0-9_-]{${length}}$`);
}
/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
var duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
/** Returns a regex for validating an RFC 9562/4122 UUID.
*
* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
var uuid = (version) => {
	if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
	return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
/** Practical email validation */
var email = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var _emoji$1 = `^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`;
function emoji() {
	return new RegExp(_emoji$1, "u");
}
var ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
var cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
var base64url = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/;
var httpProtocol = /^https?$/;
var e164 = /^\+[1-9]\d{6,14}$/;
var dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
/** Anchors a pattern source. The interpolation lives here rather than at the call site because
* esbuild will not drop a `@__PURE__` call whose own argument interpolates a variable, but it
* will drop `anchor(dateSource)`. Keeping it inline pinned `date` into every bundle. */
function anchor(source) {
	return new RegExp(`^${source}$`);
}
var date$1 = /*@__PURE__*/ anchor(dateSource);
function timeSource(args) {
	const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
	return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : args.seconds ? `${hhmm}:[0-5]\\d(?:\\.\\d+)?` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function time(args) {
	return new RegExp(`^${timeSource(args)}$`);
}
function datetime(args) {
	const opts = ["Z"];
	if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
	const qualified = `${timeSource({
		precision: args.precision,
		seconds: true
	})}(?:${opts.join("|")})`;
	const timeRegex = args.local ? `${qualified}|${timeSource({ precision: args.precision })}` : qualified;
	return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
var anyString = /^[\s\S]{0,}$/;
var number$1 = /^-?\d+(?:\.\d+)?$/;
var boolean$1 = /^(?:true|false)$/i;
var lowercase = /^[^A-Z]*$/;
var uppercase = /^[^a-z]*$/;
// node_modules/zod/v4/core/checks.js
var $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
	var _a;
	inst._zod ?? (inst._zod = {});
	inst._zod.def = def;
	(_a = inst._zod).onattach ?? (_a.onattach = []);
});
/** Default `when` for length-based checks: run only on non-nullish values with a `length`. */
var _whenHasLength = (payload) => {
	const val = payload.value;
	return !nullish(val) && val.length !== void 0;
};
var numericOriginMap = {
	number: "number",
	bigint: "bigint",
	object: "date"
};
var $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
		payload.issues.push({
			origin: numericOriginMap[typeof payload.value] ?? origin,
			code: "too_big",
			maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
		payload.issues.push({
			origin: numericOriginMap[typeof payload.value] ?? origin,
			code: "too_small",
			minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckMultipleOf = /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.check = (payload) => {
		if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
		if (typeof payload.value === "bigint" ? def.value !== BigInt(0) && payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
		payload.issues.push({
			origin: typeof payload.value,
			code: "not_multiple_of",
			divisor: def.value,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
	$ZodCheck.init(inst, def);
	def.format = def.format || "float64";
	const isInt = def.format?.includes("int");
	const origin = isInt ? "int" : "number";
	const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (isInt) {
			if (!Number.isInteger(input)) {
				payload.issues.push({
					expected: origin,
					format: def.format,
					code: "invalid_type",
					continue: false,
					input,
					inst
				});
				return;
			}
			if (!Number.isSafeInteger(input)) {
				if (input > 0) payload.issues.push({
					input,
					code: "too_big",
					maximum: Number.MAX_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				else payload.issues.push({
					input,
					code: "too_small",
					minimum: Number.MIN_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				return;
			}
		}
		if (input < minimum) payload.issues.push({
			origin: "number",
			input,
			code: "too_small",
			minimum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
		if (input > maximum) payload.issues.push({
			origin: "number",
			input,
			code: "too_big",
			maximum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
	inst._zod.check = (payload) => {
		const input = payload.value;
		const units = input.length;
		if ((typeof input === "string" && units > def.maximum ? codePointLength(input) : units) <= def.maximum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: def.maximum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
	inst._zod.check = (payload) => {
		const input = payload.value;
		const units = input.length;
		if ((typeof input === "string" && units >= def.minimum && units < def.minimum * 2 ? codePointLength(input) : units) >= def.minimum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: def.minimum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
	inst._zod.check = (payload) => {
		const input = payload.value;
		const units = input.length;
		const length = typeof input === "string" && units >= def.length && units <= def.length * 2 ? codePointLength(input) : units;
		if (length === def.length) return;
		const origin = getLengthableOrigin(input);
		const tooBig = length > def.length;
		payload.issues.push({
			origin,
			...tooBig ? {
				code: "too_big",
				maximum: def.length
			} : {
				code: "too_small",
				minimum: def.length
			},
			inclusive: true,
			exact: true,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
	var _a, _b;
	$ZodCheck.init(inst, def);
	if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: def.format,
			input: payload.value,
			...def.pattern ? { pattern: def.pattern.toString() } : {},
			inst,
			continue: !def.abort
		});
	});
	else (_b = inst._zod).check ?? (_b.check = () => {});
});
var $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: payload.value,
			pattern: def.pattern.toString(),
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
	def.pattern ?? (def.pattern = lowercase);
	$ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
	def.pattern ?? (def.pattern = uppercase);
	$ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
	$ZodCheck.init(inst, def);
	const escapedRegex = escapeRegex(def.includes);
	def.pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position},}${escapedRegex}` : escapedRegex);
	inst._zod.check = (payload) => {
		if (payload.value.includes(def.includes, def.position)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: def.includes,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.check = (payload) => {
		if (payload.value.startsWith(def.prefix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: def.prefix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.check = (payload) => {
		if (payload.value.endsWith(def.suffix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: def.suffix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.check = (payload) => {
		payload.value = def.tx(payload.value);
	};
});
// node_modules/zod/v4/core/doc.js
var Doc = class {
	constructor(args = [], closed = {}) {
		this.content = [];
		this.indent = 0;
		this.args = args;
		this.closed = closed;
	}
	indented(fn) {
		this.indent += 1;
		try {
			fn(this);
		} finally {
			this.indent -= 1;
		}
	}
	write(arg) {
		if (typeof arg === "function") {
			arg(this, { execution: "sync" });
			arg(this, { execution: "async" });
			return;
		}
		const lines = arg.split("\n").filter((x) => x);
		const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
		const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
		for (const line of dedented) this.content.push(line);
	}
	compile() {
		const F = Function;
		const content = this?.content ?? [``];
		return new F(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {\n${content.join("\n")}\n};`)(...Object.values(this.closed));
	}
};
// node_modules/zod/v4/core/versions.js
var version = {
	major: 4,
	minor: 6,
	patch: 7
};
// node_modules/zod/v4/core/schemas.js
var $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
	var _a;
	inst ?? (inst = {});
	inst._zod.def = def;
	inst._zod.bag = inst._zod.bag || {};
	inst._zod.version = version;
	const defChecks = inst._zod.def.checks;
	const checks = inst._zod.traits.has("$ZodCheck") ? [inst, ...defChecks ?? []] : defChecks?.length ? [...defChecks] : [];
	for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
	if (checks.length === 0) {
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred?.push(() => {
			inst._zod.run = inst._zod.parse;
		});
	} else {
		const runChecks = (payload, checks, ctx) => {
			if (payload.memo) return payload;
			let isAborted = aborted(payload);
			let asyncResult;
			for (const ch of checks) {
				if (ch._zod.def.when) {
					if (explicitlyAborted(payload)) continue;
					if (!ch._zod.def.when(payload)) continue;
				} else if (isAborted) continue;
				const currLen = payload.issues.length;
				const _ = ch._zod.check(payload);
				if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
				if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
					await _;
					if (payload.issues.length === currLen) return;
					attachSchema(payload.issues, currLen, inst);
					if (!isAborted) isAborted = aborted(payload, currLen);
				});
				else {
					if (payload.issues.length === currLen) continue;
					attachSchema(payload.issues, currLen, inst);
					if (!isAborted) isAborted = aborted(payload, currLen);
				}
			}
			if (asyncResult) return asyncResult.then(() => {
				return payload;
			});
			return payload;
		};
		const handleCanaryResult = (canary, payload, ctx) => {
			if (aborted(canary)) {
				canary.aborted = true;
				return canary;
			}
			const checkResult = runChecks(payload, checks, ctx);
			if (checkResult instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
			}
			return inst._zod.parse(checkResult, ctx);
		};
		inst._zod.run = (payload, ctx) => {
			if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
			if (ctx.direction === "backward") {
				const canary = inst._zod.parse({
					value: payload.value,
					issues: []
				}, {
					...ctx,
					skipChecks: true
				});
				if (canary instanceof Promise) return canary.then((canary) => {
					return handleCanaryResult(canary, payload, ctx);
				});
				return handleCanaryResult(canary, payload, ctx);
			}
			const result = inst._zod.parse(payload, ctx);
			if (result instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return result.then((result) => runChecks(result, checks, ctx));
			}
			return runChecks(result, checks, ctx);
		};
	}
}, {
	get "~standard"() {
		return hide(this, "~standard", standardProps(this));
	},
	set "~standard"(value) {
		own(this, "~standard", value);
	}
});
/** The Standard Schema surface for `inst`. Shared so wrappers can extend it without forcing it. */
var toStandardResult = (r, ctx) => r.issues.length ? { issues: r.issues.map((iss) => finalizeIssue(iss, ctx, config())) } : { value: r.value };
async function validateAsync(inst, value) {
	const ctx = { async: true };
	return toStandardResult(await inst._zod.run({
		value,
		issues: []
	}, ctx), ctx);
}
function standardProps(inst) {
	return {
		validate: (value) => {
			const ctx = { async: false };
			try {
				const r = inst._zod.run({
					value,
					issues: []
				}, ctx);
				if (!(r instanceof Promise)) return toStandardResult(r, ctx);
			} catch (_) {}
			return validateAsync(inst, value);
		},
		vendor: "zod",
		version: 1
	};
}
var $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = def.pattern ?? anyString;
	inst._zod.parse = (payload, _) => {
		if (def.coerce) try {
			payload.value = String(payload.value);
		} catch (_) {}
		if (typeof payload.value === "string") return payload;
		payload.issues.push({
			expected: "string",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
var $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	$ZodString.init(inst, def);
});
var $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
	def.pattern ?? (def.pattern = guid);
	$ZodStringFormat.init(inst, def);
});
var $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
	if (def.version) {
		const v = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		}[def.version];
		if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
		def.pattern ?? (def.pattern = uuid(v));
	} else def.pattern ?? (def.pattern = uuid());
	$ZodStringFormat.init(inst, def);
});
var $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
	def.pattern ?? (def.pattern = email);
	$ZodStringFormat.init(inst, def);
});
function canParseURL(input) {
	try {
		if (typeof URL !== "undefined" && typeof URL.canParse === "function") return URL.canParse(input);
		new URL(input);
		return true;
	} catch {
		return false;
	}
}
function validateURL(trimmed, def) {
	if (!("normalize" in def) && !("hostname" in def) && !("protocol" in def)) return canParseURL(trimmed) || 2;
	return parseURLObject(trimmed, def);
}
/** Parses a URL while preserving the non-normalizing HTTP guard. */
function parseURLObject(trimmed, def) {
	if (!def.normalize && def.protocol?.source === httpProtocol.source && !/^https?:\/\//i.test(trimmed)) return 1;
	try {
		if (typeof URL !== "undefined") {
			const URLStatic = URL;
			if (typeof URLStatic.parse === "function") return URLStatic.parse(trimmed) ?? 2;
		}
		return new URL(trimmed);
	} catch {
		return 2;
	}
}
var asciiTabOrNewline = /[\t\n\r]/g;
/** The URL parser deletes every ASCII tab, LF and CR from its input before it parses, so `new URL("https://exa\nmple.com")` reports on `example.com`. Applying the same deletion to the returned value closes the half of that divergence which can move the host; the parser's other rewrite, stripping C0 controls at the edges, cannot. */
function stripTabAndNewline(value) {
	return value.replace(asciiTabOrNewline, "");
}
function urlHostnameOk(url, hostname) {
	hostname.lastIndex = 0;
	return hostname.test(url.hostname);
}
function urlProtocolOk(url, protocol) {
	protocol.lastIndex = 0;
	return protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol);
}
var $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		try {
			const trimmed = payload.value.trim();
			const url = validateURL(trimmed, def);
			if (url === 1) {
				payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid URL format",
					input: payload.value,
					inst,
					continue: !def.abort
				});
				return;
			}
			if (url === 2) {
				payload.issues.push({
					code: "invalid_format",
					format: "url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
				return;
			}
			if (url === true) {
				payload.value = stripTabAndNewline(trimmed);
				return;
			}
			if (def.hostname && !urlHostnameOk(url, def.hostname)) payload.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid hostname",
				pattern: def.hostname.source,
				input: payload.value,
				inst,
				continue: !def.abort
			});
			if (def.protocol && !urlProtocolOk(url, def.protocol)) payload.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid protocol",
				pattern: def.protocol.source,
				input: payload.value,
				inst,
				continue: !def.abort
			});
			payload.value = def.normalize ? url.href : stripTabAndNewline(trimmed);
			return;
		} catch (_) {
			payload.issues.push({
				code: "invalid_format",
				format: "url",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
var $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
	def.pattern ?? (def.pattern = emoji());
	$ZodStringFormat.init(inst, def);
});
var $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
	if (def.length !== void 0 && (!Number.isInteger(def.length) || def.length < 1)) throw new Error(`Invalid nanoid length: ${def.length}`);
	def.pattern ?? (def.pattern = def.length === void 0 ? nanoid : nanoidOfLength(def.length));
	$ZodStringFormat.init(inst, def);
});
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
* See https://github.com/paralleldrive/cuid.
*/
var $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
	def.pattern ?? (def.pattern = cuid);
	$ZodStringFormat.init(inst, def);
});
var $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
	def.pattern ?? (def.pattern = cuid2);
	$ZodStringFormat.init(inst, def);
});
var $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
	def.pattern ?? (def.pattern = ulid);
	$ZodStringFormat.init(inst, def);
});
var $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
	def.pattern ?? (def.pattern = xid);
	$ZodStringFormat.init(inst, def);
});
var $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
	def.pattern ?? (def.pattern = ksuid);
	$ZodStringFormat.init(inst, def);
});
var $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
	def.pattern ?? (def.pattern = datetime(def));
	$ZodStringFormat.init(inst, def);
});
var $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
	def.pattern ?? (def.pattern = date$1);
	$ZodStringFormat.init(inst, def);
});
var $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
	def.pattern ?? (def.pattern = time(def));
	$ZodStringFormat.init(inst, def);
});
var $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
	def.pattern ?? (def.pattern = duration);
	$ZodStringFormat.init(inst, def);
});
var $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
	def.pattern ?? (def.pattern = ipv4);
	$ZodStringFormat.init(inst, def);
});
/** An IPv6 address is written with hex digits, colons and dots, and nothing else. The guard is what makes the check below an IPv6 check: `new URL("http://[...]")` parses an authority, not an address, so `@` and `\` re-delimit it and `"::@1\\"` validates against the host `0.0.0.1`. The URL parser also deletes ASCII tab, LF and CR rather than failing, which is how `"::1\n"` validated as `::1`. */
var ipv6Alphabet = /^[0-9a-fA-F:.]+$/;
function isValidIPv6(value) {
	if (!ipv6Alphabet.test(value)) return false;
	return canParseURL(`http://[${value}]`);
}
var $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
	def.pattern ?? (def.pattern = ipv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (!isValidIPv6(payload.value)) payload.issues.push({
			code: "invalid_format",
			format: "ipv6",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv4);
	$ZodStringFormat.init(inst, def);
});
function isValidCIDRv6(value) {
	const parts = value.split("/");
	if (parts.length !== 2) return false;
	const [address, prefix] = parts;
	if (!prefix) return false;
	const prefixNum = Number(prefix);
	if (`${prefixNum}` !== prefix) return false;
	if (prefixNum < 0 || prefixNum > 128) return false;
	return isValidIPv6(address);
}
var $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (!isValidCIDRv6(payload.value)) payload.issues.push({
			code: "invalid_format",
			format: "cidrv6",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
function isValidBase64(data) {
	if (data === "") return true;
	if (/\s/.test(data)) return false;
	if (data.length % 4 !== 0) return false;
	try {
		atob(data);
		return true;
	} catch {
		return false;
	}
}
var base64Charset = /^[0-9a-zA-Z+/]*={0,2}$/;
var $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
	def.pattern ?? (def.pattern = base64Charset);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidBase64(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var base64urlCharset = /^[A-Za-z0-9_-]*$/;
function isValidBase64URL(data) {
	if (!base64urlCharset.test(data)) return false;
	const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
	return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
}
var $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
	def.pattern ?? (def.pattern = base64urlCharset);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidBase64URL(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
	def.pattern ?? (def.pattern = e164);
	$ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
	try {
		const tokensParts = token.split(".");
		if (tokensParts.length !== 3) return false;
		const [header] = tokensParts;
		if (!header) return false;
		const parsedHeader = JSON.parse(atob(header));
		if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
		if (!parsedHeader.alg) return false;
		if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
		return true;
	} catch {
		return false;
	}
}
var $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidJWT(payload.value, def.alg)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
var $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = number$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Number(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
		const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? String(input) : void 0 : void 0;
		payload.issues.push({
			expected: "number",
			code: "invalid_type",
			input,
			inst,
			...received ? { received } : {}
		});
		return payload;
	};
});
var $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
	$ZodCheckNumberFormat.init(inst, def);
	$ZodNumber.init(inst, def);
});
var $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = boolean$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Boolean(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "boolean") return payload;
		payload.issues.push({
			expected: "boolean",
			code: "invalid_type",
			input,
			inst
		});
		return payload;
	};
});
var $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload) => payload;
});
var $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _ctx) => {
		payload.issues.push({
			expected: "never",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
var $ZodDate = /*@__PURE__*/ $constructor("$ZodDate", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = new Date(payload.value);
		} catch (_err) {}
		const input = payload.value;
		const isDate = input instanceof Date;
		if (isDate && !Number.isNaN(input.getTime())) return payload;
		payload.issues.push({
			expected: "date",
			code: "invalid_type",
			input,
			...isDate ? { received: "Invalid Date" } : {},
			inst
		});
		return payload;
	};
});
function capSize(inst, size) {
	const caps = sizeCaps(inst._zod.def.checks);
	if (!caps.length) return;
	const cap = Math.min(...caps.map((c) => c[0]));
	const parse = inst._zod.parse;
	inst._zod.parse = (payload, ctx) => {
		const n = size(payload.value);
		if (n > cap && !ctx?.skipChecks && ctx?.direction !== "backward") {
			for (const [max, ch] of sizeCaps(inst._zod.def.checks)) if (n > max && ch._zod.def.when(payload)) {
				const start = payload.issues.length;
				ch._zod.check(payload);
				payload.issues[start].continue = false;
				attachSchema(payload.issues, start, inst);
				return payload;
			}
		}
		return parse(payload, ctx);
	};
}
var arraySize = (input) => Array.isArray(input) ? input.length : -1;
function handleArrayResult(result, final, index) {
	if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
	final.value[index] = result.value;
}
var $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
	$ZodType.init(inst, def);
	const memo = globalConfig.memoizer;
	memo?.attach(inst);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!Array.isArray(input)) {
			payload.issues.push({
				expected: "array",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = memo ? memo.alloc(inst, payload, Array(input.length), ctx) : Array(input.length);
		const proms = [];
		const abortEarly = ctx?.abortEarly;
		for (let i = 0; i < input.length; i++) {
			const item = input[i];
			const result = def.element._zod.run({
				value: item,
				issues: []
			}, ctx);
			if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
			else {
				handleArrayResult(result, payload, i);
				if (abortEarly && result.issues.length !== 0 && aborted(result)) break;
			}
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
	capSize(inst, arraySize);
});
function handlePropertyResult(result, final, key, input, optin, optout) {
	const isPresent = key in input;
	const isOptionalOut = optout === "optional";
	if (!isPresent && isOptionalOut && optin === "optional") return;
	if (result.issues.length) {
		if (optin !== void 0 && isOptionalOut && !isPresent) return;
		final.issues.push(...prefixIssues(key, result.issues));
	}
	if (!isPresent && optin === void 0) {
		if (!result.issues.length) final.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: void 0,
			path: [key]
		});
		return;
	}
	if (result.value === void 0) {
		if (isPresent || optin === "defaulted" && !isOptionalOut) final.value[key] = void 0;
	} else final.value[key] = result.value;
}
var NO_SYMBOL_KEYS = [];
function normalizeDef(def) {
	const keys = Object.keys(def.shape);
	const ownSymbols = Object.getOwnPropertySymbols(def.shape);
	const symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS;
	const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
	for (const k of allKeys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${String(k)}": expected a Zod schema`);
	const okeys = optionalKeys(def.shape);
	return {
		...def,
		allKeys,
		symbolKeys,
		keySet: new Set(keys),
		numKeys: keys.length,
		optionalKeys: new Set(okeys)
	};
}
function handleCatchall(proms, input, payload, ctx, def, inst, abortEarly) {
	const unrecognized = [];
	const keySet = def.keySet;
	const _catchall = def.catchall._zod;
	const t = _catchall.def.type;
	const optin = _catchall.optin;
	const optout = _catchall.optout;
	let seen = 0;
	for (const key in input) {
		if (abortEarly && payload.issues.length !== seen) {
			if (aborted(payload, seen)) break;
			seen = payload.issues.length;
		}
		if (keySet.has(key)) continue;
		if (key === "__proto__") {
			if (t === "never") unrecognized.push(key);
			continue;
		}
		if (t === "never") {
			unrecognized.push(key);
			continue;
		}
		const r = _catchall.run({
			value: input[key],
			issues: []
		}, ctx);
		if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
		else handlePropertyResult(r, payload, key, input, optin, optout);
	}
	if (unrecognized.length) payload.issues.push({
		code: "unrecognized_keys",
		keys: unrecognized,
		input,
		inst,
		continue: true
	});
	if (!proms.length) return payload;
	return Promise.all(proms).then(() => {
		return payload;
	});
}
var $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
	$ZodType.init(inst, def);
	const desc = Object.getOwnPropertyDescriptor(def, "shape");
	const sh = desc?.get ? desc.get.raw : def.shape ?? {};
	if (sh) {
		const get = () => {
			const newSh = { ...sh };
			Object.defineProperty(def, "shape", { value: newSh });
			get.raw = newSh;
			return newSh;
		};
		get.raw = sh;
		Object.defineProperty(def, "shape", { get });
	}
	const _normalized = cached(() => normalizeDef(def));
	defineLazyInternal(inst, "propValues", (zod) => {
		const shape = zod.def.shape;
		const propValues = {};
		for (const key in shape) {
			const field = shape[key]._zod;
			if (field.values) {
				if (!Object.prototype.hasOwnProperty.call(propValues, key)) assignProp(propValues, key, /* @__PURE__ */ new Set());
				for (const v of field.values) propValues[key].add(v);
				if (field.optin !== void 0) propValues[key].add(void 0);
			}
		}
		return propValues;
	});
	const isObject$1 = isObject;
	const catchall = def.catchall;
	let value;
	const memo = globalConfig.memoizer;
	memo?.attach(inst);
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$1(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
		const proms = [];
		const shape = value.shape;
		const abortEarly = ctx?.abortEarly;
		let seen = payload.issues.length;
		for (const key of value.allKeys) {
			if (abortEarly && payload.issues.length !== seen) {
				if (aborted(payload, seen)) break;
				seen = payload.issues.length;
			}
			if (key === "__proto__") continue;
			const el = shape[key];
			const optin = el._zod.optin;
			const optout = el._zod.optout;
			const r = el._zod.run({
				value: input[key],
				issues: []
			}, ctx);
			if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
			else handlePropertyResult(r, payload, key, input, optin, optout);
		}
		if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
		return handleCatchall(proms, input, payload, ctx, _normalized.value, inst, abortEarly === true);
	};
});
var $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
	$ZodObject.init(inst, def);
	const superParse = inst._zod.parse;
	const _normalized = cached(() => normalizeDef(def));
	const memo = globalConfig.memoizer;
	const generateFastpass = (shape) => {
		const normalized = _normalized.value;
		const syms = normalized.symbolKeys;
		const doc = new Doc(["payload", "ctx"], {
			shape,
			inst,
			memo,
			syms
		});
		const parseStr = (k) => `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
		const prefixStr = (id, k) => `
          let ${id}_ab = false;
          for (let i = 0; i < ${id}.issues.length; i++) {
            const iss = ${id}.issues[i];
            iss.path = iss.path ? [${k}, ...iss.path] : [${k}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${id}_ab = true;
          }
          if (${id}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
		doc.write(`const input = payload.value;`);
		const ids = Object.create(null);
		let counter = 0;
		for (const key of normalized.allKeys) ids[key] = `key_${counter++}`;
		doc.write(memo ? `const newResult = memo.alloc(inst, payload, {}, ctx);` : `const newResult = {};`);
		for (const key of normalized.allKeys) {
			if (key === "__proto__") continue;
			const id = ids[key];
			const k = typeof key === "symbol" ? `syms[${syms.indexOf(key)}]` : esc(key);
			const isPresent = `${k} in input`;
			const schema = shape[key];
			const optin = schema?._zod?.optin;
			const isOptionalIn = optin !== void 0;
			const isOptionalOut = schema?._zod?.optout === "optional";
			doc.write(`const ${id} = ${parseStr(k)};`);
			if (isOptionalIn && isOptionalOut) {
				const assign = optin === "optional" ? `${id}_present` : `${id}.value !== undefined || ${id}_present`;
				doc.write(`
        const ${id}_present = ${isPresent};
        if (!${id}.issues.length || ${id}_present) {
          if (${id}.issues.length) {${prefixStr(id, k)}
          }

          if (${assign}) {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
			} else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${isPresent};
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${id}_present) {
          newResult[${k}] = ${id}.value;
        }

      `);
			else {
				doc.write(`
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
      `);
				if (optin === "defaulted") doc.write(`newResult[${k}] = ${id}.value;`);
				else doc.write(`
        if (${id}.value !== undefined || ${isPresent}) {
          newResult[${k}] = ${id}.value;
        }
      `);
			}
		}
		doc.write(`payload.value = newResult;`);
		doc.write(`return payload;`);
		return doc.compile();
	};
	let fastpass;
	const isObject$2 = isObject;
	const jit = !globalConfig.jitless;
	const fastEnabled = jit && allowsEval.value;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$2(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
			if (!fastpass) fastpass = generateFastpass(def.shape);
			payload = fastpass(payload, ctx);
			if (!catchall) return payload;
			return handleCatchall([], input, payload, ctx, value, inst, ctx?.abortEarly === true);
		}
		return superParse(payload, ctx);
	};
});
function handleUnionResults(results, final, inst, ctx) {
	for (const result of results) if (result.issues.length === 0) {
		final.value = result.value;
		return final;
	}
	const nonaborted = results.filter((r) => !aborted(r));
	if (nonaborted.length === 1) {
		final.value = nonaborted[0].value;
		return nonaborted[0];
	}
	final.issues.push({
		code: "invalid_union",
		input: final.value,
		inst,
		errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	});
	return final;
}
var $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.options.some((o) => o._zod.optin === "defaulted") ? "defaulted" : zod.def.options.some((o) => o._zod.optin !== void 0) ? "optional" : void 0);
	defineLazyInternal(inst, "optout", (zod) => zod.def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
	defineLazyInternal(inst, "values", (zod) => {
		if (zod.def.options.every((o) => o._zod.values)) return new Set(zod.def.options.flatMap((option) => Array.from(option._zod.values)));
	});
	defineLazyInternal(inst, "pattern", (zod) => {
		if (zod.def.options.every((o) => o._zod.pattern)) {
			const patterns = zod.def.options.map((o) => o._zod.pattern);
			return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
		}
	});
	const first = def.options.length === 1 ? def.options[0]._zod.run : null;
	inst._zod.parse = (payload, ctx) => {
		if (first) return first(payload, ctx);
		let async = false;
		const results = [];
		for (const option of def.options) {
			const result = option._zod.run({
				value: payload.value,
				issues: []
			}, ctx);
			if (result instanceof Promise) {
				results.push(result);
				async = true;
			} else {
				if (result.issues.length === 0) return result;
				results.push(result);
			}
		}
		if (!async) return handleUnionResults(results, payload, inst, ctx);
		return Promise.all(results).then((results) => {
			return handleUnionResults(results, payload, inst, ctx);
		});
	};
});
function discriminatorMap(def) {
	const map = /* @__PURE__ */ new Map();
	for (const option of def.options) {
		const values = option._zod.propValues?.[def.discriminator];
		if (!values || values.size === 0) throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
		for (const value of values) if (map.has(value)) {
			if (value !== void 0) throw new Error(`Duplicate discriminator value "${String(value)}"`);
			map.set(value, null);
		} else map.set(value, option);
	}
	return map;
}
var $ZodDiscriminatedUnion = /*@__PURE__*/ $constructor("$ZodDiscriminatedUnion", (inst, def) => {
	def.inclusive = false;
	$ZodUnion.init(inst, def);
	const _super = inst._zod.parse;
	defineLazyInternal(inst, "propValues", (zod) => {
		const propValues = {};
		let undefinedCount = 0;
		for (const option of zod.def.options) {
			const pv = option._zod.propValues;
			if (!pv || Object.keys(pv).length === 0) throw new Error(`Invalid discriminated union option at index "${zod.def.options.indexOf(option)}"`);
			if (pv[zod.def.discriminator]?.has(void 0)) undefinedCount++;
			for (const [k, v] of Object.entries(pv)) {
				if (!Object.prototype.hasOwnProperty.call(propValues, k)) assignProp(propValues, k, /* @__PURE__ */ new Set());
				for (const val of v) propValues[k].add(val);
			}
		}
		if (!zod.def.unionFallback && undefinedCount > 1) propValues[zod.def.discriminator]?.delete(void 0);
		return propValues;
	});
	def.options.forEach((option, i) => {
		const propShape = rawShape(option._zod.def);
		if (propShape && !Object.prototype.hasOwnProperty.call(propShape, def.discriminator)) throw new Error(`Invalid discriminated union option at index "${i}"`);
	});
	const disc = cached(() => discriminatorMap(def));
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!isObject(input)) {
			payload.issues.push({
				code: "invalid_type",
				expected: "object",
				input,
				inst
			});
			return payload;
		}
		const value = input?.[def.discriminator];
		const opt = disc.value.get(value);
		if (opt && (value !== void 0 || ctx.direction !== "backward")) return opt._zod.run(payload, ctx);
		if (def.unionFallback || ctx.direction === "backward") return _super(payload, ctx);
		payload.issues.push({
			code: "invalid_union",
			errors: [],
			note: "No matching discriminator",
			discriminator: def.discriminator,
			options: Array.from(disc.value.keys()).filter((value) => disc.value.get(value) !== null),
			input,
			path: [def.discriminator],
			inst
		});
		return payload;
	};
});
var $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		const left = def.left._zod.run({
			value: input,
			issues: []
		}, ctx);
		const right = def.right._zod.run({
			value: input,
			issues: []
		}, ctx);
		if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
			return handleIntersectionResults(payload, left, right);
		});
		return handleIntersectionResults(payload, left, right);
	};
});
function mergeValues(a, b) {
	if (a === b) return {
		valid: true,
		data: a
	};
	if (a instanceof Date && b instanceof Date && +a === +b) return {
		valid: true,
		data: a
	};
	if (isPlainObject(a) && isPlainObject(b)) {
		const bKeys = Object.keys(b);
		const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
		const newObj = {
			...a,
			...b
		};
		if (Object.prototype.hasOwnProperty.call(newObj, "__proto__")) delete newObj.__proto__;
		for (const key of sharedKeys) {
			if (key === "__proto__") continue;
			const sharedValue = mergeValues(a[key], b[key]);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
			};
			newObj[key] = sharedValue.data;
		}
		return {
			valid: true,
			data: newObj
		};
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return {
			valid: false,
			mergeErrorPath: []
		};
		const newArray = [];
		for (let index = 0; index < a.length; index++) {
			const itemA = a[index];
			const itemB = b[index];
			const sharedValue = mergeValues(itemA, itemB);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
			};
			newArray.push(sharedValue.data);
		}
		return {
			valid: true,
			data: newArray
		};
	}
	return {
		valid: false,
		mergeErrorPath: []
	};
}
function handleIntersectionResults(result, left, right) {
	const unrecKeys = /* @__PURE__ */ new Map();
	let unrecIssue;
	const keyIssues = /* @__PURE__ */ new Map();
	const collect = (iss, side) => {
		let keys;
		if (iss.code === "unrecognized_keys" && !iss.path?.length) {
			unrecIssue ?? (unrecIssue = iss);
			keys = iss.keys;
		} else if (iss.code === "invalid_key" && iss.origin === "record" && iss.path?.length === 1) {
			const k = String(iss.path[0]);
			if (!keyIssues.has(k)) keyIssues.set(k, iss);
			keys = [k];
		} else return false;
		for (const k of keys) {
			if (!unrecKeys.has(k)) unrecKeys.set(k, {});
			unrecKeys.get(k)[side] = true;
		}
		return true;
	};
	for (const iss of left.issues) if (!collect(iss, "l")) result.issues.push(iss);
	for (const iss of right.issues) if (!collect(iss, "r")) result.issues.push(iss);
	const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
	if (bothKeys.length) {
		const aggregated = unrecIssue ? bothKeys.filter((k) => unrecIssue.keys.includes(k)) : [];
		if (aggregated.length) result.issues.push({
			...unrecIssue,
			keys: aggregated
		});
		for (const k of bothKeys) if (!aggregated.includes(k) && keyIssues.has(k)) result.issues.push(keyIssues.get(k));
	}
	const merged = mergeValues(left.value, right.value);
	if (!merged.valid) {
		if (aborted(result)) return result;
		throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
	}
	result.value = merged.data;
	return result;
}
var $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
	$ZodType.init(inst, def);
	const values = getEnumValues(def.entries);
	const valuesSet = new Set(values);
	inst._zod.values = valuesSet;
	defineLazyInternal(inst, "pattern", (zod) => {
		const patternValues = getEnumValues(zod.def.entries).filter((k) => propertyKeyTypes.has(typeof k));
		return new RegExp(patternValues.length ? `^(${patternValues.map((o) => escapeRegex(o.toString())).join("|")})$` : "^[^\\s\\S]$");
	});
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (valuesSet.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values,
			input,
			inst
		});
		return payload;
	};
});
var $ZodLiteral = /*@__PURE__*/ $constructor("$ZodLiteral", (inst, def) => {
	$ZodType.init(inst, def);
	const values = new Set(def.values);
	inst._zod.values = values;
	defineLazyInternal(inst, "pattern", (zod) => {
		const vals = zod.def.values;
		return new RegExp(vals.length ? `^(${vals.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$` : "^[^\\s\\S]$");
	});
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (values.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values: def.values,
			input,
			inst
		});
		return payload;
	};
});
var $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	globalConfig.memoizer?.guard(inst);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		const _out = def.transform(payload.value, payload);
		if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
			payload.value = output;
			return payload;
		});
		if (_out instanceof Promise) throw new $ZodAsyncError();
		payload.value = _out;
		return payload;
	};
});
function handleOptionalResult(payload, result) {
	payload.value = result.issues.length ? void 0 : result.value;
	return payload;
}
var $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
	inst._zod.optout = "optional";
	defineLazyInternal(inst, "values", (zod) => {
		const values = zod.def.innerType._zod.values;
		return values ? /* @__PURE__ */ new Set([...values, void 0]) : void 0;
	});
	defineLazyInternal(inst, "pattern", (zod) => {
		const pattern = zod.def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (payload.value === void 0) {
			if (def.innerType._zod.optin !== "defaulted") return payload;
			const result = def.innerType._zod.run({
				value: payload.value,
				issues: []
			}, ctx);
			if (result instanceof Promise) return result.then((result) => handleOptionalResult(payload, result));
			return handleOptionalResult(payload, result);
		}
		return def.innerType._zod.run(payload, ctx);
	};
});
var $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	defineLazyInternal(inst, "pattern", (zod) => zod.def.innerType._zod.pattern);
	inst._zod.parse = (payload, ctx) => {
		return def.innerType._zod.run(payload, ctx);
	};
});
var $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin);
	defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
	defineLazyInternal(inst, "pattern", (zod) => {
		const pattern = zod.def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
	});
	defineLazyInternal(inst, "values", (zod) => {
		return zod.def.innerType._zod.values ? /* @__PURE__ */ new Set([...zod.def.innerType._zod.values, null]) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (payload.value === null) return payload;
		return def.innerType._zod.run(payload, ctx);
	};
});
var $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "defaulted";
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) {
			payload.value = def.defaultValue;
			/**
			* $ZodDefault returns the default value immediately in forward direction.
			* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
			return payload;
		}
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
		return handleDefaultResult(result, def);
	};
});
function handleDefaultResult(payload, def) {
	if (payload.value === void 0) payload.value = def.defaultValue;
	return payload;
}
var $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "defaulted";
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) payload.value = def.defaultValue;
		return def.innerType._zod.run(payload, ctx);
	};
});
var $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "values", (zod) => {
		const v = zod.def.innerType._zod.values;
		return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
		return handleNonOptionalResult(result, inst);
	};
});
function handleNonOptionalResult(payload, inst) {
	if (!payload.issues.length && payload.value === void 0) payload.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: payload.value,
		inst
	});
	return payload;
}
function handleCatchResult(payload, result, def, ctx) {
	if (!result.issues.length) {
		payload.value = result.value;
		if (result.memo) payload.memo = true;
		return payload;
	}
	payload.value = def.catchValue({
		...result,
		value: payload.value,
		error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
		input: payload.value
	});
	return payload;
}
var $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
	defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run({
			value: payload.value,
			issues: []
		}, ctx);
		if (result instanceof Promise) return result.then((result) => handleCatchResult(payload, result, def, ctx));
		return handleCatchResult(payload, result, def, ctx);
	};
});
var $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "values", (zod) => zod.def.in._zod.values);
	defineLazyInternal(inst, "optin", (zod) => zod.def.in._zod.optin);
	defineLazyInternal(inst, "optout", (zod) => zod.def.out._zod.optout);
	defineLazyInternal(inst, "propValues", (zod) => zod.def.in._zod.propValues);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") {
			const right = def.out._zod.run(payload, ctx);
			if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
			return handlePipeResult(right, def.in, ctx);
		}
		const left = def.in._zod.run(payload, ctx);
		if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
		return handlePipeResult(left, def.out, ctx);
	};
});
function handlePipeResult(left, next, ctx) {
	if (left.issues.some((iss) => iss.code !== "unrecognized_keys")) {
		left.aborted = true;
		return left;
	}
	return next._zod.run({
		value: left.value,
		issues: left.issues
	}, ctx);
}
var $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "propValues", (zod) => zod.def.innerType._zod.propValues);
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType?._zod?.optin);
	defineLazyInternal(inst, "optout", (zod) => zod.def.innerType?._zod?.optout);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then(handleReadonlyResult);
		return handleReadonlyResult(result);
	};
});
function handleReadonlyResult(payload) {
	if (!payload.memo) payload.value = Object.freeze(payload.value);
	return payload;
}
var $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
	$ZodCheck.init(inst, def);
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _) => {
		return payload;
	};
	inst._zod.check = (payload) => {
		const input = payload.value;
		const r = def.fn(input);
		if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
		handleRefineResult(r, payload, input, inst);
	};
});
function handleRefineResult(result, payload, input, inst) {
	if (!result) {
		const _iss = {
			code: "custom",
			input,
			inst,
			path: [...inst._zod.def.path ?? []],
			continue: !inst._zod.def.abort
		};
		if (inst._zod.def.params) _iss.params = inst._zod.def.params;
		payload.issues.push(issue(_iss));
	}
}
// node_modules/zod/v4/core/memoizer.js
var $ZodCyclicError = class extends Error {
	constructor() {
		super(`Cannot parse a reference cycle that closes through a transform`);
		this.name = "ZodCyclicError";
	}
};
/** Keyed off the context object every schema in one parse call already shares. */
var STATE = "~memo";
var NO_ISSUES = [];
function isRef(value) {
	return value !== null && typeof value === "object";
}
function cloneIssues(issues) {
	return issues.map((iss) => iss.path ? {
		...iss,
		path: iss.path.slice()
	} : { ...iss });
}
var recursive = /*@__PURE__*/ new WeakMap();
/** What the walk established, in order of certainty: ordered so the strongest answer among children wins. */
var NONE = 0;
var ASSUMED = 1;
var PROVEN = 2;
/** Whether this schema's subtree contains a cycle, so one parse can re-enter it. */
function isRecursive(inst, stack, resolve) {
	const cached = recursive.get(inst);
	if (cached !== void 0) return cached ? PROVEN : NONE;
	if (stack.has(inst)) return PROVEN;
	stack.add(inst);
	let result = NONE;
	const check = (child) => {
		if (result !== PROVEN && child?._zod) {
			const answer = isRecursive(child, stack, resolve);
			if (answer > result) result = answer;
		}
	};
	const shape = (sh, spread) => {
		let answer = NONE;
		for (const key of Reflect.ownKeys(sh)) {
			const desc = Object.getOwnPropertyDescriptor(sh, key);
			if (spread && !desc.enumerable) continue;
			const child = desc.get ? ASSUMED : desc.value?._zod ? isRecursive(desc.value, stack, resolve) : NONE;
			if (child > answer) answer = child;
		}
		return answer;
	};
	const merge = (answer) => {
		if (answer > result) result = answer;
	};
	const def = inst._zod.def;
	switch (def.type) {
		case "object": {
			const raw = rawShape(def);
			merge(raw ? shape(raw, true) : ASSUMED);
			check(def.catchall);
			break;
		}
		case "array":
			check(def.element);
			break;
		case "tuple":
			for (const el of def.items) check(el);
			check(def.rest);
			break;
		case "record":
		case "map":
			check(def.keyType);
			check(def.valueType);
			break;
		case "set":
			check(def.valueType);
			break;
		case "union":
			for (const el of def.options) check(el);
			break;
		case "intersection":
			check(def.left);
			check(def.right);
			break;
		case "optional":
		case "nullable":
		case "default":
		case "prefault":
		case "catch":
		case "readonly":
		case "nonoptional":
		case "promise":
		case "success":
			check(def.innerType);
			break;
		case "pipe":
			check(def.in);
			check(def.out);
			break;
		case "function":
			check(def.input);
			check(def.output);
			break;
		case "lazy": {
			const inner = def._cachedInner ?? (resolve ? inst._zod.innerType : void 0);
			merge(inner ? isRecursive(inner, stack, false) : ASSUMED);
			break;
		}
		case "template_literal":
		case "string":
		case "number":
		case "int":
		case "boolean":
		case "bigint":
		case "symbol":
		case "undefined":
		case "null":
		case "void":
		case "never":
		case "any":
		case "unknown":
		case "date":
		case "nan":
		case "enum":
		case "literal":
		case "file":
		case "transform":
		case "custom": break;
		default: for (const key in def) {
			const desc = Object.getOwnPropertyDescriptor(def, key);
			if (!desc || desc.get) continue;
			const value = desc.value;
			if (!value || typeof value !== "object") continue;
			if (value._zod) check(value);
			else if (Array.isArray(value)) for (const el of value) check(el);
		}
	}
	stack.delete(inst);
	return settle(inst, result);
}
/** An assumed answer must not outlive the resolution that settles it, so only a certain one is cached. */
function settle(inst, answer) {
	if (answer !== ASSUMED) recursive.set(inst, answer === PROVEN);
	return answer;
}
function bucketFor(state, inst) {
	let bucket = state.buckets.get(inst);
	if (!bucket) {
		bucket = /* @__PURE__ */ new WeakMap();
		state.buckets.set(inst, bucket);
	}
	return bucket;
}
var handoff;
var open = [];
var memo = {
	alloc(_inst, payload, empty) {
		const bucket = handoff;
		if (!bucket) return empty;
		handoff = void 0;
		const entry = {
			value: empty,
			issues: null
		};
		bucket.set(payload.value, entry);
		open.push(entry);
		return empty;
	},
	guard(inst) {
		var _a;
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred.push(() => {
			const base = inst._zod.parse;
			const wrapped = (payload, ctx) => {
				if (ctx.direction !== "backward" && isBackEdge(ctx, payload.value)) throw new $ZodCyclicError();
				return base(payload, ctx);
			};
			inst._zod.parse = wrapped;
			if (inst._zod.run === base) inst._zod.run = wrapped;
		});
	},
	attach(inst) {
		var _a;
		let isRecursiveInst;
		let rechecked = false;
		let lastCtx;
		let lastBucket;
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred.push(() => {
			const base = inst._zod.parse;
			const wrapped = (payload, ctx) => {
				if (isRecursiveInst === void 0) {
					const walked = isRecursive(inst, /* @__PURE__ */ new Set(), false);
					if (walked === NONE) {
						inst._zod.parse = base;
						if (inst._zod.run === wrapped) inst._zod.run = base;
						return base(payload, ctx);
					}
					if (walked === PROVEN || rechecked) isRecursiveInst = true;
					else rechecked = true;
				}
				const input = payload.value;
				if (!isRef(input)) return base(payload, ctx);
				let state = ctx[STATE];
				if (!state) {
					state = {
						buckets: /* @__PURE__ */ new WeakMap(),
						backEdges: void 0
					};
					ctx[STATE] = state;
				}
				let bucket;
				if (lastCtx === ctx) bucket = lastBucket;
				else {
					bucket = bucketFor(state, inst);
					lastCtx = ctx;
					lastBucket = bucket;
				}
				const hit = bucket.get(input);
				if (hit) {
					payload.value = hit.value;
					if (hit.issues) {
						if (hit.issues.length) payload.issues.push(...cloneIssues(hit.issues));
					} else {
						payload.memo = true;
						state.backEdges ?? (state.backEdges = /* @__PURE__ */ new WeakSet());
						state.backEdges.add(hit.value);
					}
					return payload;
				}
				handoff = bucket;
				const depth = open.length;
				const result = base(payload, ctx);
				handoff = void 0;
				const entry = open.length > depth ? open.pop() : void 0;
				if (result instanceof Promise) return result.then((r) => {
					if (entry) entry.issues = r.issues.length ? cloneIssues(r.issues) : NO_ISSUES;
					return r;
				});
				if (entry) entry.issues = result.issues.length ? cloneIssues(result.issues) : NO_ISSUES;
				return result;
			};
			inst._zod.parse = wrapped;
			if (inst._zod.run === base) inst._zod.run = wrapped;
		});
	}
};
/** The memoizer that gives containers cycle support. `zod` installs it by default; `zod/mini` opts in with `config({ memoizer: memoizer() })`. */
function memoizer() {
	return memo;
}
/** Whether this value is a node a back-edge resolved to before it finished. */
function isBackEdge(ctx, value) {
	const backEdges = ctx[STATE]?.backEdges;
	return backEdges !== void 0 && isRef(value) && backEdges.has(value);
}
// node_modules/zod/v4/locales/en.js
var error = () => {
	const Sizable = {
		string: {
			unit: "characters",
			verb: "to have"
		},
		file: {
			unit: "bytes",
			verb: "to have"
		},
		array: {
			unit: "items",
			verb: "to have"
		},
		set: {
			unit: "items",
			verb: "to have"
		},
		map: {
			unit: "entries",
			verb: "to have"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "input",
		email: "email address",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO datetime",
		date: "ISO date",
		time: "ISO time",
		duration: "ISO duration",
		ipv4: "IPv4 address",
		ipv6: "IPv6 address",
		mac: "MAC address",
		cidrv4: "IPv4 range",
		cidrv6: "IPv6 range",
		base64: "base64-encoded string",
		base64url: "base64url-encoded string",
		json_string: "JSON string",
		e164: "E.164 number",
		currency_code: "currency code",
		credit_card: "credit card number",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "input"
	};
	const TypeDictionary = { nan: "NaN" };
	function getTypeName(type, input) {
		if (type === "number" && typeof input === "number" && !Number.isFinite(input)) return String(input);
		return TypeDictionary[type] ?? type;
	}
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": return `Invalid input: expected ${getTypeName(issue.expected)}, received ${getTypeName(parsedType(issue.input), issue.input)}`;
			case "invalid_value":
				if (issue.values.length === 1) return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
				return `Invalid option: expected one of ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.exact ? "exactly " : issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
				return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.exact ? "exactly " : issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Invalid string: must start with "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Invalid string: must end with "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Invalid string: must include "${_issue.includes}"`;
				if (_issue.format === "regex") return `Invalid string: must match pattern ${_issue.pattern}`;
				return `Invalid ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Invalid number: must be a multiple of ${issue.divisor}`;
			case "unrecognized_keys": return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Invalid key in ${issue.origin}`;
			case "invalid_union":
				if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) return `Invalid discriminator value. Expected ${issue.options.map((o) => `'${o}'`).join(" | ")}`;
				if (issue.inclusive === false) return "Invalid input: more than one option matched";
				return "Invalid input";
			case "invalid_element": return `Invalid value in ${issue.origin}`;
			default: return `Invalid input`;
		}
	};
};
function en_default() {
	return { localeError: error() };
}
// node_modules/zod/v4/core/registries.js
var _a;
var $ZodRegistry = class {
	constructor() {
		this._map = /* @__PURE__ */ new WeakMap();
		this._idmap = /* @__PURE__ */ new Map();
	}
	add(schema, ..._meta) {
		const meta = _meta[0];
		this._map.set(schema, meta);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
		return this;
	}
	clear() {
		this._map = /* @__PURE__ */ new WeakMap();
		this._idmap = /* @__PURE__ */ new Map();
		return this;
	}
	remove(schema) {
		const meta = this._map.get(schema);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
		this._map.delete(schema);
		return this;
	}
	get(schema) {
		const p = schema._zod.parent;
		if (p) {
			const pm = { ...this.get(p) ?? {} };
			delete pm.id;
			const f = {
				...pm,
				...this._map.get(schema)
			};
			return Object.keys(f).length ? f : void 0;
		}
		return this._map.get(schema);
	}
	has(schema) {
		return this._map.has(schema);
	}
};
function registry() {
	return new $ZodRegistry();
}
(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
var globalRegistry = globalThis.__zod_globalRegistry;
// node_modules/zod/v4/core/api.js
function snapshotChecks(def) {
	if (def.checks) def.checks = [...def.checks];
	return def;
}
// @__NO_SIDE_EFFECTS__
function _string(Class, params) {
	return new Class(snapshotChecks({
		type: "string",
		...normalizeParams(params)
	}));
}
// @__NO_SIDE_EFFECTS__
function _email(Class, params) {
	return new Class({
		type: "string",
		format: "email",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _guid(Class, params) {
	return new Class({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuid(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv4(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v4",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv6(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v6",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv7(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v7",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _url(Class, params) {
	return new Class({
		type: "string",
		format: "url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _emoji(Class, params) {
	return new Class({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _nanoid(Class, params) {
	return new Class({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link _cuid2} instead.
* See https://github.com/paralleldrive/cuid.
*/
// @__NO_SIDE_EFFECTS__
function _cuid(Class, params) {
	return new Class({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cuid2(Class, params) {
	return new Class({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ulid(Class, params) {
	return new Class({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _xid(Class, params) {
	return new Class({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ksuid(Class, params) {
	return new Class({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ipv4(Class, params) {
	return new Class({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ipv6(Class, params) {
	return new Class({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cidrv4(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cidrv6(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _base64(Class, params) {
	return new Class({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _base64url(Class, params) {
	return new Class({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _e164(Class, params) {
	return new Class({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _jwt(Class, params) {
	return new Class({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDateTime(Class, params) {
	return new Class({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: false,
		local: false,
		precision: null,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDate(Class, params) {
	return new Class({
		type: "string",
		format: "date",
		check: "string_format",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoTime(Class, params) {
	return new Class({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDuration(Class, params) {
	return new Class({
		type: "string",
		format: "duration",
		check: "string_format",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _number(Class, params) {
	return new Class(snapshotChecks({
		type: "number",
		checks: [],
		...normalizeParams(params)
	}));
}
// @__NO_SIDE_EFFECTS__
function _int(Class, params) {
	return new Class({
		type: "number",
		check: "number_format",
		abort: false,
		format: "safeint",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _boolean(Class, params) {
	return new Class({
		type: "boolean",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _unknown(Class) {
	return new Class({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function _never(Class, params) {
	return new Class({
		type: "never",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _coercedDate(Class, params) {
	return new Class({
		type: "date",
		coerce: true,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _lt(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
// @__NO_SIDE_EFFECTS__
function _lte(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
// @__NO_SIDE_EFFECTS__
function _gt(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
// @__NO_SIDE_EFFECTS__
function _gte(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
// @__NO_SIDE_EFFECTS__
function _multipleOf(value, params) {
	return new $ZodCheckMultipleOf({
		check: "multiple_of",
		...normalizeParams(params),
		value
	});
}
// @__NO_SIDE_EFFECTS__
function _maxLength(maximum, params) {
	return new $ZodCheckMaxLength({
		check: "max_length",
		...normalizeParams(params),
		maximum
	});
}
// @__NO_SIDE_EFFECTS__
function _minLength(minimum, params) {
	return new $ZodCheckMinLength({
		check: "min_length",
		...normalizeParams(params),
		minimum
	});
}
// @__NO_SIDE_EFFECTS__
function _length(length, params) {
	return new $ZodCheckLengthEquals({
		check: "length_equals",
		...normalizeParams(params),
		length
	});
}
// @__NO_SIDE_EFFECTS__
function _regex(pattern, params) {
	return new $ZodCheckRegex({
		check: "string_format",
		format: "regex",
		...normalizeParams(params),
		pattern
	});
}
// @__NO_SIDE_EFFECTS__
function _lowercase(params) {
	return new $ZodCheckLowerCase({
		check: "string_format",
		format: "lowercase",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uppercase(params) {
	return new $ZodCheckUpperCase({
		check: "string_format",
		format: "uppercase",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _includes(includes, params) {
	return new $ZodCheckIncludes({
		check: "string_format",
		format: "includes",
		...normalizeParams(params),
		includes
	});
}
// @__NO_SIDE_EFFECTS__
function _startsWith(prefix, params) {
	return new $ZodCheckStartsWith({
		check: "string_format",
		format: "starts_with",
		...normalizeParams(params),
		prefix
	});
}
// @__NO_SIDE_EFFECTS__
function _endsWith(suffix, params) {
	return new $ZodCheckEndsWith({
		check: "string_format",
		format: "ends_with",
		...normalizeParams(params),
		suffix
	});
}
// @__NO_SIDE_EFFECTS__
function _overwrite(tx) {
	return new $ZodCheckOverwrite({
		check: "overwrite",
		tx
	});
}
// @__NO_SIDE_EFFECTS__
function _normalize(form) {
	return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
// @__NO_SIDE_EFFECTS__
function _trim() {
	return /* @__PURE__ */ _overwrite((input) => input.trim());
}
// @__NO_SIDE_EFFECTS__
function _toLowerCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function _toUpperCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function _slugify() {
	return /* @__PURE__ */ _overwrite((input) => slugify$1(input));
}
// @__NO_SIDE_EFFECTS__
function _array(Class, element, params) {
	return new Class({
		type: "array",
		element,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _refine(Class, fn, _params) {
	return new Class({
		type: "custom",
		check: "custom",
		fn,
		...normalizeParams(_params)
	});
}
// @__NO_SIDE_EFFECTS__
function _superRefine(fn, params) {
	const ch = /* @__PURE__ */ _check((payload) => {
		payload.addIssue = (issue$2) => {
			if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
			else {
				const _issue = issue$2;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				if (!("input" in _issue)) _issue.input = payload.value;
				_issue.inst ?? (_issue.inst = ch);
				_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
				payload.issues.push(issue(_issue));
			}
		};
		return fn(payload.value, payload);
	}, params);
	return ch;
}
// @__NO_SIDE_EFFECTS__
function _check(fn, params) {
	const ch = new $ZodCheck({
		check: "custom",
		...normalizeParams(params)
	});
	ch._zod.check = fn;
	return ch;
}
// node_modules/zod/v4/core/to-json-schema.js
function assignProps(target, ...sources) {
	for (const source of sources) for (const key of Reflect.ownKeys(source)) if (Object.prototype.propertyIsEnumerable.call(source, key)) assignProp(target, key, source[key]);
	return target;
}
function initializeContext(params) {
	let target = params?.target ?? "draft-2020-12";
	if (target === "draft-4") target = "draft-04";
	if (target === "draft-7") target = "draft-07";
	return {
		processors: params.processors ?? {},
		metadataRegistry: params?.metadata ?? globalRegistry,
		target,
		unrepresentable: params?.unrepresentable ?? "throw",
		override: params?.override ?? (() => {}),
		io: params?.io ?? "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		sharedDefsExtractedFor: void 0,
		sharedEmitDoneFor: void 0,
		cycles: params?.cycles ?? "ref",
		reused: params?.reused ?? "inline",
		intersections: [],
		deferred: [],
		external: params?.external ?? void 0
	};
}
/**
* Applies the `unrepresentable` setting at a site that has no JSON Schema equivalent. Throws
* `message` unless the setting (or the handler's return value) says otherwise. Returns `true` if a
* custom JSON Schema was written into `json`, in which case the caller must not write its own.
*/
function handleUnrepresentable(schema, ctx, json, params, message) {
	const result = typeof ctx.unrepresentable === "function" ? ctx.unrepresentable({
		zodSchema: schema,
		path: params.path,
		message
	}) : ctx.unrepresentable;
	if (result === "any") return false;
	if (result === void 0 || result === "throw") throw new Error(message);
	Object.assign(json, result);
	return true;
}
function processSchema(schema, ctx, _params = {
	path: [],
	schemaPath: []
}) {
	var _a;
	const def = schema._zod.def;
	const seen = ctx.seen.get(schema);
	if (seen) {
		seen.count++;
		if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
		return seen.schema;
	}
	const result = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: _params.path
	};
	ctx.seen.set(schema, result);
	ctx.sharedDefsExtractedFor = void 0;
	ctx.sharedEmitDoneFor = void 0;
	const overrideSchema = schema._zod.toJSONSchema?.();
	if (overrideSchema) result.schema = overrideSchema;
	else {
		const params = {
			..._params,
			schemaPath: [..._params.schemaPath, schema],
			path: _params.path
		};
		if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
		else {
			const _json = result.schema;
			const processor = ctx.processors[def.type];
			if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
			processor(schema, ctx, _json, params);
		}
		const parent = schema._zod.parent;
		if (parent) {
			if (!result.ref) result.ref = parent;
			processSchema(parent, ctx, params);
			ctx.seen.get(parent).isParent = true;
		}
	}
	const meta = ctx.metadataRegistry.get(schema);
	if (meta) assignProps(result.schema, meta);
	if (ctx.io === "input" && isTransforming(schema)) {
		delete result.schema.examples;
		delete result.schema.default;
	}
	if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
	delete result.schema._prefault;
	return ctx.seen.get(schema).schema;
}
function encodeJSONPointerSegment(segment) {
	return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}
function extractDefs(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	if (ctx.external && ctx.sharedDefsExtractedFor === ctx.external) return;
	const idToSchema = /* @__PURE__ */ new Map();
	for (const entry of ctx.seen.entries()) {
		const id = ctx.metadataRegistry.get(entry[0])?.id;
		if (id) {
			const existing = idToSchema.get(id);
			if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			idToSchema.set(id, entry[0]);
		}
	}
	const makeURI = (entry) => {
		const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
		if (ctx.external) {
			const externalId = ctx.external.registry.get(entry[0])?.id;
			const uriGenerator = ctx.external.uri ?? ((id) => id);
			if (externalId) return { ref: uriGenerator(externalId) };
			const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
			entry[1].defId = id;
			return {
				defId: id,
				ref: `${uriGenerator("__shared")}#/${defsSegment}/${encodeJSONPointerSegment(id)}`
			};
		}
		const uriPrefix = `#`;
		const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
		if (entry[1] === root && !entry[1].schema.id) return { ref: uriPrefix };
		const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
		return {
			defId,
			ref: defUriPrefix + encodeJSONPointerSegment(defId)
		};
	};
	const extractToDef = (entry) => {
		if (entry[1].schema.$ref) return;
		const seen = entry[1];
		const { ref, defId } = makeURI(entry);
		seen.def = { ...seen.schema };
		if (defId) seen.defId = defId;
		const schema = seen.schema;
		for (const key in schema) delete schema[key];
		schema.$ref = ref;
	};
	if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (schema === entry[0]) {
			extractToDef(entry);
			continue;
		}
		if (ctx.external) {
			const ext = ctx.external.registry.get(entry[0])?.id;
			if (schema !== entry[0] && ext) {
				extractToDef(entry);
				continue;
			}
		}
		if (ctx.metadataRegistry.get(entry[0])?.id) {
			extractToDef(entry);
			continue;
		}
		if (seen.cycle) {
			extractToDef(entry);
			continue;
		}
		if (seen.count > 1) {
			if (ctx.reused === "ref") extractToDef(entry);
		}
	}
	if (ctx.external) ctx.sharedDefsExtractedFor = ctx.external;
}
/** Rewrites `anyOf: [{type: "a"}, {type: "b"}]` to `type: ["a", "b"]`, which every JSON Schema draft treats as equivalent and most consumers render far better for the nullable case. Only branches that are a bare type assertion qualify — anything carrying a constraint, `$ref`, `const` or metadata is left alone. Runs after `flattenRef`, so a branch an override decorated or `$defs` extraction turned into a `$ref` is no longer bare and correctly stays in `anyOf`. `oneOf` is excluded: `integer` and `number` overlap, so "exactly one" and "at least one" are not the same there. OpenAPI 3.0 is excluded: its `type` must be a single string. */
function compactTypeUnion(schema) {
	const options = schema.anyOf;
	if (!Array.isArray(options) || options.length === 0 || schema.type !== void 0) return;
	const types = [];
	for (const option of options) {
		if (!option || typeof option !== "object") return;
		compactTypeUnion(option);
		const keys = Object.keys(option);
		if (keys.length !== 1 || keys[0] !== "type") return;
		const type = option.type;
		for (const member of Array.isArray(type) ? type : [type]) {
			if (typeof member !== "string") return;
			if (!types.includes(member)) types.push(member);
		}
	}
	delete schema.anyOf;
	schema.type = types.length === 1 ? types[0] : types;
}
/** Keywords `foldIntersection` knows how to combine. Anything else — `$ref`, `patternProperties`,
* an annotation like `description` — makes a member unfoldable, so a constraint this does not
* understand leaves the `allOf` alone instead of being silently dropped or misattributed. */
var FOLDABLE_KEYS = /* @__PURE__ */ new Set([
	"type",
	"properties",
	"required",
	"additionalProperties"
]);
var UNION_KEYS = ["oneOf", "anyOf"];
/** A member's constraint on a key it does not declare itself. A `catchall` states one; `false`, an absent `additionalProperties`, and the empty schema a loose object emits state nothing. */
function undeclaredConstraint(member) {
	const extra = member.additionalProperties;
	if (extra === void 0 || extra === false || typeof extra !== "object" || extra === null) return null;
	return Object.keys(extra).length ? extra : null;
}
/** Combines object members into the single object they describe together, or returns `null` if any of them carries a keyword outside {@link FOLDABLE_KEYS}. */
function foldObjects(members) {
	const objects = [];
	for (const member of members) {
		if (typeof member !== "object" || member.type !== "object") return null;
		for (const key in member) if (!FOLDABLE_KEYS.has(key)) return null;
		objects.push(member);
	}
	const properties = {};
	const required = /* @__PURE__ */ new Set();
	for (const object of objects) {
		for (const key in object.properties) {
			if (Object.prototype.hasOwnProperty.call(properties, key)) continue;
			const parts = [];
			for (const other of objects) {
				const part = other.properties?.[key] ?? undeclaredConstraint(other);
				if (part === null || part === void 0) continue;
				if (!parts.some((seen) => JSON.stringify(seen) === JSON.stringify(part))) parts.push(part);
			}
			assignProp(properties, key, parts.length === 1 ? parts[0] : foldObjects(parts) ?? { allOf: parts });
		}
		for (const key of object.required ?? []) required.add(key);
	}
	const folded = {
		type: "object",
		properties
	};
	if (required.size) folded.required = [...required];
	if (objects.every((object) => object.additionalProperties === false)) folded.additionalProperties = false;
	else {
		const constraints = [];
		for (const object of objects) {
			const constraint = undeclaredConstraint(object);
			if (constraint && !constraints.some((seen) => JSON.stringify(seen) === JSON.stringify(constraint))) constraints.push(constraint);
		}
		if (constraints.length === 1) folded.additionalProperties = constraints[0];
		else if (constraints.length > 1) folded.additionalProperties = { allOf: constraints };
	}
	return folded;
}
/** `additionalProperties` in an `allOf` member sees only that member's own `properties`, so two
* closed object members reject each other's keys and the schema validates nothing. Zod's parser
* pools the key sets instead — `handleIntersectionResults` reports a key as unrecognized only when
* *every* side rejects it — so the emitted schema has to pool them too, and folding the members
* into one object is the encoding that says so on every target.
*
* This runs from `finalize`, after `extractDefs`, which is what keeps it clear of the `$ref`
* machinery: a member extracted into `$defs` is already a `$ref` by now and declines to fold, so it
* keeps its reference and its own closedness rather than being inlined as a stale copy. */
function foldIntersection(json) {
	const allOf = json.allOf;
	if (!Array.isArray(allOf) || allOf.length < 2) return;
	for (const key of FOLDABLE_KEYS) if (key in json) return;
	const unions = allOf.filter((m) => UNION_KEYS.some((k) => Array.isArray(m[k])));
	let folded = null;
	if (!unions.length) folded = foldObjects(allOf);
	else {
		const union = unions[0];
		const keyword = UNION_KEYS.find((k) => Array.isArray(union[k]));
		if (Object.keys(union).length !== 1) return;
		const rest = allOf.filter((m) => m !== union);
		const branches = union[keyword].map((branch) => foldObjects([...rest, branch]));
		if (branches.some((b) => !b)) return;
		folded = { [keyword]: branches };
	}
	if (!folded) return;
	delete json.allOf;
	assignProps(json, folded);
}
function finalize(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const flattenRef = (zodSchema) => {
		const seen = ctx.seen.get(zodSchema);
		if (seen.ref === null) return;
		const schema = seen.def ?? seen.schema;
		const _cached = { ...schema };
		const ref = seen.ref;
		seen.ref = null;
		if (ref) {
			flattenRef(ref);
			const refSeen = ctx.seen.get(ref);
			const refSchema = refSeen.schema;
			if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
				schema.allOf = schema.allOf ?? [];
				schema.allOf.push(refSchema);
			} else assignProps(schema, refSchema);
			assignProps(schema, _cached);
			if (zodSchema._zod.parent === ref) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (!(key in _cached)) delete schema[key];
			}
			if (refSchema.$ref && refSeen.def) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
			}
		}
		const parent = zodSchema._zod.parent;
		if (parent && parent !== ref) {
			flattenRef(parent);
			const parentSeen = ctx.seen.get(parent);
			if (parentSeen?.schema.$ref) {
				schema.$ref = parentSeen.schema.$ref;
				if (parentSeen.def) for (const key in schema) {
					if (key === "$ref" || key === "allOf") continue;
					if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
				}
			}
		}
		ctx.override({
			zodSchema,
			jsonSchema: schema,
			path: seen.path ?? []
		});
	};
	if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
		for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
		if (ctx.target !== "openapi-3.0") for (const entry of ctx.seen.entries()) compactTypeUnion(entry[1].def ?? entry[1].schema);
		for (const rewrite of ctx.deferred) rewrite();
		if (ctx.intersections.length) {
			const carriers = /* @__PURE__ */ new Map();
			for (const seen of ctx.seen.values()) for (const json of [seen.schema, seen.def]) {
				const allOf = json?.allOf;
				if (!Array.isArray(allOf)) continue;
				const existing = carriers.get(allOf);
				if (existing) existing.push(json);
				else carriers.set(allOf, [json]);
			}
			for (const allOf of ctx.intersections) for (const json of carriers.get(allOf) ?? []) foldIntersection(json);
		}
	}
	const result = {};
	if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
	else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
	else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
	else if (ctx.target === "openapi-3.0") {}
	if (ctx.external?.uri) {
		const id = ctx.external.registry.get(schema)?.id;
		if (!id) throw new Error("Schema is missing an `id` property");
		result.$id = ctx.external.uri(id);
	}
	assignProps(result, root.defId ? root.schema : root.def ?? root.schema);
	const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
	if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
	const defs = ctx.external?.defs ?? {};
	if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.def && seen.defId) {
			if (seen.def.id === seen.defId) delete seen.def.id;
			assignProp(defs, seen.defId, seen.def);
		}
	}
	if (ctx.external) ctx.sharedEmitDoneFor = ctx.external;
	if (ctx.external) {} else if (Object.keys(defs).length > 0) {
		if (ctx.target === "draft-2020-12") result.$defs = defs;
		else result.definitions = defs;
	}
	try {
		const finalized = JSON.parse(JSON.stringify(result));
		Object.defineProperty(finalized, "~standard", {
			value: {
				...schema["~standard"],
				jsonSchema: {
					input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
					output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
				}
			},
			enumerable: false,
			writable: false
		});
		return finalized;
	} catch (_err) {
		throw new Error("Error converting schema to JSON.");
	}
}
function isTransforming(_schema, _ctx) {
	const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
	if (ctx.seen.has(_schema)) return false;
	ctx.seen.add(_schema);
	const def = _schema._zod.def;
	if (def.type === "transform") return true;
	if (def.type === "array") return isTransforming(def.element, ctx);
	if (def.type === "set") return isTransforming(def.valueType, ctx);
	if (def.type === "lazy") return isTransforming(def.getter(), ctx);
	if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault" || def.type === "catch") return isTransforming(def.innerType, ctx);
	if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
	if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
	if (def.type === "pipe") {
		if (_schema._zod.traits.has("$ZodCodec")) return true;
		return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
	}
	if (def.type === "object") {
		for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
		return false;
	}
	if (def.type === "union") {
		for (const option of def.options) if (isTransforming(option, ctx)) return true;
		return false;
	}
	if (def.type === "tuple") {
		for (const item of def.items) if (isTransforming(item, ctx)) return true;
		if (def.rest && isTransforming(def.rest, ctx)) return true;
		return false;
	}
	return false;
}
/**
* Creates a toJSONSchema method for a schema instance.
* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
*/
var createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
	const ctx = initializeContext({
		...params,
		processors
	});
	processSchema(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};
var createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
	const { libraryOptions, target } = params ?? {};
	const ctx = initializeContext({
		...libraryOptions ?? {},
		target,
		io,
		processors
	});
	processSchema(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};
// node_modules/zod/v4/core/json-schema-processors.js
var narrowMin = (agg, key, value) => {
	if (agg[key] === void 0 || value > agg[key]) agg[key] = value;
};
var narrowMax = (agg, key, value) => {
	if (agg[key] === void 0 || value < agg[key]) agg[key] = value;
};
var narrowBoth = (agg, value) => {
	narrowMin(agg, "minimum", value);
	narrowMax(agg, "maximum", value);
};
var addDivisor = (agg, value) => {
	agg.multipleOf ?? (agg.multipleOf = []);
	if (!agg.multipleOf.includes(value)) agg.multipleOf.push(value);
};
var addPattern = (agg, pattern) => {
	agg.patterns ?? (agg.patterns = /* @__PURE__ */ new Set());
	agg.patterns.add(pattern);
};
var intersectMime = (agg, mime) => {
	agg.mime = agg.mime ? agg.mime.filter((m) => mime.includes(m)) : [...mime];
};
var setFormat = (agg, format) => {
	agg.format = format;
	if (format.includes("int")) agg.isInt = true;
};
var minContributor = (agg, def) => narrowMin(agg, "minimum", def.minimum);
var maxContributor = (agg, def) => narrowMax(agg, "maximum", def.maximum);
var formatContributor = (ranges) => (agg, def) => {
	setFormat(agg, def.format);
	const [minimum, maximum] = ranges[def.format];
	narrowMin(agg, "minimum", minimum);
	narrowMax(agg, "maximum", maximum);
};
var contributors = {
	greater_than: (agg, def) => narrowMin(agg, def.inclusive ? "minimum" : "exclusiveMinimum", def.value),
	less_than: (agg, def) => narrowMax(agg, def.inclusive ? "maximum" : "exclusiveMaximum", def.value),
	multiple_of: (agg, def) => addDivisor(agg, def.value),
	number_format: formatContributor(NUMBER_FORMAT_RANGES),
	bigint_format: formatContributor(BIGINT_FORMAT_RANGES),
	min_length: minContributor,
	max_length: maxContributor,
	length_equals: (agg, def) => narrowBoth(agg, def.length),
	min_size: minContributor,
	max_size: maxContributor,
	size_equals: (agg, def) => narrowBoth(agg, def.size),
	string_format: (agg, def) => {
		setFormat(agg, def.format);
		if (def.pattern) addPattern(agg, def.pattern);
		if (def.format === "base64" || def.format === "base64url") agg.contentEncoding = def.format;
		if (def.local || def.precision === -1) agg.laxFormat = true;
	},
	mime_type: (agg, def) => intersectMime(agg, def.mime)
};
function aggregateChecks(schema) {
	const agg = {};
	const def = schema._zod.def;
	const list = schema._zod.traits.has("$ZodCheck") ? [schema, ...def.checks ?? []] : def.checks ?? [];
	for (const ch of list) contributors[ch._zod.def.check]?.(agg, ch._zod.def);
	const bag = schema._zod.bag;
	if (bag.minimum !== void 0) narrowMin(agg, "minimum", bag.minimum);
	if (bag.exclusiveMinimum !== void 0) narrowMin(agg, "exclusiveMinimum", bag.exclusiveMinimum);
	if (bag.maximum !== void 0) narrowMax(agg, "maximum", bag.maximum);
	if (bag.exclusiveMaximum !== void 0) narrowMax(agg, "exclusiveMaximum", bag.exclusiveMaximum);
	if (bag.multipleOf !== void 0) addDivisor(agg, bag.multipleOf);
	if (bag.format !== void 0) {
		agg.format ?? (agg.format = bag.format);
		if (bag.format.includes("int")) agg.isInt = true;
	}
	if (bag.mime) intersectMime(agg, bag.mime);
	for (const pattern of bag.patterns ?? []) addPattern(agg, pattern);
	return agg;
}
var formatMap = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
};
var exactPatterns = /* @__PURE__ */ new Map([[base64Charset, base64], [base64urlCharset, base64url]]);
var exactPattern = (p) => exactPatterns.get(p) ?? p;
var stringProcessor = (schema, ctx, _json, _params) => {
	const json = _json;
	json.type = "string";
	const { minimum, maximum, format, patterns, contentEncoding, laxFormat } = aggregateChecks(schema);
	if (typeof minimum === "number") json.minLength = minimum;
	if (typeof maximum === "number") json.maxLength = maximum;
	if (format) {
		json.format = formatMap[format] ?? format;
		if (json.format === "") delete json.format;
		if (format === "time" || laxFormat) delete json.format;
	}
	if (contentEncoding) json.contentEncoding = contentEncoding;
	if (patterns && patterns.size > 0) {
		const patternList = [...patterns].map(exactPattern);
		if (patternList.length === 1) json.pattern = patternList[0].source;
		else if (patternList.length > 1) json.allOf = [...patternList.map((regex) => ({
			...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: regex.source
		}))];
	}
};
var numberProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const { minimum, maximum, multipleOf, exclusiveMaximum, exclusiveMinimum, isInt } = aggregateChecks(schema);
	json.type = isInt ? "integer" : "number";
	const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
	const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
	const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
	if (exMin) {
		if (legacy) {
			json.minimum = exclusiveMinimum;
			json.exclusiveMinimum = true;
		} else json.exclusiveMinimum = exclusiveMinimum;
	} else if (typeof minimum === "number") json.minimum = minimum;
	if (exMax) {
		if (legacy) {
			json.maximum = exclusiveMaximum;
			json.exclusiveMaximum = true;
		} else json.exclusiveMaximum = exclusiveMaximum;
	} else if (typeof maximum === "number") json.maximum = maximum;
	if (multipleOf) {
		const divisors = /* @__PURE__ */ new Set();
		for (const divisor of multipleOf) if (Number.isFinite(divisor) && divisor !== 0) divisors.add(Math.abs(divisor));
		else handleUnrepresentable(schema, ctx, json, params, `A multipleOf divisor of ${divisor} cannot be represented in JSON Schema`);
		const [first, ...rest] = divisors;
		if (first !== void 0) json.multipleOf = first;
		if (rest.length) json.allOf = [...json.allOf ?? [], ...rest.map((m) => ({ multipleOf: m }))];
	}
};
var booleanProcessor = (_schema, _ctx, json, _params) => {
	json.type = "boolean";
};
var neverProcessor = (_schema, _ctx, json, _params) => {
	json.not = {};
};
var dateProcessor = (schema, ctx, json, params) => {
	handleUnrepresentable(schema, ctx, json, params, "Date cannot be represented in JSON Schema");
};
var enumProcessor = (schema, _ctx, json, _params) => {
	const def = schema._zod.def;
	const values = getEnumValues(def.entries);
	if (values.length === 0) {
		json.not = {};
		return;
	}
	if (values.every((v) => typeof v === "number")) json.type = "number";
	if (values.every((v) => typeof v === "string")) json.type = "string";
	json.enum = values;
};
var literalProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	if (def.values.length === 0) {
		json.not = {};
		return;
	}
	const vals = [];
	for (const val of def.values) if (val === void 0) {
		if (handleUnrepresentable(schema, ctx, json, params, "Literal `undefined` cannot be represented in JSON Schema")) return;
	} else if (typeof val === "bigint") {
		if (handleUnrepresentable(schema, ctx, json, params, "BigInt literals cannot be represented in JSON Schema")) return;
		vals.push(Number(val));
	} else vals.push(val);
	if (vals.length === 0) {} else if (vals.length === 1) {
		const val = vals[0];
		json.type = val === null ? "null" : typeof val;
		if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") json.enum = [val];
		else json.const = val;
	} else {
		if (vals.every((v) => typeof v === "number")) json.type = "number";
		if (vals.every((v) => typeof v === "string")) json.type = "string";
		if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
		if (vals.every((v) => v === null)) json.type = "null";
		json.enum = vals;
	}
};
var customProcessor = (schema, ctx, json, params) => {
	handleUnrepresentable(schema, ctx, json, params, "Custom types cannot be represented in JSON Schema");
};
var transformProcessor = (schema, ctx, json, params) => {
	handleUnrepresentable(schema, ctx, json, params, "Transforms cannot be represented in JSON Schema");
};
var arrayProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	const { minimum, maximum } = aggregateChecks(schema);
	if (typeof minimum === "number") json.minItems = minimum;
	if (typeof maximum === "number") json.maxItems = maximum;
	json.type = "array";
	json.items = processSchema(def.element, ctx, {
		...params,
		path: [...params.path, "items"]
	});
};
function inputOptin(schema) {
	const def = schema._zod.def;
	if (def.type === "pipe" && def.in._zod.traits.has("$ZodTransform")) return inputOptin(def.out);
	if (def.type === "catch") return inputOptin(def.innerType);
	return schema._zod.optin;
}
var objectProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	const shape = def.shape;
	if (Object.getOwnPropertySymbols(shape).length && handleUnrepresentable(schema, ctx, json, params, "Symbol keys cannot be represented in JSON Schema")) return;
	json.type = "object";
	json.properties = {};
	for (const key in shape) assignProp(json.properties, key, processSchema(shape[key], ctx, {
		...params,
		path: [
			...params.path,
			"properties",
			key
		]
	}));
	const requiredKeys = [];
	for (const key of Object.keys(shape)) {
		const field = def.shape[key];
		if (ctx.io === "input" ? inputOptin(field) === void 0 : field._zod.optout === void 0) requiredKeys.push(key);
	}
	if (requiredKeys.length > 0) json.required = requiredKeys;
	if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
	else if (!def.catchall) {
		if (ctx.io === "output") json.additionalProperties = false;
	} else if (def.catchall) json.additionalProperties = processSchema(def.catchall, ctx, {
		...params,
		path: [...params.path, "additionalProperties"]
	});
};
var unionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const isExclusive = def.inclusive === false;
	const options = def.options.map((x, i) => processSchema(x, ctx, {
		...params,
		path: [
			...params.path,
			isExclusive ? "oneOf" : "anyOf",
			i
		]
	}));
	if (isExclusive) json.oneOf = options;
	else json.anyOf = options;
};
var intersectionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const a = processSchema(def.left, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			0
		]
	});
	const b = processSchema(def.right, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			1
		]
	});
	const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
	const allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
	json.allOf = allOf;
	ctx.intersections.push(allOf);
};
var nullableProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const inner = processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	if (ctx.target === "openapi-3.0") {
		seen.ref = def.innerType;
		json.nullable = true;
	} else json.anyOf = [inner, { type: "null" }];
};
var nonoptionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
/** Round-trips a default value through JSON so the emitted schema is guaranteed to be valid JSON.
* A BigInt has no reliable encoding, so it goes through `unrepresentable` like any other
* unrepresentable value. Returns a sentinel when the caller must not write a default of its own. */
var UNREPRESENTABLE_DEFAULT = Symbol();
function serializeDefaultValue(value, schema, ctx, json, params) {
	let unrepresentable = false;
	const serialized = JSON.stringify(value, (_, val) => {
		if (typeof val !== "bigint") return val;
		unrepresentable = true;
		return null;
	});
	if (!unrepresentable) return JSON.parse(serialized);
	handleUnrepresentable(schema, ctx, json, params, "BigInt defaults cannot be represented in JSON Schema");
	return UNREPRESENTABLE_DEFAULT;
}
var defaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
	if (value !== UNREPRESENTABLE_DEFAULT) json.default = value;
};
var prefaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	if (ctx.io !== "input") return;
	const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
	if (value !== UNREPRESENTABLE_DEFAULT) json._prefault = value;
};
var catchProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	let catchValue;
	try {
		catchValue = def.catchValue(void 0);
	} catch {
		handleUnrepresentable(schema, ctx, json, params, "Dynamic catch values are not supported in JSON Schema");
		return;
	}
	json.default = catchValue;
};
var pipeProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	const inIsTransform = def.in._zod.traits.has("$ZodTransform");
	const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
	processSchema(innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = innerType;
};
var readonlyProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	json.readOnly = true;
};
var optionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
// src/components/RelatedArticles.astro
createAstro("https://blog.tracht-digital.de");
var $$RelatedArticles = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$RelatedArticles;
	const { posts, currentSlug, currentCategory, lang, limit = 3, class: className } = Astro.props;
	const byDate = (a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "");
	let picks = posts.filter((p) => p.slug !== currentSlug && p.category === currentCategory).sort(byDate).slice(0, limit);
	if (picks.length < limit) {
		const fallback = posts.filter((p) => p.slug !== currentSlug && !picks.some((q) => q.slug === p.slug)).sort(byDate).slice(0, limit - picks.length);
		picks = [...picks, ...fallback];
	}
	const labels = {
		de: { eyebrow: "Weiterlesen" },
		en: { eyebrow: "Keep reading" }
	}[lang];
	return renderTemplate`${picks.length > 0 && renderTemplate`${maybeRenderHead($$result)}<aside${addAttribute(["jnl-panel jnl-tone-tint", className], "class:list")} aria-labelledby="related-heading"><p class="section-num mb-3">${labels.eyebrow}</p><h2 id="related-heading" class="display-tight text-3xl mb-6">${lang === "de" ? "Ähnliche Artikel." : "Adjacent articles."}</h2><ul class="tds-grid-auto jnl-mosaic jnl-shelf list-none p-0 m-0">${picks.map((p) => renderTemplate`<li class="post-card-slot">${renderComponent($$result, "PostCard", PostCard, {
		"post": p,
		"lang": lang
	})}</li>`)}</ul></aside>`}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/RelatedArticles.astro", void 0);
// src/lib/productImages.ts
var productImageCatalog = {
	"website-check-mit-massnahmenliste": {
		"slug": "website-check-mit-massnahmenliste",
		"slugs": {
			"de": "website-check-mit-massnahmenliste",
			"en": "website-check-with-action-list"
		},
		"title": {
			"de": "Website-Check mit Maßnahmenliste",
			"en": "Website check with action list"
		},
		"alt": {
			"de": "Laptop mit gescannter Website und Ampelpunkten, daneben eine Maßnahmenliste.",
			"en": "A laptop with a scanned website and traffic-light dots beside an action list."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/website-check-mit-massnahmenliste.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-check-with-action-list": {
		"slug": "website-check-mit-massnahmenliste",
		"slugs": {
			"de": "website-check-mit-massnahmenliste",
			"en": "website-check-with-action-list"
		},
		"title": {
			"de": "Website-Check mit Maßnahmenliste",
			"en": "Website check with action list"
		},
		"alt": {
			"de": "Laptop mit gescannter Website und Ampelpunkten, daneben eine Maßnahmenliste.",
			"en": "A laptop with a scanned website and traffic-light dots beside an action list."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/website-check-mit-massnahmenliste.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"digital-check-fuer-ihren-betrieb": {
		"slug": "digital-check-fuer-ihren-betrieb",
		"slugs": {
			"de": "digital-check-fuer-ihren-betrieb",
			"en": "digital-check-for-your-business"
		},
		"title": {
			"de": "Digital-Check für Ihren Betrieb",
			"en": "Digital check for your business"
		},
		"alt": {
			"de": "Tablet mit Netzdiagramm und Checkliste auf einem Ladentisch.",
			"en": "A tablet with a radar chart and a checklist on a shop counter."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/digital-check-fuer-ihren-betrieb.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"digital-check-for-your-business": {
		"slug": "digital-check-fuer-ihren-betrieb",
		"slugs": {
			"de": "digital-check-fuer-ihren-betrieb",
			"en": "digital-check-for-your-business"
		},
		"title": {
			"de": "Digital-Check für Ihren Betrieb",
			"en": "Digital check for your business"
		},
		"alt": {
			"de": "Tablet mit Netzdiagramm und Checkliste auf einem Ladentisch.",
			"en": "A tablet with a radar chart and a checklist on a shop counter."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/digital-check-fuer-ihren-betrieb.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"google-unternehmensprofil-einrichten": {
		"slug": "google-unternehmensprofil-einrichten",
		"slugs": {
			"de": "google-unternehmensprofil-einrichten",
			"en": "google-business-profile-setup"
		},
		"title": {
			"de": "Google-Unternehmensprofil einrichten",
			"en": "Google Business Profile setup"
		},
		"alt": {
			"de": "Smartphone mit Karte, Standortnadel und Firmeneintrag vor einer Ladentür.",
			"en": "A smartphone with a map, a location pin and a business entry in front of a shop door."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/google-unternehmensprofil-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"google-business-profile-setup": {
		"slug": "google-unternehmensprofil-einrichten",
		"slugs": {
			"de": "google-unternehmensprofil-einrichten",
			"en": "google-business-profile-setup"
		},
		"title": {
			"de": "Google-Unternehmensprofil einrichten",
			"en": "Google Business Profile setup"
		},
		"alt": {
			"de": "Smartphone mit Karte, Standortnadel und Firmeneintrag vor einer Ladentür.",
			"en": "A smartphone with a map, a location pin and a business entry in front of a shop door."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/google-unternehmensprofil-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"ablauf-analyse-ein-arbeitsablauf": {
		"slug": "ablauf-analyse-ein-arbeitsablauf",
		"slugs": {
			"de": "ablauf-analyse-ein-arbeitsablauf",
			"en": "workflow-analysis-one-process"
		},
		"title": {
			"de": "Ablauf-Analyse für einen Arbeitsablauf",
			"en": "Workflow analysis for one process"
		},
		"alt": {
			"de": "Laptop mit Ablaufdiagramm, ein Schritt markiert, davor dieselben Schritte als Haftnotizen.",
			"en": "A laptop with a process diagram, one step marked, the same steps as sticky notes in front."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/ablauf-analyse-ein-arbeitsablauf.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"workflow-analysis-one-process": {
		"slug": "ablauf-analyse-ein-arbeitsablauf",
		"slugs": {
			"de": "ablauf-analyse-ein-arbeitsablauf",
			"en": "workflow-analysis-one-process"
		},
		"title": {
			"de": "Ablauf-Analyse für einen Arbeitsablauf",
			"en": "Workflow analysis for one process"
		},
		"alt": {
			"de": "Laptop mit Ablaufdiagramm, ein Schritt markiert, davor dieselben Schritte als Haftnotizen.",
			"en": "A laptop with a process diagram, one step marked, the same steps as sticky notes in front."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/ablauf-analyse-ein-arbeitsablauf.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"machbarkeitspruefung-schnittstelle": {
		"slug": "machbarkeitspruefung-schnittstelle",
		"slugs": {
			"de": "machbarkeitspruefung-schnittstelle",
			"en": "integration-feasibility-check"
		},
		"title": {
			"de": "Machbarkeitsprüfung für eine Schnittstelle",
			"en": "Feasibility check for an integration"
		},
		"alt": {
			"de": "Laptop mit zwei verbundenen App-Symbolen und Häkchen, davor zwei Stecker mit Adapter.",
			"en": "A laptop with two connected app icons and a tick, two plugs with an adapter in front."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/machbarkeitspruefung-schnittstelle.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"integration-feasibility-check": {
		"slug": "machbarkeitspruefung-schnittstelle",
		"slugs": {
			"de": "machbarkeitspruefung-schnittstelle",
			"en": "integration-feasibility-check"
		},
		"title": {
			"de": "Machbarkeitsprüfung für eine Schnittstelle",
			"en": "Feasibility check for an integration"
		},
		"alt": {
			"de": "Laptop mit zwei verbundenen App-Symbolen und Häkchen, davor zwei Stecker mit Adapter.",
			"en": "A laptop with two connected app icons and a tick, two plugs with an adapter in front."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/machbarkeitspruefung-schnittstelle.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"onepager-website": {
		"slug": "onepager-website",
		"slugs": {
			"de": "onepager-website",
			"en": "one-page-website"
		},
		"title": {
			"de": "Onepager-Website",
			"en": "One-page website"
		},
		"alt": {
			"de": "Smartphone mit einer langen Website, daneben dieselbe Seite als Papierstreifen in fünf Abschnitten.",
			"en": "A smartphone with a long website, the same page beside it as a paper strip in five sections."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/onepager-website.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"one-page-website": {
		"slug": "onepager-website",
		"slugs": {
			"de": "onepager-website",
			"en": "one-page-website"
		},
		"title": {
			"de": "Onepager-Website",
			"en": "One-page website"
		},
		"alt": {
			"de": "Smartphone mit einer langen Website, daneben dieselbe Seite als Papierstreifen in fünf Abschnitten.",
			"en": "A smartphone with a long website, the same page beside it as a paper strip in five sections."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/onepager-website.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"firmenwebsite-bis-5-seiten": {
		"slug": "firmenwebsite-bis-5-seiten",
		"slugs": {
			"de": "firmenwebsite-bis-5-seiten",
			"en": "business-website-up-to-5-pages"
		},
		"title": {
			"de": "Firmenwebsite bis 5 Seiten",
			"en": "Business website up to 5 pages"
		},
		"alt": {
			"de": "Laptop und Smartphone zeigen dieselbe Firmenwebsite mit mehreren Unterseiten.",
			"en": "A laptop and a smartphone showing the same multi-page business website."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/firmenwebsite-bis-5-seiten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"business-website-up-to-5-pages": {
		"slug": "firmenwebsite-bis-5-seiten",
		"slugs": {
			"de": "firmenwebsite-bis-5-seiten",
			"en": "business-website-up-to-5-pages"
		},
		"title": {
			"de": "Firmenwebsite bis 5 Seiten",
			"en": "Business website up to 5 pages"
		},
		"alt": {
			"de": "Laptop und Smartphone zeigen dieselbe Firmenwebsite mit mehreren Unterseiten.",
			"en": "A laptop and a smartphone showing the same multi-page business website."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/firmenwebsite-bis-5-seiten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"landingpage-fuer-ein-angebot": {
		"slug": "landingpage-fuer-ein-angebot",
		"slugs": {
			"de": "landingpage-fuer-ein-angebot",
			"en": "landing-page-for-one-offer"
		},
		"title": {
			"de": "Landingpage für ein Angebot",
			"en": "Landing page for one offer"
		},
		"alt": {
			"de": "Laptop mit einer Landingpage und einem großen Knopf.",
			"en": "A laptop showing a landing page with one large button."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/landingpage-fuer-ein-angebot.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"landing-page-for-one-offer": {
		"slug": "landingpage-fuer-ein-angebot",
		"slugs": {
			"de": "landingpage-fuer-ein-angebot",
			"en": "landing-page-for-one-offer"
		},
		"title": {
			"de": "Landingpage für ein Angebot",
			"en": "Landing page for one offer"
		},
		"alt": {
			"de": "Laptop mit einer Landingpage und einem großen Knopf.",
			"en": "A laptop showing a landing page with one large button."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/landingpage-fuer-ein-angebot.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"zweite-sprache-fuer-ihre-website": {
		"slug": "zweite-sprache-fuer-ihre-website",
		"slugs": {
			"de": "zweite-sprache-fuer-ihre-website",
			"en": "second-language-for-your-website"
		},
		"title": {
			"de": "Zweite Sprache für Ihre Website",
			"en": "Second language for your website"
		},
		"alt": {
			"de": "Website mit geöffnetem Sprachwähler auf Laptop und Smartphone.",
			"en": "A website with an open language switcher on a laptop and a smartphone."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/zweite-sprache-fuer-ihre-website.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"second-language-for-your-website": {
		"slug": "zweite-sprache-fuer-ihre-website",
		"slugs": {
			"de": "zweite-sprache-fuer-ihre-website",
			"en": "second-language-for-your-website"
		},
		"title": {
			"de": "Zweite Sprache für Ihre Website",
			"en": "Second language for your website"
		},
		"alt": {
			"de": "Website mit geöffnetem Sprachwähler auf Laptop und Smartphone.",
			"en": "A website with an open language switcher on a laptop and a smartphone."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/zweite-sprache-fuer-ihre-website.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"relaunch-konzept": {
		"slug": "relaunch-konzept",
		"slugs": {
			"de": "relaunch-konzept",
			"en": "website-relaunch-plan"
		},
		"title": {
			"de": "Relaunch-Konzept für Ihre Website",
			"en": "Relaunch plan for your website"
		},
		"alt": {
			"de": "Alte und neue Website nebeneinander, dazwischen ein Seitenplan.",
			"en": "An old and a new website side by side with a sitemap between them."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/relaunch-konzept.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-relaunch-plan": {
		"slug": "relaunch-konzept",
		"slugs": {
			"de": "relaunch-konzept",
			"en": "website-relaunch-plan"
		},
		"title": {
			"de": "Relaunch-Konzept für Ihre Website",
			"en": "Relaunch plan for your website"
		},
		"alt": {
			"de": "Alte und neue Website nebeneinander, dazwischen ein Seitenplan.",
			"en": "An old and a new website side by side with a sitemap between them."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/relaunch-konzept.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"kontaktformular-mit-spamschutz": {
		"slug": "kontaktformular-mit-spamschutz",
		"slugs": {
			"de": "kontaktformular-mit-spamschutz",
			"en": "contact-form-with-spam-protection"
		},
		"title": {
			"de": "Kontaktformular mit Spamschutz",
			"en": "Contact form with spam protection"
		},
		"alt": {
			"de": "Laptop mit Kontaktformular und Schutzschild, daneben Spam im Papierkorb.",
			"en": "A laptop with a contact form and a shield, spam in the wastebasket beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/kontaktformular-mit-spamschutz.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"contact-form-with-spam-protection": {
		"slug": "kontaktformular-mit-spamschutz",
		"slugs": {
			"de": "kontaktformular-mit-spamschutz",
			"en": "contact-form-with-spam-protection"
		},
		"title": {
			"de": "Kontaktformular mit Spamschutz",
			"en": "Contact form with spam protection"
		},
		"alt": {
			"de": "Laptop mit Kontaktformular und Schutzschild, daneben Spam im Papierkorb.",
			"en": "A laptop with a contact form and a shield, spam in the wastebasket beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/kontaktformular-mit-spamschutz.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"online-terminbuchung-einbinden": {
		"slug": "online-terminbuchung-einbinden",
		"slugs": {
			"de": "online-terminbuchung-einbinden",
			"en": "online-booking-on-your-website"
		},
		"title": {
			"de": "Online-Terminbuchung einbinden",
			"en": "Online booking on your website"
		},
		"alt": {
			"de": "Smartphone mit Buchungskalender und ausgewählter Uhrzeit.",
			"en": "A smartphone with a booking calendar and a selected time slot."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/online-terminbuchung-einbinden.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"online-booking-on-your-website": {
		"slug": "online-terminbuchung-einbinden",
		"slugs": {
			"de": "online-terminbuchung-einbinden",
			"en": "online-booking-on-your-website"
		},
		"title": {
			"de": "Online-Terminbuchung einbinden",
			"en": "Online booking on your website"
		},
		"alt": {
			"de": "Smartphone mit Buchungskalender und ausgewählter Uhrzeit.",
			"en": "A smartphone with a booking calendar and a selected time slot."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/online-terminbuchung-einbinden.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"keyword-plan-fuer-ihre-leistungen": {
		"slug": "keyword-plan-fuer-ihre-leistungen",
		"slugs": {
			"de": "keyword-plan-fuer-ihre-leistungen",
			"en": "keyword-plan-for-your-services"
		},
		"title": {
			"de": "Keyword-Plan für Ihre Leistungen",
			"en": "Keyword plan for your services"
		},
		"alt": {
			"de": "Suchleiste mit Vorschlägen auf dem Laptop, daneben sortierte Karteikarten.",
			"en": "A search bar with suggestions on a laptop, sorted index cards beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/keyword-plan-fuer-ihre-leistungen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"keyword-plan-for-your-services": {
		"slug": "keyword-plan-fuer-ihre-leistungen",
		"slugs": {
			"de": "keyword-plan-fuer-ihre-leistungen",
			"en": "keyword-plan-for-your-services"
		},
		"title": {
			"de": "Keyword-Plan für Ihre Leistungen",
			"en": "Keyword plan for your services"
		},
		"alt": {
			"de": "Suchleiste mit Vorschlägen auf dem Laptop, daneben sortierte Karteikarten.",
			"en": "A search bar with suggestions on a laptop, sorted index cards beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/keyword-plan-fuer-ihre-leistungen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"ki-sichtbarkeit-geo-verbessern": {
		"slug": "ki-sichtbarkeit-geo-verbessern",
		"slugs": {
			"de": "ki-sichtbarkeit-geo-verbessern",
			"en": "improve-ai-visibility-geo"
		},
		"title": {
			"de": "KI-Sichtbarkeit (GEO) verbessern",
			"en": "Improve AI visibility (GEO)"
		},
		"alt": {
			"de": "Smartphone mit einer KI-Antwort, die eine Website als Quelle nennt.",
			"en": "A smartphone showing an AI answer that cites a website as its source."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/ki-sichtbarkeit-geo-verbessern.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"improve-ai-visibility-geo": {
		"slug": "ki-sichtbarkeit-geo-verbessern",
		"slugs": {
			"de": "ki-sichtbarkeit-geo-verbessern",
			"en": "improve-ai-visibility-geo"
		},
		"title": {
			"de": "KI-Sichtbarkeit (GEO) verbessern",
			"en": "Improve AI visibility (GEO)"
		},
		"alt": {
			"de": "Smartphone mit einer KI-Antwort, die eine Website als Quelle nennt.",
			"en": "A smartphone showing an AI answer that cites a website as its source."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/ki-sichtbarkeit-geo-verbessern.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"technische-seo-grundlagen": {
		"slug": "technische-seo-grundlagen",
		"slugs": {
			"de": "technische-seo-grundlagen",
			"en": "technical-seo-basics"
		},
		"title": {
			"de": "Technische SEO-Grundlagen umsetzen",
			"en": "Technical SEO basics"
		},
		"alt": {
			"de": "Laptop mit Prüfliste, Tachoanzeige und Seitenbaum, daneben eine Wasserwaage.",
			"en": "A laptop with a checklist, a gauge and a site tree, a spirit level beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/technische-seo-grundlagen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"technical-seo-basics": {
		"slug": "technische-seo-grundlagen",
		"slugs": {
			"de": "technische-seo-grundlagen",
			"en": "technical-seo-basics"
		},
		"title": {
			"de": "Technische SEO-Grundlagen umsetzen",
			"en": "Technical SEO basics"
		},
		"alt": {
			"de": "Laptop mit Prüfliste, Tachoanzeige und Seitenbaum, daneben eine Wasserwaage.",
			"en": "A laptop with a checklist, a gauge and a site tree, a spirit level beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/technische-seo-grundlagen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"strukturierte-daten-einbauen": {
		"slug": "strukturierte-daten-einbauen",
		"slugs": {
			"de": "strukturierte-daten-einbauen",
			"en": "add-structured-data"
		},
		"title": {
			"de": "Strukturierte Daten (Schema.org) einbauen",
			"en": "Add structured data (Schema.org)"
		},
		"alt": {
			"de": "Suchergebnis mit Sternen und Fragen neben einem Codefeld.",
			"en": "A search result with stars and questions beside a code panel."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/strukturierte-daten-einbauen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"add-structured-data": {
		"slug": "strukturierte-daten-einbauen",
		"slugs": {
			"de": "strukturierte-daten-einbauen",
			"en": "add-structured-data"
		},
		"title": {
			"de": "Strukturierte Daten (Schema.org) einbauen",
			"en": "Add structured data (Schema.org)"
		},
		"alt": {
			"de": "Suchergebnis mit Sternen und Fragen neben einem Codefeld.",
			"en": "A search result with stars and questions beside a code panel."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/strukturierte-daten-einbauen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"ladezeit-optimieren": {
		"slug": "ladezeit-optimieren",
		"slugs": {
			"de": "ladezeit-optimieren",
			"en": "website-speed-optimisation"
		},
		"title": {
			"de": "Ladezeit optimieren",
			"en": "Website speed optimisation"
		},
		"alt": {
			"de": "Smartphone mit Website und Tachoanzeige im schnellen Bereich, daneben eine Stoppuhr.",
			"en": "A smartphone with a website and a gauge in the fast zone, a stopwatch beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/ladezeit-optimieren.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-speed-optimisation": {
		"slug": "ladezeit-optimieren",
		"slugs": {
			"de": "ladezeit-optimieren",
			"en": "website-speed-optimisation"
		},
		"title": {
			"de": "Ladezeit optimieren",
			"en": "Website speed optimisation"
		},
		"alt": {
			"de": "Smartphone mit Website und Tachoanzeige im schnellen Bereich, daneben eine Stoppuhr.",
			"en": "A smartphone with a website and a gauge in the fast zone, a stopwatch beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/ladezeit-optimieren.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"google-search-console-einrichten": {
		"slug": "google-search-console-einrichten",
		"slugs": {
			"de": "google-search-console-einrichten",
			"en": "google-search-console-setup"
		},
		"title": {
			"de": "Google Search Console einrichten",
			"en": "Google Search Console setup"
		},
		"alt": {
			"de": "Laptop mit steigender Kurve, Kennzahlkacheln und Suchbegriffen.",
			"en": "A laptop with a rising line, summary tiles and search terms."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/google-search-console-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"google-search-console-setup": {
		"slug": "google-search-console-einrichten",
		"slugs": {
			"de": "google-search-console-einrichten",
			"en": "google-search-console-setup"
		},
		"title": {
			"de": "Google Search Console einrichten",
			"en": "Google Search Console setup"
		},
		"alt": {
			"de": "Laptop mit steigender Kurve, Kennzahlkacheln und Suchbegriffen.",
			"en": "A laptop with a rising line, summary tiles and search terms."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/google-search-console-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-wartung-12-monate": {
		"slug": "website-wartung-12-monate",
		"slugs": {
			"de": "website-wartung-12-monate",
			"en": "website-maintenance-12-months"
		},
		"title": {
			"de": "Website-Wartung für 12 Monate",
			"en": "Website maintenance for 12 months"
		},
		"alt": {
			"de": "Laptop mit abgehakter Update-Liste und Schutzschild neben einer Werkzeugrolle.",
			"en": "A laptop with a ticked update list and a shield beside a tool roll."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/website-wartung-12-monate.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-maintenance-12-months": {
		"slug": "website-wartung-12-monate",
		"slugs": {
			"de": "website-wartung-12-monate",
			"en": "website-maintenance-12-months"
		},
		"title": {
			"de": "Website-Wartung für 12 Monate",
			"en": "Website maintenance for 12 months"
		},
		"alt": {
			"de": "Laptop mit abgehakter Update-Liste und Schutzschild neben einer Werkzeugrolle.",
			"en": "A laptop with a ticked update list and a shield beside a tool roll."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/website-wartung-12-monate.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"externe-dienste-pruefen": {
		"slug": "externe-dienste-pruefen",
		"slugs": {
			"de": "externe-dienste-pruefen",
			"en": "external-services-check"
		},
		"title": {
			"de": "Externe Dienste prüfen",
			"en": "External services check"
		},
		"alt": {
			"de": "Website in der Mitte, verbunden mit Symbolen externer Dienste, daneben eine Lupe.",
			"en": "A website in the centre connected to icons of external services, a magnifier beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/externe-dienste-pruefen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"external-services-check": {
		"slug": "externe-dienste-pruefen",
		"slugs": {
			"de": "externe-dienste-pruefen",
			"en": "external-services-check"
		},
		"title": {
			"de": "Externe Dienste prüfen",
			"en": "External services check"
		},
		"alt": {
			"de": "Website in der Mitte, verbunden mit Symbolen externer Dienste, daneben eine Lupe.",
			"en": "A website in the centre connected to icons of external services, a magnifier beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/externe-dienste-pruefen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-wartung-3-monate": {
		"slug": "website-wartung-3-monate",
		"slugs": {
			"de": "website-wartung-3-monate",
			"en": "website-maintenance-3-months"
		},
		"title": {
			"de": "Website-Wartung für 3 Monate",
			"en": "Website maintenance for 3 months"
		},
		"alt": {
			"de": "Laptop mit drei abgehakten Monaten, daneben eine kleine Werkzeugtasche.",
			"en": "A laptop with three ticked months beside a small tool pouch."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/website-wartung-3-monate.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-maintenance-3-months": {
		"slug": "website-wartung-3-monate",
		"slugs": {
			"de": "website-wartung-3-monate",
			"en": "website-maintenance-3-months"
		},
		"title": {
			"de": "Website-Wartung für 3 Monate",
			"en": "Website maintenance for 3 months"
		},
		"alt": {
			"de": "Laptop mit drei abgehakten Monaten, daneben eine kleine Werkzeugtasche.",
			"en": "A laptop with three ticked months beside a small tool pouch."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/website-wartung-3-monate.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"sicherheits-update-wordpress": {
		"slug": "sicherheits-update-wordpress",
		"slugs": {
			"de": "sicherheits-update-wordpress",
			"en": "wordpress-security-update"
		},
		"title": {
			"de": "Sicherheits-Update für WordPress",
			"en": "WordPress security update"
		},
		"alt": {
			"de": "Laptop mit vollem Fortschrittsbalken und Schild, daneben ein neues Schloss.",
			"en": "A laptop with a full progress bar and a shield beside a new padlock."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/sicherheits-update-wordpress.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"wordpress-security-update": {
		"slug": "sicherheits-update-wordpress",
		"slugs": {
			"de": "sicherheits-update-wordpress",
			"en": "wordpress-security-update"
		},
		"title": {
			"de": "Sicherheits-Update für WordPress",
			"en": "WordPress security update"
		},
		"alt": {
			"de": "Laptop mit vollem Fortschrittsbalken und Schild, daneben ein neues Schloss.",
			"en": "A laptop with a full progress bar and a shield beside a new padlock."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/sicherheits-update-wordpress.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"backup-einrichten-und-testen": {
		"slug": "backup-einrichten-und-testen",
		"slugs": {
			"de": "backup-einrichten-und-testen",
			"en": "website-backup-setup-and-test"
		},
		"title": {
			"de": "Website-Backup einrichten und testen",
			"en": "Website backup setup and test"
		},
		"alt": {
			"de": "Laptop mit Sicherungsliste und Wiederherstellen-Knopf, daneben eine angeschlossene Festplatte.",
			"en": "A laptop with a backup list and a restore button beside a connected drive."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/backup-einrichten-und-testen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-backup-setup-and-test": {
		"slug": "backup-einrichten-und-testen",
		"slugs": {
			"de": "backup-einrichten-und-testen",
			"en": "website-backup-setup-and-test"
		},
		"title": {
			"de": "Website-Backup einrichten und testen",
			"en": "Website backup setup and test"
		},
		"alt": {
			"de": "Laptop mit Sicherungsliste und Wiederherstellen-Knopf, daneben eine angeschlossene Festplatte.",
			"en": "A laptop with a backup list and a restore button beside a connected drive."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/backup-einrichten-und-testen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-umzug-zu-neuem-hoster": {
		"slug": "website-umzug-zu-neuem-hoster",
		"slugs": {
			"de": "website-umzug-zu-neuem-hoster",
			"en": "website-move-to-new-host"
		},
		"title": {
			"de": "Website-Umzug zu neuem Hoster",
			"en": "Website move to a new host"
		},
		"alt": {
			"de": "Laptop mit Website zwischen zwei Servern, daneben ein Umzugskarton.",
			"en": "A laptop showing a website between two servers beside a moving box."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/website-umzug-zu-neuem-hoster.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-move-to-new-host": {
		"slug": "website-umzug-zu-neuem-hoster",
		"slugs": {
			"de": "website-umzug-zu-neuem-hoster",
			"en": "website-move-to-new-host"
		},
		"title": {
			"de": "Website-Umzug zu neuem Hoster",
			"en": "Website move to a new host"
		},
		"alt": {
			"de": "Laptop mit Website zwischen zwei Servern, daneben ein Umzugskarton.",
			"en": "A laptop showing a website between two servers beside a moving box."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/website-umzug-zu-neuem-hoster.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"gehackte-website-bereinigen": {
		"slug": "gehackte-website-bereinigen",
		"slugs": {
			"de": "gehackte-website-bereinigen",
			"en": "hacked-website-clean-up"
		},
		"title": {
			"de": "Gehackte Website bereinigen",
			"en": "Hacked website clean-up"
		},
		"alt": {
			"de": "Laptop mit durchgestrichener Warnung und Schild, daneben ein Reinigungspinsel.",
			"en": "A laptop with a crossed-out warning and a shield beside a cleaning brush."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/gehackte-website-bereinigen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"hacked-website-clean-up": {
		"slug": "gehackte-website-bereinigen",
		"slugs": {
			"de": "gehackte-website-bereinigen",
			"en": "hacked-website-clean-up"
		},
		"title": {
			"de": "Gehackte Website bereinigen",
			"en": "Hacked website clean-up"
		},
		"alt": {
			"de": "Laptop mit durchgestrichener Warnung und Schild, daneben ein Reinigungspinsel.",
			"en": "A laptop with a crossed-out warning and a shield beside a cleaning brush."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/gehackte-website-bereinigen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"https-umstellung": {
		"slug": "https-umstellung",
		"slugs": {
			"de": "https-umstellung",
			"en": "https-switch-with-ssl"
		},
		"title": {
			"de": "HTTPS-Umstellung mit SSL-Zertifikat",
			"en": "HTTPS switch with SSL certificate"
		},
		"alt": {
			"de": "Vergrößerte Adresszeile mit geschlossenem Schloss, daneben ein Vorhängeschloss.",
			"en": "An enlarged address bar with a closed padlock beside a real padlock."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/https-umstellung.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"https-switch-with-ssl": {
		"slug": "https-umstellung",
		"slugs": {
			"de": "https-umstellung",
			"en": "https-switch-with-ssl"
		},
		"title": {
			"de": "HTTPS-Umstellung mit SSL-Zertifikat",
			"en": "HTTPS switch with SSL certificate"
		},
		"alt": {
			"de": "Vergrößerte Adresszeile mit geschlossenem Schloss, daneben ein Vorhängeschloss.",
			"en": "An enlarged address bar with a closed padlock beside a real padlock."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/https-umstellung.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"impressum-und-datenschutz-einbinden": {
		"slug": "impressum-und-datenschutz-einbinden",
		"slugs": {
			"de": "impressum-und-datenschutz-einbinden",
			"en": "legal-notice-and-privacy-policy-setup"
		},
		"title": {
			"de": "Impressum und Datenschutzerklärung einbinden",
			"en": "Legal notice and privacy policy setup"
		},
		"alt": {
			"de": "Website-Fußzeile mit Links und Paragrafenzeichen, daneben eine Rechtsmappe.",
			"en": "A website footer with links and a section sign beside a legal folder."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/impressum-und-datenschutz-einbinden.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"legal-notice-and-privacy-policy-setup": {
		"slug": "impressum-und-datenschutz-einbinden",
		"slugs": {
			"de": "impressum-und-datenschutz-einbinden",
			"en": "legal-notice-and-privacy-policy-setup"
		},
		"title": {
			"de": "Impressum und Datenschutzerklärung einbinden",
			"en": "Legal notice and privacy policy setup"
		},
		"alt": {
			"de": "Website-Fußzeile mit Links und Paragrafenzeichen, daneben eine Rechtsmappe.",
			"en": "A website footer with links and a section sign beside a legal folder."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/impressum-und-datenschutz-einbinden.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"cookie-banner-einrichten": {
		"slug": "cookie-banner-einrichten",
		"slugs": {
			"de": "cookie-banner-einrichten",
			"en": "cookie-consent-banner-setup"
		},
		"title": {
			"de": "Cookie-Banner einrichten",
			"en": "Cookie consent banner setup"
		},
		"alt": {
			"de": "Laptop mit Cookie-Banner am unteren Rand, daneben ein Keks.",
			"en": "A laptop with a cookie banner at the bottom, a biscuit beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/cookie-banner-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"cookie-consent-banner-setup": {
		"slug": "cookie-banner-einrichten",
		"slugs": {
			"de": "cookie-banner-einrichten",
			"en": "cookie-consent-banner-setup"
		},
		"title": {
			"de": "Cookie-Banner einrichten",
			"en": "Cookie consent banner setup"
		},
		"alt": {
			"de": "Laptop mit Cookie-Banner am unteren Rand, daneben ein Keks.",
			"en": "A laptop with a cookie banner at the bottom, a biscuit beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/cookie-banner-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"barrierefreiheits-check-bfsg": {
		"slug": "barrierefreiheits-check-bfsg",
		"slugs": {
			"de": "barrierefreiheits-check-bfsg",
			"en": "accessibility-check"
		},
		"title": {
			"de": "Barrierefreiheits-Check (BFSG)",
			"en": "Accessibility check"
		},
		"alt": {
			"de": "Laptop mit Barrierefreiheitssymbol und Prüfliste, daneben eine Lupe.",
			"en": "A laptop with the accessibility symbol and a findings list, a magnifier beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/barrierefreiheits-check-bfsg.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"accessibility-check": {
		"slug": "barrierefreiheits-check-bfsg",
		"slugs": {
			"de": "barrierefreiheits-check-bfsg",
			"en": "accessibility-check"
		},
		"title": {
			"de": "Barrierefreiheits-Check (BFSG)",
			"en": "Accessibility check"
		},
		"alt": {
			"de": "Laptop mit Barrierefreiheitssymbol und Prüfliste, daneben eine Lupe.",
			"en": "A laptop with the accessibility symbol and a findings list, a magnifier beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/barrierefreiheits-check-bfsg.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"barrierefreiheit-verbessern": {
		"slug": "barrierefreiheit-verbessern",
		"slugs": {
			"de": "barrierefreiheit-verbessern",
			"en": "improve-accessibility"
		},
		"title": {
			"de": "Barrierefreiheit verbessern",
			"en": "Improve accessibility"
		},
		"alt": {
			"de": "Website mit großen Knöpfen und Fokusrahmen, eine Hand an der Tastatur.",
			"en": "A website with large buttons and a focus ring, a hand on the keyboard."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/barrierefreiheit-verbessern.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"improve-accessibility": {
		"slug": "barrierefreiheit-verbessern",
		"slugs": {
			"de": "barrierefreiheit-verbessern",
			"en": "improve-accessibility"
		},
		"title": {
			"de": "Barrierefreiheit verbessern",
			"en": "Improve accessibility"
		},
		"alt": {
			"de": "Website mit großen Knöpfen und Fokusrahmen, eine Hand an der Tastatur.",
			"en": "A website with large buttons and a focus ring, a hand on the keyboard."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/barrierefreiheit-verbessern.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"google-fonts-lokal-einbinden": {
		"slug": "google-fonts-lokal-einbinden",
		"slugs": {
			"de": "google-fonts-lokal-einbinden",
			"en": "host-google-fonts-locally"
		},
		"title": {
			"de": "Google Fonts lokal einbinden",
			"en": "Host Google Fonts locally"
		},
		"alt": {
			"de": "Schriftdatei wandert von der Cloud auf den eigenen Server, daneben ein Setzkasten.",
			"en": "A font file moving from the cloud to one's own server, a type case beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/google-fonts-lokal-einbinden.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"host-google-fonts-locally": {
		"slug": "google-fonts-lokal-einbinden",
		"slugs": {
			"de": "google-fonts-lokal-einbinden",
			"en": "host-google-fonts-locally"
		},
		"title": {
			"de": "Google Fonts lokal einbinden",
			"en": "Host Google Fonts locally"
		},
		"alt": {
			"de": "Schriftdatei wandert von der Cloud auf den eigenen Server, daneben ein Setzkasten.",
			"en": "A font file moving from the cloud to one's own server, a type case beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/google-fonts-lokal-einbinden.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"erklaerung-zur-barrierefreiheit": {
		"slug": "erklaerung-zur-barrierefreiheit",
		"slugs": {
			"de": "erklaerung-zur-barrierefreiheit",
			"en": "accessibility-statement-setup"
		},
		"title": {
			"de": "Erklärung zur Barrierefreiheit einbinden",
			"en": "Accessibility statement setup"
		},
		"alt": {
			"de": "Website-Seite mit Barrierefreiheitssymbol, Textblöcken und Rückmeldeformular.",
			"en": "A web page with the accessibility symbol, text blocks and a feedback form."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/erklaerung-zur-barrierefreiheit.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"accessibility-statement-setup": {
		"slug": "erklaerung-zur-barrierefreiheit",
		"slugs": {
			"de": "erklaerung-zur-barrierefreiheit",
			"en": "accessibility-statement-setup"
		},
		"title": {
			"de": "Erklärung zur Barrierefreiheit einbinden",
			"en": "Accessibility statement setup"
		},
		"alt": {
			"de": "Website-Seite mit Barrierefreiheitssymbol, Textblöcken und Rückmeldeformular.",
			"en": "A web page with the accessibility symbol, text blocks and a feedback form."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/erklaerung-zur-barrierefreiheit.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"domain-und-e-mail-einrichten": {
		"slug": "domain-und-e-mail-einrichten",
		"slugs": {
			"de": "domain-und-e-mail-einrichten",
			"en": "domain-and-email-setup"
		},
		"title": {
			"de": "Domain und E-Mail einrichten",
			"en": "Domain and email setup"
		},
		"alt": {
			"de": "Adresszeile mit Schloss auf dem Laptop, Posteingang auf dem Smartphone, Visitenkarte mit @.",
			"en": "An address bar with a padlock on a laptop, an inbox on a smartphone and a business card with an @."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/domain-und-e-mail-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"domain-and-email-setup": {
		"slug": "domain-und-e-mail-einrichten",
		"slugs": {
			"de": "domain-und-e-mail-einrichten",
			"en": "domain-and-email-setup"
		},
		"title": {
			"de": "Domain und E-Mail einrichten",
			"en": "Domain and email setup"
		},
		"alt": {
			"de": "Adresszeile mit Schloss auf dem Laptop, Posteingang auf dem Smartphone, Visitenkarte mit @.",
			"en": "An address bar with a padlock on a laptop, an inbox on a smartphone and a business card with an @."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/domain-und-e-mail-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"spf-dkim-dmarc-einrichten": {
		"slug": "spf-dkim-dmarc-einrichten",
		"slugs": {
			"de": "spf-dkim-dmarc-einrichten",
			"en": "spf-dkim-dmarc-setup"
		},
		"title": {
			"de": "SPF, DKIM und DMARC einrichten",
			"en": "SPF, DKIM and DMARC setup"
		},
		"alt": {
			"de": "Posteingang mit geprüfter Mail und abgefangenem Spam, daneben ein versiegelter Umschlag.",
			"en": "An inbox with a verified email and caught spam, a sealed envelope beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/spf-dkim-dmarc-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"spf-dkim-dmarc-setup": {
		"slug": "spf-dkim-dmarc-einrichten",
		"slugs": {
			"de": "spf-dkim-dmarc-einrichten",
			"en": "spf-dkim-dmarc-setup"
		},
		"title": {
			"de": "SPF, DKIM und DMARC einrichten",
			"en": "SPF, DKIM and DMARC setup"
		},
		"alt": {
			"de": "Posteingang mit geprüfter Mail und abgefangenem Spam, daneben ein versiegelter Umschlag.",
			"en": "An inbox with a verified email and caught spam, a sealed envelope beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/spf-dkim-dmarc-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"e-mail-umzug": {
		"slug": "e-mail-umzug",
		"slugs": {
			"de": "e-mail-umzug",
			"en": "email-migration"
		},
		"title": {
			"de": "E-Mail-Umzug zu neuem Anbieter",
			"en": "Email migration to a new provider"
		},
		"alt": {
			"de": "Zwei Laptops, zwischen denen Briefsymbole umziehen.",
			"en": "Two laptops with envelope icons moving between them."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/e-mail-umzug.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"email-migration": {
		"slug": "e-mail-umzug",
		"slugs": {
			"de": "e-mail-umzug",
			"en": "email-migration"
		},
		"title": {
			"de": "E-Mail-Umzug zu neuem Anbieter",
			"en": "Email migration to a new provider"
		},
		"alt": {
			"de": "Zwei Laptops, zwischen denen Briefsymbole umziehen.",
			"en": "Two laptops with envelope icons moving between them."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/e-mail-umzug.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"einheitliche-e-mail-signaturen": {
		"slug": "einheitliche-e-mail-signaturen",
		"slugs": {
			"de": "einheitliche-e-mail-signaturen",
			"en": "consistent-email-signatures"
		},
		"title": {
			"de": "Einheitliche E-Mail-Signaturen",
			"en": "Consistent email signatures"
		},
		"alt": {
			"de": "Drei Geräte zeigen dieselbe E-Mail-Signatur.",
			"en": "Three devices showing the same email signature."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/einheitliche-e-mail-signaturen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"consistent-email-signatures": {
		"slug": "einheitliche-e-mail-signaturen",
		"slugs": {
			"de": "einheitliche-e-mail-signaturen",
			"en": "consistent-email-signatures"
		},
		"title": {
			"de": "Einheitliche E-Mail-Signaturen",
			"en": "Consistent email signatures"
		},
		"alt": {
			"de": "Drei Geräte zeigen dieselbe E-Mail-Signatur.",
			"en": "Three devices showing the same email signature."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/einheitliche-e-mail-signaturen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"domain-umzug": {
		"slug": "domain-umzug",
		"slugs": {
			"de": "domain-umzug",
			"en": "domain-transfer"
		},
		"title": {
			"de": "Domain-Umzug zu neuem Anbieter",
			"en": "Domain transfer to a new provider"
		},
		"alt": {
			"de": "Laptop mit Umzugspfeil zwischen zwei Servern, daneben ein Schlüssel am Anhänger.",
			"en": "A laptop with a transfer arrow between two servers, a key on a tag beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/domain-umzug.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"domain-transfer": {
		"slug": "domain-umzug",
		"slugs": {
			"de": "domain-umzug",
			"en": "domain-transfer"
		},
		"title": {
			"de": "Domain-Umzug zu neuem Anbieter",
			"en": "Domain transfer to a new provider"
		},
		"alt": {
			"de": "Laptop mit Umzugspfeil zwischen zwei Servern, daneben ein Schlüssel am Anhänger.",
			"en": "A laptop with a transfer arrow between two servers, a key on a tag beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/domain-umzug.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"rechnungen-digital-schreiben": {
		"slug": "rechnungen-digital-schreiben",
		"slugs": {
			"de": "rechnungen-digital-schreiben",
			"en": "digital-invoicing-setup"
		},
		"title": {
			"de": "Rechnungen digital schreiben",
			"en": "Digital invoicing setup"
		},
		"alt": {
			"de": "Laptop mit Rechnungsvorlage, daneben ein abgelöster Rechnungsblock.",
			"en": "A laptop with an invoice template beside a retired invoice pad."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/rechnungen-digital-schreiben.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"digital-invoicing-setup": {
		"slug": "rechnungen-digital-schreiben",
		"slugs": {
			"de": "rechnungen-digital-schreiben",
			"en": "digital-invoicing-setup"
		},
		"title": {
			"de": "Rechnungen digital schreiben",
			"en": "Digital invoicing setup"
		},
		"alt": {
			"de": "Laptop mit Rechnungsvorlage, daneben ein abgelöster Rechnungsblock.",
			"en": "A laptop with an invoice template beside a retired invoice pad."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/rechnungen-digital-schreiben.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"kundendaten-zusammenfuehren": {
		"slug": "kundendaten-zusammenfuehren",
		"slugs": {
			"de": "kundendaten-zusammenfuehren",
			"en": "customer-data-consolidation"
		},
		"title": {
			"de": "Kundendaten zusammenführen (CRM-Start)",
			"en": "Customer data consolidation (CRM start)"
		},
		"alt": {
			"de": "Visitenkarten, Telefon und Notizen fließen in eine Kontaktliste auf dem Laptop.",
			"en": "Business cards, a phone and notes flowing into a contact list on a laptop."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/kundendaten-zusammenfuehren.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"customer-data-consolidation": {
		"slug": "kundendaten-zusammenfuehren",
		"slugs": {
			"de": "kundendaten-zusammenfuehren",
			"en": "customer-data-consolidation"
		},
		"title": {
			"de": "Kundendaten zusammenführen (CRM-Start)",
			"en": "Customer data consolidation (CRM start)"
		},
		"alt": {
			"de": "Visitenkarten, Telefon und Notizen fließen in eine Kontaktliste auf dem Laptop.",
			"en": "Business cards, a phone and notes flowing into a contact list on a laptop."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/kundendaten-zusammenfuehren.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"digitale-ablage-einrichten": {
		"slug": "digitale-ablage-einrichten",
		"slugs": {
			"de": "digitale-ablage-einrichten",
			"en": "digital-filing-system-setup"
		},
		"title": {
			"de": "Digitale Ablage einrichten",
			"en": "Digital filing system setup"
		},
		"alt": {
			"de": "Laptop mit Ordnerbaum, daneben ein Scanner mit Blatt.",
			"en": "A laptop with a folder tree beside a scanner with a sheet."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/digitale-ablage-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"digital-filing-system-setup": {
		"slug": "digitale-ablage-einrichten",
		"slugs": {
			"de": "digitale-ablage-einrichten",
			"en": "digital-filing-system-setup"
		},
		"title": {
			"de": "Digitale Ablage einrichten",
			"en": "Digital filing system setup"
		},
		"alt": {
			"de": "Laptop mit Ordnerbaum, daneben ein Scanner mit Blatt.",
			"en": "A laptop with a folder tree beside a scanner with a sheet."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/digitale-ablage-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"anfragen-automatisch-als-ticket": {
		"slug": "anfragen-automatisch-als-ticket",
		"slugs": {
			"de": "anfragen-automatisch-als-ticket",
			"en": "enquiries-as-tickets"
		},
		"title": {
			"de": "Anfragen automatisch als Ticket",
			"en": "Enquiries as tickets"
		},
		"alt": {
			"de": "Ticket-Board mit drei Spalten, in das Mails und Formulare einlaufen.",
			"en": "A ticket board with three columns that emails and forms flow into."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/anfragen-automatisch-als-ticket.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"enquiries-as-tickets": {
		"slug": "anfragen-automatisch-als-ticket",
		"slugs": {
			"de": "anfragen-automatisch-als-ticket",
			"en": "enquiries-as-tickets"
		},
		"title": {
			"de": "Anfragen automatisch als Ticket",
			"en": "Enquiries as tickets"
		},
		"alt": {
			"de": "Ticket-Board mit drei Spalten, in das Mails und Formulare einlaufen.",
			"en": "A ticket board with three columns that emails and forms flow into."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/anfragen-automatisch-als-ticket.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"einen-ablauf-automatisieren": {
		"slug": "einen-ablauf-automatisieren",
		"slugs": {
			"de": "einen-ablauf-automatisieren",
			"en": "automate-one-workflow"
		},
		"title": {
			"de": "Einen Arbeitsablauf automatisieren",
			"en": "Automate one workflow"
		},
		"alt": {
			"de": "Laptop mit zwei verbundenen App-Symbolen und Schalter, daneben Zahnräder.",
			"en": "A laptop with two connected app icons and a switch beside gears."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/einen-ablauf-automatisieren.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"automate-one-workflow": {
		"slug": "einen-ablauf-automatisieren",
		"slugs": {
			"de": "einen-ablauf-automatisieren",
			"en": "automate-one-workflow"
		},
		"title": {
			"de": "Einen Arbeitsablauf automatisieren",
			"en": "Automate one workflow"
		},
		"alt": {
			"de": "Laptop mit zwei verbundenen App-Symbolen und Schalter, daneben Zahnräder.",
			"en": "A laptop with two connected app icons and a switch beside gears."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/einen-ablauf-automatisieren.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"passwortmanager-fuer-das-team": {
		"slug": "passwortmanager-fuer-das-team",
		"slugs": {
			"de": "passwortmanager-fuer-das-team",
			"en": "password-manager-for-your-team"
		},
		"title": {
			"de": "Passwortmanager für das Team",
			"en": "Password manager for your team"
		},
		"alt": {
			"de": "Laptop mit Passwort-Tresor und Teamsymbol, daneben ein zerknüllter Zettel.",
			"en": "A laptop with a password vault and a team icon beside a crumpled note."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/passwortmanager-fuer-das-team.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"password-manager-for-your-team": {
		"slug": "passwortmanager-fuer-das-team",
		"slugs": {
			"de": "passwortmanager-fuer-das-team",
			"en": "password-manager-for-your-team"
		},
		"title": {
			"de": "Passwortmanager für das Team",
			"en": "Password manager for your team"
		},
		"alt": {
			"de": "Laptop mit Passwort-Tresor und Teamsymbol, daneben ein zerknüllter Zettel.",
			"en": "A laptop with a password vault and a team icon beside a crumpled note."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/passwortmanager-fuer-das-team.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"online-formular-statt-papier": {
		"slug": "online-formular-statt-papier",
		"slugs": {
			"de": "online-formular-statt-papier",
			"en": "online-form-instead-of-paper"
		},
		"title": {
			"de": "Online-Formular statt Papier",
			"en": "Online form instead of paper"
		},
		"alt": {
			"de": "Tablet mit Online-Formular, daneben das abgelöste Papierformular.",
			"en": "A tablet with an online form, the replaced paper form beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/online-formular-statt-papier.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"online-form-instead-of-paper": {
		"slug": "online-formular-statt-papier",
		"slugs": {
			"de": "online-formular-statt-papier",
			"en": "online-form-instead-of-paper"
		},
		"title": {
			"de": "Online-Formular statt Papier",
			"en": "Online form instead of paper"
		},
		"alt": {
			"de": "Tablet mit Online-Formular, daneben das abgelöste Papierformular.",
			"en": "A tablet with an online form, the replaced paper form beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/online-formular-statt-papier.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"referenzseite-anlegen": {
		"slug": "referenzseite-anlegen",
		"slugs": {
			"de": "referenzseite-anlegen",
			"en": "portfolio-page-setup"
		},
		"title": {
			"de": "Referenzseite anlegen",
			"en": "Portfolio page setup"
		},
		"alt": {
			"de": "Laptop mit einem Raster aus Projektfotos und einer Kundenstimme mit Sternen.",
			"en": "A laptop with a grid of project photos and a testimonial with stars."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/referenzseite-anlegen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"portfolio-page-setup": {
		"slug": "referenzseite-anlegen",
		"slugs": {
			"de": "referenzseite-anlegen",
			"en": "portfolio-page-setup"
		},
		"title": {
			"de": "Referenzseite anlegen",
			"en": "Portfolio page setup"
		},
		"alt": {
			"de": "Laptop mit einem Raster aus Projektfotos und einer Kundenstimme mit Sternen.",
			"en": "A laptop with a grid of project photos and a testimonial with stars."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/referenzseite-anlegen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"eintraege-in-branchenverzeichnissen": {
		"slug": "eintraege-in-branchenverzeichnissen",
		"slugs": {
			"de": "eintraege-in-branchenverzeichnissen",
			"en": "business-directory-listings"
		},
		"title": {
			"de": "Einträge in Branchenverzeichnissen",
			"en": "Business directory listings"
		},
		"alt": {
			"de": "Gleicher Firmeneintrag auf Laptop und Smartphone, daneben eine Karte mit Stecknadel.",
			"en": "The same business listing on a laptop and a smartphone with a pinned map beside them."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/eintraege-in-branchenverzeichnissen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"business-directory-listings": {
		"slug": "eintraege-in-branchenverzeichnissen",
		"slugs": {
			"de": "eintraege-in-branchenverzeichnissen",
			"en": "business-directory-listings"
		},
		"title": {
			"de": "Einträge in Branchenverzeichnissen",
			"en": "Business directory listings"
		},
		"alt": {
			"de": "Gleicher Firmeneintrag auf Laptop und Smartphone, daneben eine Karte mit Stecknadel.",
			"en": "The same business listing on a laptop and a smartphone with a pinned map beside them."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/eintraege-in-branchenverzeichnissen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"microsoft-365-einrichten": {
		"slug": "microsoft-365-einrichten",
		"slugs": {
			"de": "microsoft-365-einrichten",
			"en": "microsoft-365-setup"
		},
		"title": {
			"de": "Microsoft 365 einrichten",
			"en": "Microsoft 365 setup"
		},
		"alt": {
			"de": "Laptop mit Mail, Kalender und Dateien in einem Fenster, daneben ein Smartphone.",
			"en": "A laptop with mail, calendar and files in one window, a smartphone beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/microsoft-365-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"microsoft-365-setup": {
		"slug": "microsoft-365-einrichten",
		"slugs": {
			"de": "microsoft-365-einrichten",
			"en": "microsoft-365-setup"
		},
		"title": {
			"de": "Microsoft 365 einrichten",
			"en": "Microsoft 365 setup"
		},
		"alt": {
			"de": "Laptop mit Mail, Kalender und Dateien in einem Fenster, daneben ein Smartphone.",
			"en": "A laptop with mail, calendar and files in one window, a smartphone beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/microsoft-365-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"google-workspace-einrichten": {
		"slug": "google-workspace-einrichten",
		"slugs": {
			"de": "google-workspace-einrichten",
			"en": "google-workspace-setup"
		},
		"title": {
			"de": "Google Workspace einrichten",
			"en": "Google Workspace setup"
		},
		"alt": {
			"de": "Tablet und Smartphone mit gemeinsamen Dokumenten, Kalender und Cloud-Ordner.",
			"en": "A tablet and a smartphone with shared documents, calendar and a cloud folder."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/google-workspace-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"google-workspace-setup": {
		"slug": "google-workspace-einrichten",
		"slugs": {
			"de": "google-workspace-einrichten",
			"en": "google-workspace-setup"
		},
		"title": {
			"de": "Google Workspace einrichten",
			"en": "Google Workspace setup"
		},
		"alt": {
			"de": "Tablet und Smartphone mit gemeinsamen Dokumenten, Kalender und Cloud-Ordner.",
			"en": "A tablet and a smartphone with shared documents, calendar and a cloud folder."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/google-workspace-einrichten.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"website-selbst-pflegen-einweisung": {
		"slug": "website-selbst-pflegen-einweisung",
		"slugs": {
			"de": "website-selbst-pflegen-einweisung",
			"en": "maintain-your-website-yourself"
		},
		"title": {
			"de": "Website selbst pflegen: Einweisung",
			"en": "Maintain your website yourself"
		},
		"alt": {
			"de": "Zwei Hände am Laptop mit Website-Editor, eine zeigt, eine bedient.",
			"en": "Two people's hands at a laptop with a website editor, one pointing, one working."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/website-selbst-pflegen-einweisung.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"maintain-your-website-yourself": {
		"slug": "website-selbst-pflegen-einweisung",
		"slugs": {
			"de": "website-selbst-pflegen-einweisung",
			"en": "maintain-your-website-yourself"
		},
		"title": {
			"de": "Website selbst pflegen: Einweisung",
			"en": "Maintain your website yourself"
		},
		"alt": {
			"de": "Zwei Hände am Laptop mit Website-Editor, eine zeigt, eine bedient.",
			"en": "Two people's hands at a laptop with a website editor, one pointing, one working."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/website-selbst-pflegen-einweisung.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"ki-im-buero-workshop": {
		"slug": "ki-im-buero-workshop",
		"slugs": {
			"de": "ki-im-buero-workshop",
			"en": "ai-at-work-workshop"
		},
		"title": {
			"de": "KI im Büro: Praxis-Workshop",
			"en": "AI at work: hands-on workshop"
		},
		"alt": {
			"de": "Workshop-Tisch mit Laptop im Chat-Fenster und Haftnotizen mit Aufgaben.",
			"en": "A workshop table with a laptop showing a chat window and sticky notes with tasks."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/ki-im-buero-workshop.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"ai-at-work-workshop": {
		"slug": "ki-im-buero-workshop",
		"slugs": {
			"de": "ki-im-buero-workshop",
			"en": "ai-at-work-workshop"
		},
		"title": {
			"de": "KI im Büro: Praxis-Workshop",
			"en": "AI at work: hands-on workshop"
		},
		"alt": {
			"de": "Workshop-Tisch mit Laptop im Chat-Fenster und Haftnotizen mit Aufgaben.",
			"en": "A workshop table with a laptop showing a chat window and sticky notes with tasks."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/ki-im-buero-workshop.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"it-sicherheit-fuer-mitarbeitende": {
		"slug": "it-sicherheit-fuer-mitarbeitende",
		"slugs": {
			"de": "it-sicherheit-fuer-mitarbeitende",
			"en": "it-security-awareness-training"
		},
		"title": {
			"de": "IT-Sicherheit für Mitarbeitende",
			"en": "IT security awareness training"
		},
		"alt": {
			"de": "Laptop mit verdächtiger E-Mail und Warnsymbol, daneben Angelhaken und Schloss.",
			"en": "A laptop with a suspicious email and a warning sign, a fishing hook and a padlock beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/it-sicherheit-fuer-mitarbeitende.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"it-security-awareness-training": {
		"slug": "it-sicherheit-fuer-mitarbeitende",
		"slugs": {
			"de": "it-sicherheit-fuer-mitarbeitende",
			"en": "it-security-awareness-training"
		},
		"title": {
			"de": "IT-Sicherheit für Mitarbeitende",
			"en": "IT security awareness training"
		},
		"alt": {
			"de": "Laptop mit verdächtiger E-Mail und Warnsymbol, daneben Angelhaken und Schloss.",
			"en": "A laptop with a suspicious email and a warning sign, a fishing hook and a padlock beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/it-sicherheit-fuer-mitarbeitende.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"google-unternehmensprofil-selbst-pflegen": {
		"slug": "google-unternehmensprofil-selbst-pflegen",
		"slugs": {
			"de": "google-unternehmensprofil-selbst-pflegen",
			"en": "maintain-your-google-business-profile"
		},
		"title": {
			"de": "Google-Unternehmensprofil selbst pflegen",
			"en": "Maintain your Google Business Profile"
		},
		"alt": {
			"de": "Hand am Smartphone fügt einem Firmenprofil einen Beitrag hinzu.",
			"en": "A hand on a smartphone adding a post to a business profile."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/google-unternehmensprofil-selbst-pflegen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"maintain-your-google-business-profile": {
		"slug": "google-unternehmensprofil-selbst-pflegen",
		"slugs": {
			"de": "google-unternehmensprofil-selbst-pflegen",
			"en": "maintain-your-google-business-profile"
		},
		"title": {
			"de": "Google-Unternehmensprofil selbst pflegen",
			"en": "Maintain your Google Business Profile"
		},
		"alt": {
			"de": "Hand am Smartphone fügt einem Firmenprofil einen Beitrag hinzu.",
			"en": "A hand on a smartphone adding a post to a business profile."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/google-unternehmensprofil-selbst-pflegen.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"social-media-grundlagen-fuer-betriebe": {
		"slug": "social-media-grundlagen-fuer-betriebe",
		"slugs": {
			"de": "social-media-grundlagen-fuer-betriebe",
			"en": "social-media-basics-for-businesses"
		},
		"title": {
			"de": "Social-Media-Grundlagen für Betriebe",
			"en": "Social media basics for businesses"
		},
		"alt": {
			"de": "Smartphone mit Beitragsraster, daneben ein Wochenplan mit Post-Skizzen.",
			"en": "A smartphone with a grid of posts beside a weekly planner with post sketches."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/social-media-grundlagen-fuer-betriebe.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"social-media-basics-for-businesses": {
		"slug": "social-media-grundlagen-fuer-betriebe",
		"slugs": {
			"de": "social-media-grundlagen-fuer-betriebe",
			"en": "social-media-basics-for-businesses"
		},
		"title": {
			"de": "Social-Media-Grundlagen für Betriebe",
			"en": "Social media basics for businesses"
		},
		"alt": {
			"de": "Smartphone mit Beitragsraster, daneben ein Wochenplan mit Post-Skizzen.",
			"en": "A smartphone with a grid of posts beside a weekly planner with post sketches."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/social-media-grundlagen-fuer-betriebe.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"e-mail-postfach-im-griff": {
		"slug": "e-mail-postfach-im-griff",
		"slugs": {
			"de": "e-mail-postfach-im-griff",
			"en": "get-your-inbox-under-control"
		},
		"title": {
			"de": "E-Mail-Postfach im Griff",
			"en": "Get your inbox under control"
		},
		"alt": {
			"de": "Laptop mit farbig sortierten Ordnern und leerem Posteingang.",
			"en": "A laptop with colour-sorted folders and an empty inbox."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/e-mail-postfach-im-griff.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"get-your-inbox-under-control": {
		"slug": "e-mail-postfach-im-griff",
		"slugs": {
			"de": "e-mail-postfach-im-griff",
			"en": "get-your-inbox-under-control"
		},
		"title": {
			"de": "E-Mail-Postfach im Griff",
			"en": "Get your inbox under control"
		},
		"alt": {
			"de": "Laptop mit farbig sortierten Ordnern und leerem Posteingang.",
			"en": "A laptop with colour-sorted folders and an empty inbox."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/e-mail-postfach-im-griff.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"microsoft-teams-einfuehrung": {
		"slug": "microsoft-teams-einfuehrung",
		"slugs": {
			"de": "microsoft-teams-einfuehrung",
			"en": "microsoft-teams-introduction"
		},
		"title": {
			"de": "Microsoft 365 und Teams: Einführung",
			"en": "Microsoft 365 and Teams: introduction"
		},
		"alt": {
			"de": "Laptop mit Videobesprechung, Chat und Dateien, daneben ein Konferenzlautsprecher.",
			"en": "A laptop with a video meeting, chat and files, a conference speaker beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/microsoft-teams-einfuehrung.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	},
	"microsoft-teams-introduction": {
		"slug": "microsoft-teams-einfuehrung",
		"slugs": {
			"de": "microsoft-teams-einfuehrung",
			"en": "microsoft-teams-introduction"
		},
		"title": {
			"de": "Microsoft 365 und Teams: Einführung",
			"en": "Microsoft 365 and Teams: introduction"
		},
		"alt": {
			"de": "Laptop mit Videobesprechung, Chat und Dateien, daneben ein Konferenzlautsprecher.",
			"en": "A laptop with a video meeting, chat and files, a conference speaker beside it."
		},
		"width": 1440,
		"height": 810,
		"src": "/images/products/microsoft-teams-einfuehrung.webp",
		"digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia"
	}
};
var productImage = (slug) => productImageCatalog[slug];
var origin = "https://shop.tracht-digital.de";
function withProductImage(product) {
	const image = productImage(product.slug);
	const own = product.offers.some((o) => o.kind === "own");
	const existing = product.imageUrl;
	const generic = !existing || /^https:\/\/tracht-digital\.de\/images\/services\//.test(existing);
	return image && own && generic ? {
		...product,
		imageUrl: origin + image.src
	} : product;
}
function productImageAttributes(product, lang, detail = false) {
	const image = productImage(product.slug);
	if (!image || product.imageUrl !== origin + image.src) return void 0;
	return {
		alt: image.alt[lang],
		width: image.width,
		height: image.height,
		srcSet: productImageSrcset(image.src),
		sizes: detail ? "(min-width: 64rem) 60vw, 100vw" : "(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw",
		loading: detail ? "eager" : "lazy",
		decoding: "async"
	};
}
function productImageSrcset(src, format = "webp") {
	return [
		480,
		960,
		1440
	].map((w) => `${origin}${src.replace(".webp", (w === 1440 ? "" : "-" + w) + "." + format)} ${w}w`).join(", ");
}
// node_modules/@tracht-digital-solutions/tds-shared/dist/chunk-N6TATNUU.js
var PORTAL_PERMISSIONS = [
	"projects:read",
	"invoices:read",
	"invoices:pay",
	"documents:read",
	"documents:write",
	"messages:read",
	"messages:write",
	"tickets:read",
	"tickets:write"
];
var PERMISSION_KEY_PATTERN = /^[a-z0-9][a-z0-9-]{0,31}:[a-z0-9][a-z0-9-]{0,31}$/;
[...PORTAL_PERMISSIONS], PORTAL_PERMISSIONS.filter((p) => p.endsWith(":read"));
// node_modules/zod/v4/classic/errors.js
var _installedErrorProtos = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
function _lazyMethod(proto, key, make) {
	Object.defineProperty(proto, key, {
		configurable: true,
		enumerable: false,
		get() {
			const value = make(this);
			Object.defineProperty(this, key, {
				value,
				configurable: true,
				writable: true
			});
			return value;
		},
		set(value) {
			Object.defineProperty(this, key, {
				value,
				configurable: true,
				writable: true
			});
		}
	});
}
var initializer = (inst, issues) => {
	$ZodError.init(inst, issues);
	inst.name = "ZodError";
	const proto = Object.getPrototypeOf(inst);
	if (_installedErrorProtos.has(proto)) return;
	_installedErrorProtos.add(proto);
	_lazyMethod(proto, "format", (self) => (mapper) => formatError(self, mapper));
	_lazyMethod(proto, "flatten", (self) => (mapper) => flattenError(self, mapper));
	_lazyMethod(proto, "addIssue", (self) => (issue) => {
		self.issues.push(issue);
		self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
	});
	_lazyMethod(proto, "addIssues", (self) => (issues) => {
		self.issues.push(...issues);
		self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
	});
	Object.defineProperty(proto, "isEmpty", {
		configurable: true,
		enumerable: false,
		get() {
			return this.issues.length === 0;
		}
	});
};
var ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, void 0, { Parent: Error });
// node_modules/zod/v4/classic/parse.js
var parse = /* @__PURE__ */ _parse(ZodRealError);
var parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
var safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
var safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
var encode = /* @__PURE__ */ _encode(ZodRealError);
var decode = /* @__PURE__ */ _decode(ZodRealError);
var encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
var decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
var safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
var safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
var safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
var safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
// node_modules/zod/v4/classic/schemas.js
function _ensureDefaultLocale() {
	if (!globalConfig.localeError) config(en_default());
}
function _ensureDefaultMemoizer() {
	if (!globalConfig.memoizer) config({ memoizer: memoizer() });
}
var ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
	_ensureDefaultLocale();
	$ZodType.init(inst, def);
	inst.def = def;
	inst.type = def.type;
	return inst;
}, {
	check(...chks) {
		const def = this.def;
		return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
			check: ch,
			def: { check: "custom" },
			onattach: []
		} } : ch)] }), { parent: true });
	},
	with(...chks) {
		return this.check(...chks);
	},
	clone(def, params) {
		return clone(this, def, params);
	},
	brand() {
		return this;
	},
	register(reg, meta) {
		reg.add(this, meta);
		return this;
	},
	refine(check, params) {
		return this.check(refine(check, params));
	},
	superRefine(refinement, params) {
		return this.check(superRefine(refinement, params));
	},
	overwrite(fn) {
		return this.check(/* @__PURE__ */ _overwrite(fn));
	},
	optional() {
		return optional(this);
	},
	exactOptional() {
		return exactOptional(this);
	},
	nullable() {
		return nullable(this);
	},
	nullish() {
		return optional(nullable(this));
	},
	nonoptional(params) {
		return nonoptional(this, params);
	},
	array() {
		return array(this);
	},
	or(arg) {
		return union([this, arg]);
	},
	and(arg) {
		return intersection(this, arg);
	},
	transform(tx) {
		return pipe(this, transform(tx));
	},
	default(d) {
		return _default(this, d);
	},
	prefault(d) {
		return prefault(this, d);
	},
	catch(params) {
		return _catch(this, params);
	},
	pipe(target) {
		return pipe(this, target);
	},
	readonly() {
		return readonly(this);
	},
	describe(description) {
		const cl = this.clone();
		globalRegistry.add(cl, { description });
		return cl;
	},
	meta(...args) {
		if (args.length === 0) return globalRegistry.get(this);
		const cl = this.clone();
		globalRegistry.add(cl, args[0]);
		return cl;
	},
	isOptional() {
		return this.safeParse(void 0).success;
	},
	isNullable() {
		return this.safeParse(null).success;
	},
	apply(fn, ...args) {
		return args.length === 0 ? fn(this) : fn(this, ...args);
	},
	get "~standard"() {
		return hide(this, "~standard", {
			...standardProps(this),
			jsonSchema: {
				input: createStandardJSONSchemaMethod(this, "input"),
				output: createStandardJSONSchemaMethod(this, "output")
			}
		});
	},
	set "~standard"(value) {
		own(this, "~standard", value);
	},
	parse: function _parse(data, params) {
		return parse(this, data, params, { callee: _parse });
	},
	parseAsync: async function _parseAsync(data, params) {
		return await parseAsync(this, data, params, { callee: _parseAsync });
	},
	safeParse(data, params) {
		return safeParse(this, data, params);
	},
	async safeParseAsync(data, params) {
		return safeParseAsync(this, data, params);
	},
	get spa() {
		return this?.safeParseAsync;
	},
	set spa(value) {
		own(this, "spa", value);
	},
	validate(data, params) {
		return validate(this, data, params);
	},
	validateAsync(data, params) {
		return validateAsync$1(this, data, params);
	},
	encode: function _encode(data, params) {
		return encode(this, data, params, { callee: _encode });
	},
	decode: function _decode(data, params) {
		return decode(this, data, params, { callee: _decode });
	},
	encodeAsync: async function _encodeAsync(data, params) {
		return await encodeAsync(this, data, params, { callee: _encodeAsync });
	},
	decodeAsync: async function _decodeAsync(data, params) {
		return await decodeAsync(this, data, params, { callee: _decodeAsync });
	},
	safeEncode(data, params) {
		return safeEncode(this, data, params);
	},
	safeDecode(data, params) {
		return safeDecode(this, data, params);
	},
	async safeEncodeAsync(data, params) {
		return safeEncodeAsync(this, data, params);
	},
	async safeDecodeAsync(data, params) {
		return safeDecodeAsync(this, data, params);
	},
	toJSONSchema(params) {
		return createToJSONSchemaMethod(this, {})(params);
	},
	get description() {
		return globalRegistry.get(this)?.description;
	},
	get _def() {
		return this._zod.def;
	}
});
/** @internal */
var _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
}, /*@__PURE__*/ derived({
	format: (inst) => aggregateChecks(inst).format ?? null,
	minLength: (inst) => aggregateChecks(inst).minimum ?? null,
	maxLength: (inst) => aggregateChecks(inst).maximum ?? null
}, {
	regex(...args) {
		return this.check(/* @__PURE__ */ _regex(...args));
	},
	includes(...args) {
		return this.check(/* @__PURE__ */ _includes(...args));
	},
	startsWith(...args) {
		return this.check(/* @__PURE__ */ _startsWith(...args));
	},
	endsWith(...args) {
		return this.check(/* @__PURE__ */ _endsWith(...args));
	},
	min(...args) {
		return this.check(/* @__PURE__ */ _minLength(...args));
	},
	max(...args) {
		return this.check(/* @__PURE__ */ _maxLength(...args));
	},
	length(...args) {
		return this.check(/* @__PURE__ */ _length(...args));
	},
	nonempty(...args) {
		return this.check(/* @__PURE__ */ _minLength(1, ...args));
	},
	lowercase(params) {
		return this.check(/* @__PURE__ */ _lowercase(params));
	},
	uppercase(params) {
		return this.check(/* @__PURE__ */ _uppercase(params));
	},
	trim() {
		return this.check(/* @__PURE__ */ _trim());
	},
	normalize(...args) {
		return this.check(/* @__PURE__ */ _normalize(...args));
	},
	toLowerCase() {
		return this.check(/* @__PURE__ */ _toLowerCase());
	},
	toUpperCase() {
		return this.check(/* @__PURE__ */ _toUpperCase());
	},
	slugify() {
		return this.check(/* @__PURE__ */ _slugify());
	}
}));
var ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	_ZodString.init(inst, def);
}, {
	email(params) {
		return this.check(/* @__PURE__ */ _email(ZodEmail, params));
	},
	url(params) {
		return this.check(/* @__PURE__ */ _url(ZodURL, params));
	},
	jwt(params) {
		return this.check(/* @__PURE__ */ _jwt(ZodJWT, params));
	},
	emoji(params) {
		return this.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
	},
	guid(params) {
		return this.check(/* @__PURE__ */ _guid(ZodGUID, params));
	},
	uuid(params) {
		return this.check(/* @__PURE__ */ _uuid(ZodUUID, params));
	},
	uuidv4(params) {
		return this.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
	},
	uuidv6(params) {
		return this.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
	},
	uuidv7(params) {
		return this.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
	},
	nanoid(params) {
		return this.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
	},
	cuid(params) {
		return this.check(/* @__PURE__ */ _cuid(ZodCUID, params));
	},
	cuid2(params) {
		return this.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
	},
	ulid(params) {
		return this.check(/* @__PURE__ */ _ulid(ZodULID, params));
	},
	base64(params) {
		return this.check(/* @__PURE__ */ _base64(ZodBase64, params));
	},
	base64url(params) {
		return this.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
	},
	xid(params) {
		return this.check(/* @__PURE__ */ _xid(ZodXID, params));
	},
	ksuid(params) {
		return this.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
	},
	ipv4(params) {
		return this.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
	},
	ipv6(params) {
		return this.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
	},
	cidrv4(params) {
		return this.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
	},
	cidrv6(params) {
		return this.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
	},
	e164(params) {
		return this.check(/* @__PURE__ */ _e164(ZodE164, params));
	},
	datetime(params) {
		return this.check(/* @__PURE__ */ _isoDateTime(ZodISODateTime, params));
	},
	date(params) {
		return this.check(/* @__PURE__ */ _isoDate(ZodISODate, params));
	},
	time(params) {
		return this.check(/* @__PURE__ */ _isoTime(ZodISOTime, params));
	},
	duration(params) {
		return this.check(/* @__PURE__ */ _isoDuration(ZodISODuration, params));
	}
});
function string(params) {
	return /* @__PURE__ */ _string(ZodString, params);
}
var ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	_ZodString.init(inst, def);
});
var ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
	$ZodISODateTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
	$ZodISODate.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
	$ZodISOTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
	$ZodISODuration.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
	$ZodEmail.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
	$ZodGUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
	$ZodUUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
	$ZodURL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
	$ZodEmoji.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
	$ZodNanoID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
* See https://github.com/paralleldrive/cuid.
*/
var ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
	$ZodCUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
	$ZodCUID2.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
	$ZodULID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
	$ZodXID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
	$ZodKSUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
	$ZodIPv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
	$ZodIPv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
	$ZodCIDRv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
	$ZodCIDRv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
	$ZodBase64.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
	$ZodBase64URL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
	$ZodE164.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
	$ZodJWT.init(inst, def);
	ZodStringFormat.init(inst, def);
});
var ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
	$ZodNumber.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
	inst.isFinite = true;
}, /*@__PURE__*/ derived({
	minValue: (inst) => {
		const { minimum, exclusiveMinimum } = aggregateChecks(inst);
		return Math.max(minimum ?? Number.NEGATIVE_INFINITY, exclusiveMinimum ?? Number.NEGATIVE_INFINITY);
	},
	maxValue: (inst) => {
		const { maximum, exclusiveMaximum } = aggregateChecks(inst);
		return Math.min(maximum ?? Number.POSITIVE_INFINITY, exclusiveMaximum ?? Number.POSITIVE_INFINITY);
	},
	isInt: (inst) => {
		const { isInt, multipleOf } = aggregateChecks(inst);
		return !!isInt || !!multipleOf?.some(Number.isSafeInteger);
	},
	format: (inst) => aggregateChecks(inst).format ?? null
}, {
	gt(value, params) {
		return this.check(/* @__PURE__ */ _gt(value, params));
	},
	gte(value, params) {
		return this.check(/* @__PURE__ */ _gte(value, params));
	},
	min(value, params) {
		return this.check(/* @__PURE__ */ _gte(value, params));
	},
	lt(value, params) {
		return this.check(/* @__PURE__ */ _lt(value, params));
	},
	lte(value, params) {
		return this.check(/* @__PURE__ */ _lte(value, params));
	},
	max(value, params) {
		return this.check(/* @__PURE__ */ _lte(value, params));
	},
	int(params) {
		return this.check(int(params));
	},
	safe(params) {
		return this.check(int(params));
	},
	positive(params) {
		return this.check(/* @__PURE__ */ _gt(0, params));
	},
	nonnegative(params) {
		return this.check(/* @__PURE__ */ _gte(0, params));
	},
	negative(params) {
		return this.check(/* @__PURE__ */ _lt(0, params));
	},
	nonpositive(params) {
		return this.check(/* @__PURE__ */ _lte(0, params));
	},
	multipleOf(value, params) {
		return this.check(/* @__PURE__ */ _multipleOf(value, params));
	},
	step(value, params) {
		return this.check(/* @__PURE__ */ _multipleOf(value, params));
	},
	finite() {
		return this;
	}
}));
function number(params) {
	return /* @__PURE__ */ _number(ZodNumber, params);
}
var ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
	$ZodNumberFormat.init(inst, def);
	ZodNumber.init(inst, def);
});
function int(params) {
	return /* @__PURE__ */ _int(ZodNumberFormat, params);
}
var ZodBoolean = /*@__PURE__*/ $constructor("ZodBoolean", (inst, def) => {
	$ZodBoolean.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
});
function boolean(params) {
	return /* @__PURE__ */ _boolean(ZodBoolean, params);
}
var ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
	$ZodUnknown.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => void 0;
});
function unknown() {
	return /* @__PURE__ */ _unknown(ZodUnknown);
}
var ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
	$ZodNever.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never(params) {
	return /* @__PURE__ */ _never(ZodNever, params);
}
var ZodDate = /*@__PURE__*/ $constructor("ZodDate", (inst, def) => {
	$ZodDate.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => dateProcessor(inst, ctx, json, params);
	inst.min = (value, params) => inst.check(/* @__PURE__ */ _gte(value, params));
	inst.max = (value, params) => inst.check(/* @__PURE__ */ _lte(value, params));
}, /*@__PURE__*/ derived({
	minDate: (inst) => {
		const { minimum } = aggregateChecks(inst);
		return minimum ? new Date(minimum) : null;
	},
	maxDate: (inst) => {
		const { maximum } = aggregateChecks(inst);
		return maximum ? new Date(maximum) : null;
	}
}, {}));
var ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
	_ensureDefaultMemoizer();
	$ZodArray.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
	inst.element = def.element;
}, {
	min(n, params) {
		return this.check(/* @__PURE__ */ _minLength(n, params));
	},
	nonempty(params) {
		return this.check(/* @__PURE__ */ _minLength(1, params));
	},
	max(n, params) {
		return this.check(/* @__PURE__ */ _maxLength(n, params));
	},
	length(n, params) {
		return this.check(/* @__PURE__ */ _length(n, params));
	},
	unwrap() {
		return this.element;
	}
});
function array(element, params) {
	return /* @__PURE__ */ _array(ZodArray, element, params);
}
var ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
	_ensureDefaultMemoizer();
	$ZodObjectJIT.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
	installLazyProp(inst, "shape", (self) => self._zod.def.shape, false);
}, {
	keyof() {
		return _enum(Object.keys(this._zod.def.shape));
	},
	catchall(catchall) {
		return this.clone(mergeDefs(this._zod.def, { catchall }));
	},
	passthrough() {
		return this.clone(mergeDefs(this._zod.def, { catchall: unknown() }));
	},
	loose() {
		return this.clone(mergeDefs(this._zod.def, { catchall: unknown() }));
	},
	strict() {
		return this.clone(mergeDefs(this._zod.def, { catchall: never() }));
	},
	strip() {
		return this.clone(mergeDefs(this._zod.def, { catchall: void 0 }));
	},
	extend(incoming) {
		return extend(this, incoming);
	},
	safeExtend(incoming) {
		return safeExtend(this, incoming);
	},
	merge(other) {
		return merge(this, other);
	},
	pick(mask) {
		return pick(this, mask);
	},
	omit(mask) {
		return omit(this, mask);
	},
	partial(...args) {
		return partial(ZodOptional, this, args[0]);
	},
	exactPartial(...args) {
		return partial(ZodExactOptional, this, args[0], "exactPartial");
	},
	required(...args) {
		return required(ZodNonOptional, this, args[0]);
	}
});
function object(shape, params) {
	return new ZodObject({
		type: "object",
		shape: shape ?? {},
		...normalizeParams(params)
	});
}
var ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
	$ZodUnion.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
	inst.options = def.options;
});
function union(options, params) {
	return new ZodUnion({
		type: "union",
		options,
		...normalizeParams(params)
	});
}
var ZodDiscriminatedUnion = /*@__PURE__*/ $constructor("ZodDiscriminatedUnion", (inst, def) => {
	ZodUnion.init(inst, def);
	$ZodDiscriminatedUnion.init(inst, def);
});
function discriminatedUnion(discriminator, options, params) {
	return new ZodDiscriminatedUnion({
		type: "union",
		options,
		discriminator,
		...normalizeParams(params)
	});
}
var ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
	$ZodIntersection.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
	return new ZodIntersection({
		type: "intersection",
		left,
		right
	});
}
var ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
	$ZodEnum.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
	inst.enum = def.entries;
	inst.options = [...inst._zod.values];
	const keys = new Set(Object.keys(def.entries));
	inst.extract = (values, params) => {
		const newEntries = {};
		for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
	inst.exclude = (values, params) => {
		const newEntries = { ...def.entries };
		for (const value of values) if (keys.has(value)) delete newEntries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
});
function _enum(values, params) {
	return new ZodEnum({
		type: "enum",
		entries: Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values,
		...normalizeParams(params)
	});
}
var ZodLiteral = /*@__PURE__*/ $constructor("ZodLiteral", (inst, def) => {
	$ZodLiteral.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
	inst.values = new Set(def.values);
	Object.defineProperty(inst, "value", { get() {
		if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
		return def.values[0];
	} });
});
function literal(value, params) {
	return new ZodLiteral({
		type: "literal",
		values: Array.isArray(value) ? value : [value],
		...normalizeParams(params)
	});
}
var ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
	_ensureDefaultMemoizer();
	$ZodTransform.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
	inst._zod.parse = (payload, _ctx) => {
		if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		payload.addIssue = (issue$1) => {
			if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
			else {
				const _issue = issue$1;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				if (!("input" in _issue)) _issue.input = payload.value;
				_issue.inst ?? (_issue.inst = inst);
				payload.issues.push(issue(_issue));
			}
		};
		const output = def.transform(payload.value, payload);
		if (output instanceof Promise) return output.then((output) => {
			payload.value = output;
			return payload;
		});
		payload.value = output;
		return payload;
	};
});
function transform(fn) {
	return new ZodTransform({
		type: "transform",
		transform: fn
	});
}
var ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
	return new ZodOptional({
		type: "optional",
		innerType
	});
}
var ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
	$ZodExactOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
	return new ZodExactOptional({
		type: "optional",
		innerType
	});
}
var ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
	$ZodNullable.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
	return new ZodNullable({
		type: "nullable",
		innerType
	});
}
var ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
	$ZodDefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
	return new ZodDefault({
		type: "default",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
var ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
	$ZodPrefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
	return new ZodPrefault({
		type: "prefault",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
var ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
	$ZodNonOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
	return new ZodNonOptional({
		type: "nonoptional",
		innerType,
		...normalizeParams(params)
	});
}
var ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
	$ZodCatch.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
	return new ZodCatch({
		type: "catch",
		innerType,
		catchValue: typeof catchValue === "function" ? catchValue : constantCatch(catchValue)
	});
}
var ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
	$ZodPipe.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
	inst.in = def.in;
	inst.out = def.out;
});
function pipe(in_, out) {
	return new ZodPipe({
		type: "pipe",
		in: in_,
		out
	});
}
var ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
	$ZodReadonly.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
	return new ZodReadonly({
		type: "readonly",
		innerType
	});
}
var ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
	$ZodCustom.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
function refine(fn, _params = {}) {
	return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
	return /* @__PURE__ */ _superRefine(fn, params);
}
// node_modules/zod/v4/classic/coerce.js
function date(params) {
	return /* @__PURE__ */ _coercedDate(ZodDate, params);
}
var BlogBlockSchema = discriminatedUnion("type", [
	object({
		type: literal("heading"),
		level: union([literal(2), literal(3)]),
		text: string().max(300)
	}),
	object({
		type: literal("paragraph"),
		text: string().max(5e3)
	}),
	object({
		type: literal("list"),
		ordered: boolean(),
		items: array(string().max(2e3)).max(100)
	}),
	object({
		type: literal("quote"),
		text: string().max(2e3),
		cite: string().max(200).optional().nullable()
	}),
	object({
		type: literal("code"),
		lang: string().max(30),
		code: string().max(2e4)
	}),
	object({
		type: literal("image"),
		url: string().max(600),
		alt: string().max(300),
		caption: string().max(300).optional().nullable()
	}),
	object({ type: literal("divider") }),
	object({
		type: literal("callout"),
		variant: _enum([
			"info",
			"warn",
			"tip"
		]),
		text: string().max(3e3)
	}),
	object({
		type: literal("button"),
		label: string().max(120),
		href: string().max(600),
		style: _enum(["primary", "ghost"])
	}),
	object({
		type: literal("video"),
		provider: _enum(["youtube", "vimeo"]),
		url: string().max(600)
	}),
	object({
		type: literal("adsense"),
		placement: literal("inline"),
		slot: string().max(60).optional().nullable()
	}),
	object({
		type: literal("custom"),
		snippetId: number().int().positive()
	}),
	object({
		type: literal("product"),
		slug: string().max(120),
		/** `card` = full product card, `inline` = one compact row, `list` = card + all offers. */
		variant: _enum([
			"card",
			"inline",
			"list"
		])
	})
]);
object({
	version: literal(1),
	blocks: array(BlogBlockSchema).min(1).max(400)
});
var ALLOWED_SCHEMES = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function isSafeHref(value) {
	const trimmed = value.trim();
	if (trimmed === "") return false;
	let url;
	try {
		url = new URL(trimmed);
	} catch {
		return false;
	}
	return ALLOWED_SCHEMES.includes(url.protocol);
}
var SafeHref = string().max(600).refine((v) => v.trim() === "" || isSafeHref(v), { message: "href" });
var LinkItem = object({
	label: string().max(120),
	href: SafeHref,
	/** One short line under the label, e.g. "Mo–Fr, 8–17 Uhr". */
	note: string().max(160).optional().nullable(),
	/**
	* Which glyph the renderer draws. A closed vocabulary, not a free string:
	* an icon name the renderer does not know renders as nothing at all, and the
	* editor should not be able to produce that state.
	*/
	icon: _enum([
		"link",
		"phone",
		"mail",
		"map",
		"calendar",
		"download",
		"shop",
		"chat"
	]).optional().nullable()
});
var LinksBlock = object({
	type: literal("links"),
	/** Optional heading above the group. */
	label: string().max(120).optional().nullable(),
	items: array(LinkItem).max(30)
});
var HeadingBlock2 = object({
	type: literal("heading"),
	text: string().max(160)
});
var TextBlock = object({
	type: literal("text"),
	text: string().max(2e3)
});
var DividerBlock2 = object({ type: literal("divider") });
var HoursRow = object({
	/** "Mo–Do" — free text, because business reality does not fit an enum. */
	days: string().max(60),
	/** "08:00–17:00" or "geschlossen". */
	time: string().max(60)
});
var HoursBlock = object({
	type: literal("hours"),
	label: string().max(120).optional().nullable(),
	rows: array(HoursRow).max(14)
});
var SocialItem = object({
	network: _enum([
		"linkedin",
		"xing",
		"instagram",
		"facebook",
		"youtube",
		"github",
		"whatsapp",
		"website"
	]),
	href: SafeHref
});
var CardBlockSchema = discriminatedUnion("type", [
	LinksBlock,
	HeadingBlock2,
	TextBlock,
	HoursBlock,
	object({
		type: literal("socials"),
		items: array(SocialItem).max(12)
	}),
	DividerBlock2
]);
object({
	version: literal(1),
	blocks: array(CardBlockSchema).max(60)
});
var ShopOfferSchema = object({
	id: number().int().positive(),
	kind: _enum(["own", "affiliate"]),
	network: _enum([
		"amazon",
		"awin",
		"belboon",
		"digistore",
		"direct"
	]),
	/** Merchant-facing label ("Amazon", "Hetzner"), already localised by the API. */
	merchant: string().max(120),
	/** The outbound URL, affiliate tag already appended by the API. */
	url: string().max(1e3),
	/** Net-of-nothing gross price in minor units; null when we have no quote. */
	priceCents: number().int().nonnegative().nullable(),
	currency: string().length(3).default("EUR"),
	/**
	* When {@link priceCents} was last confirmed, ISO-8601. Null means "never
	* fetched" — which is not the same as a stale price and renders differently:
	* a never-fetched offer simply shows no price, a stale one shows why.
	*/
	priceCheckedAt: string().datetime({ offset: true }).nullable(),
	availability: _enum([
		"in_stock",
		"out_of_stock",
		"unknown"
	]).default("unknown"),
	position: number().int().nonnegative().default(0)
});
var ShopProductRefSchema = object({
	slug: string().max(120),
	lang: _enum(["de", "en"]),
	title: string().max(200),
	teaser: string().max(400),
	category: string().max(60),
	imageUrl: string().max(1e3).nullable(),
	/** Absolute URL of the product page on the shop site. */
	url: string().max(1e3),
	offers: array(ShopOfferSchema).max(20).default([])
});
ShopProductRefSchema.extend({
	/** Blocks JSON or markdown, same dual format as a blog post body. */
	body: string(),
	bodyFormat: _enum(["markdown", "blocks"]).default("blocks"),
	tags: array(string().max(60)).max(20).default([]),
	metaDescription: string().max(300).nullable(),
	publishedAt: string().datetime({ offset: true }).nullable(),
	updatedAt: string().datetime({ offset: true }).nullable(),
	machineTranslated: boolean().default(false)
});
object({
	key: string().max(60),
	/** Heading shown above the slot, already localised. Null renders no heading. */
	heading: string().max(120).nullable(),
	/**
	* The legally required advertising label ("Anzeige" / "Advertisement").
	*
	* Served rather than hard-coded so the label is right in both languages and
	* cannot be forgotten by a consumer — see `ProductCard`, which refuses to
	* render an affiliate offer without one.
	*/
	label: string().max(60),
	products: array(ShopProductRefSchema).max(12).default([])
});
function emptyPlacement(key, lang = "de") {
	return {
		key,
		heading: null,
		label: lang === "de" ? "Anzeige" : "Advertisement",
		products: []
	};
}
object({
	name: string().min(2, "name"),
	email: string().email("email"),
	company: string().optional(),
	subject: string().max(200).optional(),
	message: string().min(20, "message"),
	consent: literal(true, { error: () => ({ message: "consent" }) }),
	website: string().max(0).optional()
});
object({
	slug: string().min(3).max(120).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only."),
	lang: _enum(["de", "en"]).default("de"),
	category: string().min(2).max(40),
	title: string().min(4).max(200),
	excerpt: string().min(10).max(400),
	body: string().min(20),
	/** Storage format of `body`. `markdown` keeps the legacy single-string path. */
	bodyFormat: _enum(["markdown", "blocks"]).default("markdown"),
	coverHint: string().max(400).optional().nullable(),
	publishedAt: date().optional().nullable(),
	draft: boolean().default(false),
	/** Per-post ad rendering mode (blog only). Mirrors the PHP validator. */
	adsMode: _enum([
		"default",
		"off",
		"auto",
		"manual"
	]).default("default"),
	/**
	* auth-api `app_user.id` of the author. Admins may set any eligible author;
	* for a non-admin blog author the server forces it to themselves. Null /
	* omitted leaves the post unassigned. The PHP validator mirrors this.
	*/
	authorId: number().int().positive().optional().nullable()
});
object({
	name: string().min(1).max(200),
	slug: string().min(1).max(120).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only."),
	avatarUrl: string().max(500).optional().nullable(),
	bio: string().max(500).optional().nullable(),
	active: boolean().default(true)
});
object({
	email: string().email().optional(),
	password: string().min(1).optional(),
	token: string().min(1).optional()
});
_enum(PORTAL_PERMISSIONS);
var PermissionKeySchema = string().regex(PERMISSION_KEY_PATTERN, "expected <resource>:<action>");
var MembershipSchema = object({
	companyId: number().int().positive().optional(),
	/** @deprecated legacy name for `companyId`; removed in the follow-up release. */
	customerId: number().int().positive().optional(),
	permissions: array(PermissionKeySchema).max(128).default([]),
	/** Ids of the groups assigned to this user IN this company. */
	groupIds: array(number().int().positive()).default([]),
	/** Whether this membership may manage the company's own users. */
	isCompanyAdmin: boolean().default(false),
	/**
	* The most this membership may ever be granted, `null` = inherit the
	* company policy. Platform-admin only — a company admin cannot raise it.
	*/
	permissionCeiling: array(PermissionKeySchema).nullish(),
	/**
	* Rights withheld from THIS person even where an assigned group grants
	* them — the per-person override of the group's decision.
	*
	* Not the same field as `permissionCeiling`, and the difference is easy to
	* lose: the ceiling is the platform admin's limit on what a company admin
	* may ever hand out; this is the ordinary decision about one person, which
	* a company admin owns. A right can be inside the ceiling and denied; it
	* cannot be outside the ceiling and granted.
	*
	* Unlike the ceiling there is no null/empty distinction — an empty deny
	* list and no deny list say the same thing — so this defaults to `[]`
	* rather than being nullish.
	*/
	permissionDenies: array(PermissionKeySchema).max(128).default([])
}).refine((m) => m.companyId !== void 0 || m.customerId !== void 0, { message: "companyId is required" }).transform((m) => ({
	...m,
	companyId: m.companyId ?? m.customerId
}));
object({
	email: string().email(),
	name: string().min(1).max(200).optional().nullable(),
	password: string().min(12).optional(),
	isAdmin: boolean().default(false),
	isSupportAgent: boolean().default(false),
	/** Grants blog-authoring access (see `AppUser.isBlogAuthor`). */
	isBlogAuthor: boolean().default(false),
	/** Author bio shown on the public blog author page. */
	bio: string().max(500).optional().nullable(),
	memberships: array(MembershipSchema).optional(),
	/** @deprecated use `memberships` — kept as a single-company fallback. */
	customerId: number().int().positive().optional().nullable(),
	/** @deprecated use `memberships`. */
	permissions: array(PermissionKeySchema).max(128).default([]),
	status: _enum(["active", "disabled"]).default("active")
});
object({
	email: string().email().optional(),
	name: string().min(1).max(200).optional().nullable(),
	isAdmin: boolean().optional(),
	isSupportAgent: boolean().optional(),
	/** Grants blog-authoring access (see `AppUser.isBlogAuthor`). */
	isBlogAuthor: boolean().optional(),
	/** Author bio shown on the public blog author page. */
	bio: string().max(500).optional().nullable(),
	memberships: array(MembershipSchema).optional(),
	/** @deprecated use `memberships`. */
	customerId: number().int().positive().optional().nullable(),
	/** @deprecated use `memberships`. */
	permissions: array(PermissionKeySchema).max(128).optional(),
	status: _enum(["active", "disabled"]).optional()
});
var TICKET_PRIORITIES = [
	"low",
	"normal",
	"high",
	"urgent"
];
var TICKET_TYPES = [
	"question",
	"bug",
	"feature",
	"other"
];
var TicketPrioritySchema = _enum(TICKET_PRIORITIES);
var TicketTypeSchema = _enum(TICKET_TYPES);
object({
	subject: string().min(3).max(200),
	description: string().min(10).max(1e4),
	priority: TicketPrioritySchema.default("normal"),
	type: TicketTypeSchema.default("question"),
	projectId: number().int().positive().optional().nullable()
});
object({
	body: string().min(1).max(1e4),
	isInternal: boolean().default(false)
});
// src/lib/shop-api.ts
/**
* TDShop reads — the journal's half of product placement.
*
* Same fail-soft contract as `content-api.ts`: an unreachable shop must never
* take an article down. The difference is what "fallback" means here. An
* article's own content has a demo fallback because a page with no article is
* not a page; an advertising slot with nothing in it is simply an article
* without advertising, which is a perfectly good article. So these return
* **nothing** rather than substituting anything, and the callers render no
* section at all.
*
* ### The site-key scope, and the failure it causes
*
* These routes live under `/content/shop`, which is a DIFFERENT prefix from the
* journal's own `/content/blog`. `SiteConnectionIdentity::allows()` lets a key
* with no scopes through, but a key that carries scopes only passes the
* prefixes it lists. So a blog site key scoped to `/content/blog` + a rejected
* `/content/shop` read fails — and because everything here is fail-soft, the
* symptom is a product block that silently renders nothing.
*
* If embedded products are blank in production, check the blog connection's
* scopes before anything else.
*/
/**
* Memoised per cache generation (one article often embeds the same product
* twice), and only on success.
*
* A rejected site key is swallowed like every other failure, as it is in
* `content-api.ts`: `assertKeyAccepted` has already counted it, and the
* middleware refuses to store the page. It used to be rethrown here, which
* took the whole ARTICLE down for a product box — the opposite of the contract
* above.
*/
function read(path, fallback, label) {
	return memoisedOr(`shop:${path}`, () => readContentJson(`${contentApiBase()}${path}`), fallback, `shop ${label} (rendering nothing)`);
}
/** One product for an inline block. Null when it does not exist or is unreachable. */
function getShopProduct(slug, lang) {
	return read(`/shop/${encodeURIComponent(slug)}?lang=${lang}`, null, `product ${slug}`);
}
/**
* A resolved advertising slot.
*
* `category` passes the article's own category so an automatic slot can match
* the piece it sits in — the API treats the caller's context as the more
* specific signal and prefers it over the placement's stored selector.
*/
function getShopPlacement(key, lang, category) {
	const params = new URLSearchParams({ lang });
	if (category) params.set("category", category);
	return read(`/shop/placement/${encodeURIComponent(key)}?${params}`, emptyPlacement(key, lang), `placement ${key}`);
}
/**
* Point an offer's link at the shop's click redirect with this surface's
* attribution.
*
* `offer.url` already IS the redirect — the API builds it — so this only adds
* the query. Never rebuild the URL here: the partner tag belongs in one
* database row, not in the journal.
*/
function attributeOffers(product, lang, placement) {
	return {
		...product,
		offers: product.offers.map((offer) => {
			const params = new URLSearchParams({
				source: "blog",
				lang
			});
			if (placement) params.set("placement", placement);
			return {
				...offer,
				url: `${offer.url}?${params}`
			};
		})
	};
}
// src/components/ProductSlot.astro
createAstro("https://blog.tracht-digital.de");
var $$ProductSlot = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ProductSlot;
	const { slotKey, lang = "de", category, layout = "strip", class: className } = Astro.props;
	const placement = await getShopPlacement(slotKey, lang, category);
	const products = placement.products.map(withProductImage).map((product) => attributeOffers({
		...product,
		offers: product.offers.map((offer) => ({
			...offer,
			priceCents: null,
			priceCheckedAt: null
		}))
	}, lang, slotKey));
	return renderTemplate`${products.length > 0 ? renderTemplate`${maybeRenderHead($$result)}<aside${addAttribute(["tds-product-slot jnl-panel jnl-tone-sand", className], "class:list")}${addAttribute(placement.label, "aria-label")} data-astro-cid-vg5rydmf><p class="tds-product-slot__label" data-astro-cid-vg5rydmf>${placement.label}</p>${placement.heading ? renderTemplate`<h2 class="tds-product-slot__title" data-astro-cid-vg5rydmf>${placement.heading}</h2>` : null}<div${addAttribute(layout === "strip" ? "tds-product-strip" : "", "class")} data-astro-cid-vg5rydmf>${products.map((product) => renderTemplate`${renderComponent($$result, "ProductCard", ProductCard, {
		"image": productImageAttributes(product, lang),
		"product": product,
		"lang": lang,
		"variant": layout === "single" ? "card" : "card",
		"data-astro-cid-vg5rydmf": true
	})}`)}</div></aside>` : null}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/ProductSlot.astro", void 0);
// src/components/AdSlot.astro
createAstro("https://blog.tracht-digital.de");
var $$AdSlot = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$AdSlot;
	const { client, slot, lang = "de" } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<aside class="tds-adslot"${addAttribute(lang === "de" ? "Werbung" : "Advertisement", "aria-label")} data-astro-cid-ygkiugat><span class="tds-adslot__label" data-astro-cid-ygkiugat>${lang === "de" ? "Anzeige" : "Advertisement"}</span><ins class="adsbygoogle" style="display:block"${addAttribute(client, "data-ad-client")}${addAttribute(slot, "data-ad-slot")} data-ad-format="auto" data-full-width-responsive="true" data-astro-cid-ygkiugat></ins><script>
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  <\/script></aside>`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/AdSlot.astro", void 0);
// src/components/ProductEmbed.astro
createAstro("https://blog.tracht-digital.de");
var $$ProductEmbed = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$ProductEmbed;
	const { slug, variant, lang = "de" } = Astro.props;
	const fetched = await getShopProduct(slug, lang);
	const product = fetched ? withProductImage(fetched) : null;
	const shown = product ? attributeOffers({
		...product,
		offers: product.offers.map((offer) => ({
			...offer,
			priceCents: null,
			priceCheckedAt: null
		}))
	}, lang, "blog-inline") : null;
	return renderTemplate`${shown ? renderTemplate`${maybeRenderHead($$result)}<div class="tds-block-product" data-astro-cid-jv3m5vhh>${renderComponent($$result, "ProductCard", ProductCard, {
		"image": productImageAttributes(shown, lang),
		"product": shown,
		"lang": lang,
		"variant": variant,
		"data-astro-cid-jv3m5vhh": true
	})}</div>` : null}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/ProductEmbed.astro", void 0);
// src/components/BlockRenderer.astro
createAstro("https://blog.tracht-digital.de");
var $$BlockRenderer = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$BlockRenderer;
	const { blocks, ads = null, showAds = false, lang = "de", snippets = [], dropCap = false } = Astro.props;
	const parts = [];
	let buf = "";
	const flush = () => {
		if (buf.trim() !== "") parts.push({
			kind: "prose",
			html: buf
		});
		buf = "";
	};
	for (const block of blocks) {
		if (block.type === "adsense") {
			flush();
			parts.push({
				kind: "ad",
				slot: block.slot ?? null
			});
			continue;
		}
		if (block.type === "product") {
			flush();
			if (block.slug.trim() !== "") parts.push({
				kind: "product",
				slug: block.slug,
				variant: block.variant
			});
			continue;
		}
		if (block.type === "custom") {
			const s = snippets.find((x) => x.id === block.snippetId);
			if (!s) continue;
			if (s.kind === "embed" && typeof s.definition.html === "string") {
				flush();
				parts.push({
					kind: "raw",
					html: s.definition.html
				});
			} else if (s.kind === "preset" && typeof s.definition.type === "string") buf += await renderBlockHtml(s.definition);
			continue;
		}
		buf += await renderBlockHtml(block);
	}
	flush();
	const firstProse = parts.findIndex((p) => p.kind === "prose");
	return renderTemplate`${parts.map((part, i) => part.kind === "prose" ? renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(["tds-prose", dropCap && i === firstProse && "drop-cap"], "class:list")}>${unescapeHTML(part.html)}</div>` : part.kind === "product" ? renderTemplate`${renderComponent($$result, "ProductEmbed", $$ProductEmbed, {
		"slug": part.slug,
		"variant": part.variant,
		"lang": lang
	})}` : part.kind === "raw" ? renderTemplate`<div class="tds-block-embed">${unescapeHTML(part.html)}</div>` : showAds && ads?.publisherId ? renderTemplate`${renderComponent($$result, "AdSlot", $$AdSlot, {
		"client": ads.publisherId,
		"slot": part.slot ?? ads.slotInArticle ?? "",
		"lang": lang
	})}` : null)}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/BlockRenderer.astro", void 0);
// src/lib/articleFaq.ts
var FAQ_HEADING = /^(häufige fragen|fragen und antworten|faq|frequently asked questions|common questions)$/i;
var text = (html) => html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
/** Questions and answers from the article's FAQ section, if it has one. */
function faqFromSections(sections) {
	const section = sections.find((s) => FAQ_HEADING.test(s.heading.trim()));
	if (!section) return [];
	const out = [];
	const pieces = section.html.split(/<h3\b[^>]*>/i).slice(1);
	for (const piece of pieces) {
		const end = piece.search(/<\/h3>/i);
		if (end < 0) continue;
		const q = text(piece.slice(0, end));
		const a = text(piece.slice(end + 5));
		if (q !== "" && a !== "") out.push({
			q,
			a
		});
	}
	return out;
}
// src/lib/sections.ts
function slugify(text) {
	return text.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64) || "abschnitt";
}
function stripTags(html) {
	return html.replace(/<[^>]+>/g, "").trim();
}
function splitSections(html) {
	const matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)];
	if (matches.length === 0) return {
		intro: html,
		sections: []
	};
	const intro = html.slice(0, matches[0].index);
	const sections = [];
	const seen = /* @__PURE__ */ new Set();
	matches.forEach((m, i) => {
		const heading = stripTags(m[1]);
		let id = slugify(heading);
		while (seen.has(id)) id = `${id}-${i}`;
		seen.add(id);
		const bodyStart = (m.index ?? 0) + m[0].length;
		const bodyEnd = i + 1 < matches.length ? matches[i + 1].index : html.length;
		sections.push({
			id,
			heading,
			html: html.slice(bodyStart, bodyEnd)
		});
	});
	return {
		intro,
		sections
	};
}
// src/lib/blockSections.ts
function splitBlockSections(blocks) {
	const intro = [];
	const sections = [];
	const seen = /* @__PURE__ */ new Set();
	let current = null;
	for (const block of blocks) {
		if (block.type === "heading" && block.level === 2) {
			let id = slugify$2(block.text);
			while (seen.has(id)) id = `${id}-${sections.length}`;
			seen.add(id);
			current = {
				id,
				heading: block.text,
				blocks: []
			};
			sections.push(current);
			continue;
		}
		if (current) current.blocks.push(block);
		else intro.push(block);
	}
	return {
		intro,
		sections
	};
}
// src/components/Article.astro
createAstro("https://blog.tracht-digital.de");
var $$Article = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Article;
	const { localized, lang, posts } = Astro.props;
	const { post, bodyHtml, blocks, translated } = localized;
	const isBlocks = blocks != null;
	const snippets = isBlocks ? await blogSnippets() : [];
	const ads = await adsConfig();
	const adsMode = effectiveAdsMode(post.adsMode, ads);
	const showManualAds = adsMode === "manual" && !isBlocks;
	const showBlockAds = adsMode !== "off";
	const pfx = lang === "en" ? "/en" : "";
	const postHref = (slug) => `${pfx}/${slug}`;
	const mdSplit = isBlocks ? {
		intro: "",
		sections: []
	} : splitSections(bodyHtml);
	const blkSplit = isBlocks ? splitBlockSections(blocks) : {
		intro: [],
		sections: []
	};
	const sections = isBlocks ? blkSplit.sections.map((s) => ({
		id: s.id,
		heading: s.heading
	})) : mdSplit.sections.map((s) => ({
		id: s.id,
		heading: s.heading
	}));
	const intro = mdSplit.intro;
	const introParts = splitProductShortcodes(intro);
	const sectionParts = mdSplit.sections.map((sec) => ({
		...sec,
		parts: splitProductShortcodes(sec.html)
	}));
	const faq = isBlocks ? [] : faqFromSections(mdSplit.sections);
	const showToc = sections.length >= 2;
	const ordered = [...posts].sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
	const orderedIdx = ordered.findIndex((p) => p.slug === post.slug);
	const newerPost = orderedIdx > 0 ? ordered[orderedIdx - 1] : null;
	const olderPost = orderedIdx >= 0 && orderedIdx < ordered.length - 1 ? ordered[orderedIdx + 1] : null;
	const interestTopics = Array.from(new Set([post.category, ...(post.tags ?? "").split(",")].map((t) => t.trim().toLowerCase()).filter(Boolean)));
	const explicitCover = post.coverHint?.startsWith("http") ? post.coverHint : void 0;
	const dateLabel = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : null;
	const plain = isBlocks ? blocks.map((b) => {
		if (b.type === "paragraph" || b.type === "heading" || b.type === "quote" || b.type === "callout") return b.text;
		if (b.type === "list") return b.items.join(" ");
		if (b.type === "code") return b.code;
		return "";
	}).join(" ") : stripProductShortcodes(bodyHtml).replace(/<[^>]+>/g, " ");
	const wordCount = plain.split(/\s+/).filter(Boolean).length;
	const readingMinutes = Math.max(1, Math.round(wordCount / 220));
	const citations = Array.from(new Set([...isBlocks ? blocks.flatMap((b) => b.type === "button" && b.href ? [b.href] : []) : [...bodyHtml.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1])].filter((href) => {
		try {
			return !new URL(href).hostname.endsWith("tracht-digital.de");
		} catch {
			return false;
		}
	}))).slice(0, 10);
	const updatedLabel = post.updatedAt && post.publishedAt && Date.parse(post.updatedAt) > Date.parse(post.publishedAt) ? new Date(post.updatedAt).toLocaleDateString(lang === "de" ? "de-DE" : "en-US", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : null;
	const ogImagePath = explicitCover ?? `/og/${lang}/${post.slug}.png`;
	const imageUrl = ogImagePath.startsWith("http") ? ogImagePath : new URL(ogImagePath, siteConfig.url).toString();
	const journalLabel = "Ratgeber";
	const journalHomeUrl = `${siteConfig.url}${pfx}/`;
	const postUrl = new URL(postHref(post.slug), siteConfig.url).toString();
	const contactUrl = `https://tracht-digital.de${pfx}/#contact`;
	const metaDesc = postDescription(post.metaDescription, post.excerpt, lang);
	const tx = lang === "de" ? {
		back: "Alle Beiträge",
		read: "Min. Lesezeit",
		updated: "aktualisiert",
		contents: "Inhalt",
		tocCollapse: "Inhalt einklappen",
		tocExpand: "Inhalt ausklappen",
		aboutAuthor: "Über den Autor",
		owner: "Inhaber, Tracht Digital Solutions",
		bio: "Entwickelt Software, Websites und Digitalisierungslösungen für kleine und mittlere Unternehmen — ansässig in Schwarzenbek bei Hamburg.",
		newer: "Neuerer Artikel",
		older: "Älterer Artikel",
		nav: "Artikel-Navigation",
		allArticles: "Alle Artikel",
		rss: "RSS abonnieren",
		print: "Drucken",
		tools: "Lesewerkzeuge",
		zoomIn: "Text vergrößern",
		zoomOut: "Text verkleinern",
		focus: "Fokusmodus",
		focusTitle: "Fokusmodus (Taste F)",
		machine: "Automatisch übersetzt — das Original ist auf Englisch verfasst.",
		contactHead: "Zusammenarbeiten",
		contactLead: "Ich baue Websites, Webshops und individuelle Lösungen für Selbstständige, kleine Unternehmen und lokale Betriebe — aus Schwarzenbek bei Hamburg.",
		contactCta: "Unverbindlich anfragen"
	} : {
		back: "All posts",
		read: "min read",
		updated: "updated",
		contents: "Contents",
		tocCollapse: "Collapse contents",
		tocExpand: "Expand contents",
		aboutAuthor: "About the author",
		owner: "Owner, Tracht Digital Solutions",
		bio: "Builds software, websites and digitalization solutions for small and medium-sized businesses — based in Schwarzenbek near Hamburg.",
		newer: "Newer article",
		older: "Older article",
		nav: "Article navigation",
		allArticles: "All articles",
		rss: "Subscribe via RSS",
		print: "Print",
		tools: "Reading tools",
		zoomIn: "Larger text",
		zoomOut: "Smaller text",
		focus: "Focus mode",
		focusTitle: "Focus mode (press F)",
		machine: "Machine-translated — the original is written in German.",
		contactHead: "Work together",
		contactLead: "I build websites, online shops and custom solutions for freelancers, small companies and local businesses — from Schwarzenbek near Hamburg.",
		contactCta: "Get in touch"
	};
	const author = post.author ?? null;
	const authorName = author?.name ?? (lang === "de" ? "Tracht Digital Redaktion" : "Tracht Digital Editorial");
	const authorPageHref = author ? authorHref(lang, author.slug) : null;
	const authorAvatar = author?.avatarUrl ?? null;
	const authorBio = author?.bio ?? tx.bio;
	const authorInitials = authorName.split(/\s+/).map((w) => w[0] ?? "").join("").slice(0, 2).toUpperCase() || "TD";
	const jsonLd = [
		blogPostingSchema({
			slug: post.slug,
			title: post.title,
			excerpt: metaDesc,
			body: plain,
			category: post.category,
			publishedAt: post.publishedAt,
			updatedAt: post.updatedAt ?? null,
			lang,
			imageUrl,
			wordCount,
			readingMinutes,
			citations,
			author: author ? {
				name: author.name,
				url: authorPageHref ? new URL(authorPageHref, siteConfig.url).toString() : null
			} : null,
			tags: post.tags
		}),
		organizationSchema(),
		breadcrumbSchema([
			{
				name: journalLabel,
				url: journalHomeUrl
			},
			{
				name: post.category,
				url: new URL(categoryHref(lang, categorySlug(post.category)), siteConfig.url).toString()
			},
			{
				name: post.title,
				url: postUrl
			}
		]),
		...faq.length > 0 ? [faqPageSchema(faq)] : []
	];
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {
		"title": pageTitle(post.title),
		"description": metaDesc,
		"lang": lang,
		"ogImage": explicitCover,
		"article": {
			publishedTime: post.publishedAt,
			modifiedTime: post.updatedAt,
			author: authorName,
			section: post.category,
			slug: post.slug
		},
		"jsonLd": jsonLd,
		"sidebar": true,
		"focusable": true,
		"adsMode": adsMode,
		"reader": { printHref: `${pfx}/${post.slug}/print` },
		"hasToc": showToc
	}, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div id="reading-progress" class="fixed top-0 left-0 right-0 z-50 h-[3px] origin-left scale-x-0 bg-[var(--color-accent)]" aria-hidden="true"></div><main id="main"${addAttribute(["article-shell px-5 sm:px-6 md:px-8 py-10 lg:py-12", showToc && "has-toc"], "class:list")}>${showToc && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<nav class="toc"${addAttribute(tx.contents, "aria-label")} id="article-toc"><div class="toc-head"><p class="eyebrow toc-title">${tx.contents}</p><button type="button" class="toc-toggle" id="toc-toggle" aria-expanded="true" aria-controls="article-toc"${addAttribute(tx.tocCollapse, "title")}${addAttribute(tx.tocCollapse, "aria-label")}${addAttribute(tx.tocCollapse, "data-label-collapse")}${addAttribute(tx.tocExpand, "data-label-expand")}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"></path></svg></button></div><ol class="toc-list jnl-stack">${sections.map((sec) => renderTemplate`<li><a${addAttribute(`#${sec.id}`, "href")}${addAttribute(sec.id, "data-toc")} class="toc-link"><span class="toc-tick" aria-hidden="true"></span><span class="toc-label">${sec.heading}</span></a></li>`)}</ol></nav><script>
          (function () {
            try {
              var saved = (window.__tdsPrefs || {}).reader_toc || localStorage.getItem("tds-blog-toc");
              if (saved === "collapsed") {
                var m = document.getElementById("main");
                if (m) m.classList.add("toc-collapsed");
                var t = document.getElementById("toc-toggle");
                if (t) t.setAttribute("aria-expanded", "false");
              }
            } catch (e) {
              /* storage disabled — start expanded */
            }
          })();
        <\/script>` })}`}<article class="article-col"><div class="article-read"><div class="article-zoom"><header class="mb-7"><div class="flex flex-wrap items-center gap-3.5 mb-3.5"><p class="eyebrow" style="color: var(--color-accent);">${post.category}</p><span aria-hidden="true" class="w-1 h-1 bg-[var(--color-line)] max-sm:hidden"></span><p class="text-[0.8125rem] text-[var(--color-muted)] tabular">${dateLabel && post.publishedAt && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`<time${addAttribute(post.publishedAt, "datetime")}>${dateLabel}</time> ·${" "}` })}`}~${readingMinutes} ${tx.read}${updatedLabel && post.updatedAt && renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result) => renderTemplate`${" · "}${tx.updated} <time${addAttribute(post.updatedAt, "datetime")}>${updatedLabel}</time>` })}`}</p></div><div class="title-row"><a${addAttribute(`${pfx}/`, "href")} class="back-rail"${addAttribute(tx.back, "aria-label")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg></a><h1 class="display page-title" style="text-wrap: balance;">${post.title}</h1></div><p class="lead mt-3.5 text-[var(--color-muted)]" style="text-wrap: pretty;">${post.excerpt}</p><p class="mt-4 inline-flex items-center gap-2.5">${authorAvatar ? renderTemplate`<img${addAttribute(authorAvatar, "src")} alt="" class="w-7 h-7 rounded-full object-cover" width="28" height="28" loading="lazy">` : renderTemplate`<span aria-hidden="true" class="w-7 h-7 inline-flex items-center justify-center text-[11px] font-semibold tracking-wide" style="background: var(--tds-flat-tint); color: var(--color-primary);">${authorInitials}</span>`}${authorPageHref ? renderTemplate`<a${addAttribute(authorPageHref, "href")} class="text-[0.8125rem] font-medium link-underline">${authorName}</a>` : renderTemplate`<span class="text-[0.8125rem] font-medium">${authorName}</span>`}</p>${translated && renderTemplate`<p class="mt-4 text-[0.8125rem] text-[var(--color-muted)] border-l-2 pl-3" style="border-color: var(--color-accent);"><span aria-hidden="true">🌐 </span>${tx.machine}</p>`}</header>${explicitCover && renderTemplate`<img${addAttribute(explicitCover, "src")}${addAttribute(imageHints(explicitCover, lang)?.alt ?? post.title, "alt")}${addAttribute(imageHints(explicitCover, lang)?.srcSet, "srcset")} sizes="(min-width: 64rem) 65vw, 100vw"${addAttribute(imageHints(explicitCover, lang)?.width ?? 1440, "width")}${addAttribute(imageHints(explicitCover, lang)?.height ?? 960, "height")} loading="eager" decoding="async" class="w-full aspect-[3/2] object-cover mb-7">`}</div><div class="reader-tools-anchor"><div class="reader-tools" role="toolbar"${addAttribute(tx.tools, "aria-label")} aria-orientation="vertical"><button type="button" class="reader-tool" id="zoom-in"${addAttribute(tx.zoomIn, "aria-label")}${addAttribute(tx.zoomIn, "title")}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path><path d="M11 8v6"></path><path d="M8 11h6"></path></svg></button><button type="button" class="reader-tool" id="zoom-out"${addAttribute(tx.zoomOut, "aria-label")}${addAttribute(tx.zoomOut, "title")}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4.3-4.3"></path><path d="M8 11h6"></path></svg></button><button type="button" class="reader-tool" id="focus-toggle" aria-pressed="false"${addAttribute(tx.focus, "aria-label")}${addAttribute(tx.focusTitle, "title")}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path></svg></button><a${addAttribute(`${pfx}/${post.slug}/print`, "href")} target="_blank" rel="noopener" class="reader-tool"${addAttribute(tx.print, "aria-label")}${addAttribute(tx.print, "title")}><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><path d="M6 14h12v8H6z"></path></svg></a></div></div><div class="article-zoom mt-4 pb-10">${isBlocks ? blkSplit.intro.length > 0 && renderTemplate`${renderComponent($$result, "BlockRenderer", $$BlockRenderer, {
		"blocks": blkSplit.intro,
		"ads": ads,
		"showAds": showBlockAds,
		"lang": lang,
		"snippets": snippets,
		"dropCap": true
	})}` : introParts.map((part, i) => part.kind === "html" ? renderTemplate`<div${addAttribute(["tds-prose", i === 0 && "drop-cap"], "class:list")}>${unescapeHTML(part.html)}</div>` : renderTemplate`${renderComponent($$result, "ProductEmbed", $$ProductEmbed, {
		"slug": part.slug,
		"variant": part.variant,
		"lang": lang
	})}`)}${showManualAds && ads.slotInArticle && renderTemplate`${renderComponent($$result, "AdSlot", $$AdSlot, {
		"client": ads.publisherId,
		"slot": ads.slotInArticle,
		"lang": lang
	})}`}${isBlocks ? blkSplit.sections.map((sec) => renderTemplate`<section class="article-sec"><h2${addAttribute(sec.id, "id")}><button class="sec-head" aria-expanded="true"${addAttribute(`${sec.id}-body`, "aria-controls")}><span>${sec.heading}</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg></button></h2><div class="sec-body"${addAttribute(`${sec.id}-body`, "id")}><div class="sec-body-inner">${renderComponent($$result, "BlockRenderer", $$BlockRenderer, {
		"blocks": sec.blocks,
		"ads": ads,
		"showAds": showBlockAds,
		"lang": lang,
		"snippets": snippets
	})}</div></div></section>`) : sectionParts.map((sec) => renderTemplate`<section class="article-sec"><h2${addAttribute(sec.id, "id")}><button class="sec-head" aria-expanded="true"${addAttribute(`${sec.id}-body`, "aria-controls")}><span>${sec.heading}</span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg></button></h2><div class="sec-body"${addAttribute(`${sec.id}-body`, "id")}><div class="sec-body-inner">${sec.parts.map((part) => part.kind === "html" ? renderTemplate`<div class="tds-prose">${unescapeHTML(part.html)}</div>` : renderTemplate`${renderComponent($$result, "ProductEmbed", $$ProductEmbed, {
		"slug": part.slug,
		"variant": part.variant,
		"lang": lang
	})}`)}</div></div></section>`)}${showManualAds && ads.slotEndArticle && renderTemplate`${renderComponent($$result, "AdSlot", $$AdSlot, {
		"client": ads.publisherId,
		"slot": ads.slotEndArticle,
		"lang": lang
	})}`}</div></div><div class="jnl-article-end"><aside class="focus-hide jnl-panel jnl-tone-accent flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"${addAttribute(tx.contactHead, "aria-label")}><div><p class="eyebrow mb-1.5">${tx.contactHead}</p><p class="text-sm text-[var(--color-muted)]" style="max-width: 44ch; text-wrap: pretty;">${tx.contactLead}</p></div><a${addAttribute(contactUrl, "href")} class="btn-flat shrink-0" data-track="article-contact"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16"></rect><path d="m22 6-10 7L2 6"></path></svg><span>${tx.contactCta}</span></a></aside><aside class="focus-hide jnl-panel jnl-tone-tint grid grid-cols-[64px_1fr] gap-5 items-start">${authorAvatar ? renderTemplate`<img${addAttribute(authorAvatar, "src")} alt="" class="w-16 h-16 rounded-full object-cover" width="64" height="64" loading="lazy">` : renderTemplate`<span aria-hidden="true" class="w-16 h-16 inline-flex items-center justify-center text-lg font-semibold tracking-wide text-white" style="background: var(--color-surface-navy); font-family: var(--font-display);">${authorInitials}</span>`}<div><p class="eyebrow mb-2">${tx.aboutAuthor}</p><p class="font-semibold">${authorPageHref ? renderTemplate`<a${addAttribute(authorPageHref, "href")} class="link-underline">${authorName}</a>` : authorName}${!author && renderTemplate`<span class="font-normal text-sm text-[var(--color-muted)]">· ${tx.owner}</span>`}</p><p class="text-sm leading-relaxed text-[var(--color-muted)] mt-2" style="text-wrap: pretty;">${authorBio}</p></div></aside>${renderComponent($$result, "ProductSlot", $$ProductSlot, {
		"class": "focus-hide",
		"slotKey": "blog-article-end",
		"lang": lang,
		"category": post.category
	})}${renderComponent($$result, "RelatedArticles", $$RelatedArticles, {
		"class": "focus-hide",
		"posts": posts,
		"currentSlug": post.slug,
		"currentCategory": post.category,
		"lang": lang
	})}${renderComponent($$result, "TagList", $$TagList, {
		"class": "focus-hide jnl-panel jnl-tone-sand",
		"tags": post.tags,
		"lang": lang,
		"label": "Tags"
	})}${(newerPost || olderPost) && renderTemplate`<nav class="focus-hide jnl-panel jnl-tone-tint grid sm:grid-cols-2 gap-px"${addAttribute(tx.nav, "aria-label")}>${newerPost ? renderTemplate`<a${addAttribute(postHref(newerPost.slug), "href")} class="jnl-tile block px-5 py-4 group"><p class="eyebrow mb-2">← ${tx.newer}</p><p class="display-tight text-lg group-hover:text-[var(--color-primary)] transition-colors">${newerPost.title}</p></a>` : renderTemplate`<span class="hidden sm:block" aria-hidden="true"></span>`}${olderPost && renderTemplate`<a${addAttribute(postHref(olderPost.slug), "href")} class="jnl-tile block px-5 py-4 group sm:text-right"><p class="eyebrow mb-2">${tx.older} →</p><p class="display-tight text-lg group-hover:text-[var(--color-primary)] transition-colors">${olderPost.title}</p></a>`}</nav>`}<footer class="jnl-panel jnl-tone-sand flex flex-wrap items-baseline justify-between gap-4 text-sm"><a${addAttribute(`${pfx}/`, "href")} class="link-underline text-[var(--color-accent)]">← ${tx.allArticles}</a><a${addAttribute(`${pfx}/rss`, "href")} class="link-underline text-[var(--color-muted)]">${tx.rss}</a></footer></div></article></main>${renderScript($$result, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/Article.astro?astro&type=script&index=0&lang.ts")}${renderScript($$result, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/Article.astro?astro&type=script&index=1&lang.ts")}${renderScript($$result, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/Article.astro?astro&type=script&index=2&lang.ts")}<div hidden${addAttribute(JSON.stringify(interestTopics), "data-interest-topics")}></div>${renderScript($$result, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/Article.astro?astro&type=script&index=3&lang.ts")}` })}`;
}, "/home/runner/work/tds-blog-frontend/tds-blog-frontend/src/components/Article.astro", void 0);
export { $$Article as t };
