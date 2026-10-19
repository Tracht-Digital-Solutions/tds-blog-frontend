import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The audit itself ships in tds-shared (`tds-geo-audit`), which pins its
 * check list; this repo keeps only `scripts/geo-audit.profile.mjs`. The
 * profile is read as TEXT and never imported, so a test run cannot start
 * an audit. What is asserted here is that the profile agrees with this
 * site's own robots.txt and refusals.
 */
const script = readFileSync(resolve(process.cwd(), "scripts/geo-audit.profile.mjs"), "utf8");

/**
 * An array literal, read without evaluating the module. None of these arrays
 * nests a bracket, so "up to the next ]" is exact and works for the one-line
 * and the multi-line form alike.
 */
function arrayLiteral(source: string, name: string): string[] {
  const match = source.match(new RegExp(`(?:const ${name} = |\\b${name}: )\\[([^\\]]*)\\]`));
  if (!match) throw new Error(`${name} not found in the audit profile`);
  return [...match[1]!.matchAll(/"([^"]+)"/g)].map((m) => m[1]!);
}

describe("geo-audit profile", () => {
  it("names the answer agents robots.txt is tested against", () => {
    // Both files carry the list; a name added to one and not the other means
    // the audit passes a robots.txt the contract test would reject.
    const robots = readFileSync(resolve(process.cwd(), "public/robots.txt"), "utf8");
    for (const agent of arrayLiteral(script, "agents")) {
      if (agent === "*") continue;
      expect(robots, agent).toMatch(new RegExp(`^User-agent: ${agent}$`, "mi"));
    }
  });

  it("closes the same paths the robots.txt test closes", () => {
    expect(arrayLiteral(script, "requiredDisallow")).toEqual(["/install/", "/tds/"]);
  });

  it("treats a posting as the page entity", () => {
    // An article's graph puts the date on the `BlogPosting`; the
    // `mainEntityOfPage` stub beside it carries none. Looking only for
    // `WebPage` would report every article as undated.
    expect(script).toContain("\"BlogPosting\"");
  });
});
