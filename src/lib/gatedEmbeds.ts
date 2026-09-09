import {
  consentGranted,
  onConsentChange,
  openConsentSettings,
} from "@tracht-digital-solutions/tds-shared/consent/store";

/**
 * Upgrade the consent gates in front of third-party video embeds.
 *
 * ### Why the embed is not in the document to begin with
 *
 * An `<iframe>` contacts its origin the moment it is parsed. `youtube-nocookie`
 * narrows what gets *stored*; it does not stop the connection, and by the time
 * anything could intervene the visitor's IP address and user agent have already
 * reached Google. So the server renders a card, and the frame is created here,
 * after there is a consent to create it under.
 *
 * ### Why this module imports `/consent/store` and not `/consent`
 *
 * `/consent` re-exports the React components, so its bundle imports React on
 * line one. This runs on every article that embeds a video; pulling a UI
 * framework in to answer a boolean would be a real cost for nothing.
 * `/consent/store` is the same store without that half — `tds-shared`'s
 * `consentStoreEntry.test.ts` fails if anything ever reaches React through it.
 *
 * ### Two ways past the gate, and they differ in kind
 *
 * "Inhalt laden" loads *this* embed, now. That click is a specific, informed
 * consent for this one element — the recipient is named directly above the
 * button — and it is deliberately **not** written to storage: the visitor
 * agreed to one video, not to a standing permission. "Dauerhaft entscheiden"
 * opens the settings, where a standing consent can be given and taken back.
 *
 * Without JavaScript the card still shows who the recipient would be and links
 * to the video at its source. The two buttons ship `hidden` and are revealed
 * here, because a button that cannot do anything is worse than no button.
 */

const CATEGORY = "marketing";

function buildFrame(host: HTMLElement): void {
  const src = host.dataset.embedSrc;
  if (!src) return;

  const frame = document.createElement("iframe");
  frame.src = src;
  frame.loading = "lazy";
  frame.allowFullscreen = true;
  frame.title = host.dataset.embedTitle || "Video";

  host.replaceChildren(frame);
  host.classList.remove("consent-placeholder");
  host.removeAttribute("data-consent-embed");
}

/** Every gate still waiting on this page. */
const gates = (): HTMLElement[] => [
  ...document.querySelectorAll<HTMLElement>(`[data-consent-embed="${CATEGORY}"]`),
];

export function initGatedEmbeds(): void {
  const found = gates();
  if (found.length === 0) return;

  if (consentGranted(CATEGORY)) {
    found.forEach(buildFrame);
    return;
  }

  for (const host of found) {
    // Revealed only now: without a script these do nothing, and the link
    // beside them is the version that works either way.
    for (const button of host.querySelectorAll<HTMLElement>("[data-embed-load], [data-embed-settings]")) {
      button.hidden = false;
    }

    host.querySelector("[data-embed-load]")?.addEventListener("click", () => buildFrame(host));
    host
      .querySelector("[data-embed-settings]")
      ?.addEventListener("click", () => openConsentSettings());
  }

  // A standing consent given in the dialog opens every remaining gate, without
  // a reload — the visitor came here to watch something.
  onConsentChange((record) => {
    if (record.choices[CATEGORY]) gates().forEach(buildFrame);
  });
}
