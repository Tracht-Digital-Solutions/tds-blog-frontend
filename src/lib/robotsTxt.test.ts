import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * `public/robots.txt` is served verbatim — nothing but this test reads it
 * before a crawler does.
 *
 * Until 2026-10-02 this file was eight lines and named no AI agent at all,
 * while the marketing site and the journal both did. Nothing was broken and
 * nothing reported it: the journal was absent from the engines that read the named groups.
 * answers.
 *
 * Two rules. The search and fetch agents behind AI answers (OpenAI, Anthropic,
 * Perplexity, Google, Apple, Meta AI, DuckDuckGo, Mistral) are allowed by
 * name: blocking one takes the site out of that engine's answers, and no
 * report anywhere would say so. Googlebot and Bingbot — which also feed AI
 * Overviews, Copilot and ChatGPT search — fall under `*`. And every path in
 * `CLOSED_PATHS` is disallowed in EVERY group, because a crawler obeys only
 * the group that names it.
 */
const robots = readFileSync(resolve(process.cwd(), "public/robots.txt"), "utf8");

interface Group {
  agents: string[];
  allow: string[];
  disallow: string[];
}

/** Consecutive `User-agent` lines open one group; the rules after them belong to it. */
function parse(text: string): Group[] {
  const groups: Group[] = [];
  let current: Group | null = null;
  let previousWasAgent = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, "").trim();
    if (!line) continue;
    const colon = line.indexOf(":");
    const field = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    if (field === "user-agent") {
      if (!current || !previousWasAgent) {
        current = { agents: [], allow: [], disallow: [] };
        groups.push(current);
      }
      current.agents.push(value);
      previousWasAgent = true;
      continue;
    }
    previousWasAgent = false;
    if (field === "allow") current?.allow.push(value);
    if (field === "disallow") current?.disallow.push(value);
  }
  return groups;
}

const groups = parse(robots);
const groupFor = (agent: string) =>
  groups.find((group) => group.agents.some((name) => name.toLowerCase() === agent.toLowerCase()));

/**
 * Every agent the file has to name, in the three ranks the file documents:
 * answer engines whose absence removes the site from their answers, retired
 * names kept so an old crawler reads the same rules, and the newer answer
 * surfaces. Dataset-only crawlers are deliberately absent and stay governed by
 * the permissive `*` group — see the comment at the top of `robots.txt`.
 */
const ANSWER_AGENTS = [
  // OpenAI, Anthropic, Perplexity, Google, Apple
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  // Retired names
  "Claude-Web",
  "anthropic-ai",
  // Meta AI, DuckDuckGo, Mistral
  "meta-externalagent",
  "meta-externalfetcher",
  "DuckAssistBot",
  "MistralAI-User",
] as const;

/**
 * Closed in EVERY group. `/tds/` is token-gated host control with no index
 * value; the prefix deliberately does not cover `/tds-runtime.json`.
 */
const CLOSED_PATHS = ["/install/", "/tds/"] as const;

describe("robots.txt", () => {
  it("lets every other crawler in", () => {
    expect(groupFor("*")?.allow).toContain("/");
  });

  it.each(ANSWER_AGENTS)("names %s and allows it the site", (agent) => {
    const group = groupFor(agent);
    expect(group, agent).toBeDefined();
    expect(group?.allow, agent).toContain("/");
  });

  it.each(CLOSED_PATHS)("keeps %s out of every group", (path) => {
    for (const group of groups) {
      expect(group.disallow, group.agents.join(", ")).toContain(path);
    }
  });

  it("never disallows /og/", () => {
    // It was disallowed in every group once, which blocked the site.s own
    // social images: /og/{lang}/{slug}.png is the og:image of every article
    // and the image of its BlogPosting. Shares rendered without a preview and
    // nothing anywhere reported it.
    for (const group of groups) {
      expect(group.disallow, group.agents.join(", ")).not.toContain("/og/");
    }
  });

  it("leaves /tds-runtime.json reachable", () => {
    for (const group of groups) {
      expect(group.disallow, group.agents.join(", ")).not.toContain("/tds-runtime.json");
    }
  });

  it("never closes the whole site to anyone", () => {
    for (const group of groups) {
      expect(group.disallow, group.agents.join(", ")).not.toContain("/");
    }
  });

  it("points at the sitemap index on the production origin", () => {
    expect(robots).toMatch(/^Sitemap: https:\/\/blog\.tracht-digital\.de\/sitemap-index\.xml$/m);
  });
});
