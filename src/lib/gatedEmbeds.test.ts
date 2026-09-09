import { describe, expect, it } from "vitest";

import { renderBlockHtml } from "./renderBlock";

/**
 * The consent gate in front of a third-party video.
 *
 * The property under test is an ABSENCE, which is why it needs a test: an
 * `<iframe>` contacts its origin the moment it is parsed, so the old markup
 * reached Google or Vimeo on every article that carried a video — before any
 * banner was answered, and whatever the privacy policy said. That failure is
 * invisible on the page. It looks like a video.
 *
 * `youtube-nocookie.com` is not the fix and never was: it narrows what gets
 * stored, not whether the connection happens, and the IP address has gone by
 * then either way.
 */
const video = {
  type: "video" as const,
  provider: "youtube" as const,
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
};

describe("the video embed gate", () => {
  it("renders no iframe and no third-party URL that a browser would fetch", async () => {
    const html = await renderBlockHtml(video);

    expect(html).not.toMatch(/<iframe/);
    // The embed URL is present only as a data attribute, which nothing fetches.
    // Anchored on the whitespace before the attribute name: `data-embed-src="…"`
    // contains the literal `src="…"`, so an unanchored pattern matches the very
    // thing this asserts the absence of.
    expect(html).not.toMatch(/\ssrc="https:\/\/www\.youtube-nocookie\.com/);
    expect(html).toMatch(/data-embed-src="https:\/\/www\.youtube-nocookie\.com\/embed\/dQw4w9WgXcQ"/);
  });

  it("marks itself for the gating script and names the category", async () => {
    const html = await renderBlockHtml(video);
    expect(html).toMatch(/data-consent-embed="marketing"/);
  });

  it("names the recipient before the request could happen", async () => {
    // The only moment at which a decision is still possible.
    const html = await renderBlockHtml(video);
    expect(html).toMatch(/YouTube/);
    expect(html).toMatch(/IP-Adresse/);
  });

  it("ships its buttons hidden and a working link beside them", async () => {
    // Without the script the buttons can do nothing, and a dead button is
    // worse than no button. The link works either way.
    const html = await renderBlockHtml(video);
    expect(html).toMatch(/data-embed-load hidden/);
    expect(html).toMatch(/data-embed-settings hidden/);
    expect(html).toMatch(/href="https:\/\/www\.youtube\.com\/watch\?v=dQw4w9WgXcQ"/);
    expect(html).toMatch(/rel="noopener noreferrer"/);
  });

  it("speaks the language it was given", async () => {
    const en = await renderBlockHtml(video, "en");
    expect(en).toMatch(/External content/);
    expect(en).toMatch(/Watch on YouTube/);
    expect(en).not.toMatch(/Externer Inhalt/);
  });

  it("gates Vimeo on the same terms", async () => {
    const html = await renderBlockHtml({
      type: "video",
      provider: "vimeo",
      url: "https://vimeo.com/76979871",
    });
    expect(html).not.toMatch(/<iframe/);
    expect(html).toMatch(/data-embed-src="https:\/\/player\.vimeo\.com\/video\/76979871"/);
    expect(html).toMatch(/Vimeo/);
  });

  it("still renders nothing for a URL it cannot parse", async () => {
    // Unchanged behaviour, restated because the gate is new: a card promising
    // a video that has no id would be worse than the silence.
    const html = await renderBlockHtml({
      type: "video",
      provider: "youtube",
      url: "https://example.invalid/not-a-video",
    });
    expect(html).toBe("");
  });
});
