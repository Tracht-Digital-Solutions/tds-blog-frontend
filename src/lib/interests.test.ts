// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { necessaryOnly } from "@tracht-digital-solutions/tds-shared/consent";
import { writeConsent } from "@tracht-digital-solutions/tds-shared/consent/store";
import { bumpInterests, readInterests, trackInterests as track } from "./interests";

const cookie = () => readInterests(document.cookie);
// Every call subscribes to consent changes; unsubscribe after each test, or a
// later test's consent event is counted by every earlier page as well.
const stops: Array<() => void> = [];
const trackInterests = (topics: string[]) => {
  const stop = track(topics);
  stops.push(stop);
  return stop;
};

afterEach(() => {
  for (const stop of stops.splice(0)) stop();
});

beforeEach(() => {
  localStorage.clear();
  document.cookie = "tds-interests=; Max-Age=0; Path=/";
});

describe("trackInterests", () => {
  it("stores nothing without the Komfort consent", () => {
    trackInterests(["seo"]);
    expect(document.cookie).not.toContain("tds-interests");
  });

  it("deletes a profile written before consent was asked for", () => {
    document.cookie = `tds-interests=${encodeURIComponent('{"seo":3}')}; Path=/`;
    trackInterests(["seo"]);
    expect(document.cookie).not.toContain("tds-interests");
  });

  it("counts the article once consent arrives, and forgets on withdrawal", () => {
    const stop = trackInterests(["seo", "astro"]);
    writeConsent({ ...necessaryOnly(), functional: true }, "de");
    expect(cookie()).toEqual({ seo: 1, astro: 1 });
    writeConsent(necessaryOnly(), "de");
    expect(document.cookie).not.toContain("tds-interests");
    stop();
    writeConsent({ ...necessaryOnly(), functional: true }, "de");
    expect(document.cookie).not.toContain("tds-interests");
  });
});

describe("bumpInterests", () => {
  it("caps each weight and keeps the strongest twelve", () => {
    const many = Object.fromEntries(Array.from({ length: 14 }, (_, i) => [`t${i}`, i + 1]));
    const next = bumpInterests({ ...many, seo: 50 }, ["seo"]);
    expect(next.seo).toBe(50);
    expect(Object.keys(next)).toHaveLength(12);
    expect(next.t0).toBeUndefined();
  });
});
