import { useState, type SubmitEvent } from "react";
import { Spinner } from "@tracht-digital-solutions/tds-shared/components";
import { runtimeSetting } from "@tracht-digital-solutions/tds-shared/api";

/**
 * Newsletter block from the design-system blog kit: inverse ink panel,
 * single e-mail field, flat white submit. There is no dedicated
 * newsletter backend, so the signup posts a well-formed message to
 * tds-contact-api (same endpoint + schema as the marketing contact
 * form) — Julian gets a signup notification by mail.
 */

/**
 * Fallback endpoint, baked in by Vite at build time. A host configured with
 * `/install/` overrides it through `tds-runtime.json` — see the
 * matching note in the landingpage's ContactForm.
 */
const CONTACT_API_URL =
  (import.meta.env.PUBLIC_CONTACT_API_URL as string | undefined) ??
  "https://api.tracht-digital.de/contact";

const COPY = {
  de: {
    eyebrow: "Newsletter",
    title: "Digitalisierung, einmal im Monat.",
    body: "Neue Artikel, Praxisbeispiele und Werkzeuge für den Mittelstand — direkt in Ihr Postfach. Kein Spam, jederzeit abbestellbar.",
    placeholder: "Ihre E-Mail-Adresse",
    cta: "Anmelden",
    done: "Vielen Dank — wir haben Ihre Anmeldung erhalten und melden uns in Kürze.",
    error: "Das hat leider nicht geklappt. Bitte versuchen Sie es später noch einmal.",
    legal:
      "Mit dem Absenden stimmen Sie zu, dass wir Sie per E-Mail kontaktieren. Abmeldung jederzeit möglich.",
    message: "Newsletter-Anmeldung über das Journal (blog.tracht-digital.de).",
  },
  en: {
    eyebrow: "Newsletter",
    title: "Digitalization, once a month.",
    body: "New articles, case studies and tools for SMEs — straight to your inbox. No spam, unsubscribe anytime.",
    placeholder: "Your email address",
    cta: "Subscribe",
    done: "Thank you — we received your signup and will be in touch shortly.",
    error: "That didn't work. Please try again later.",
    legal: "By submitting you agree that we may contact you by email. Unsubscribe anytime.",
    message: "Newsletter signup via the Journal (blog.tracht-digital.de).",
  },
} as const;

export default function NewsletterSignup({ lang }: { lang: "de" | "en" }) {
  const t = COPY[lang];
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "done" | "error">("idle");

  const submit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (!email.trim() || state === "submitting") return;
    setState("submitting");
    try {
      const endpoint = await runtimeSetting("contactUrl", CONTACT_API_URL);
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter Journal",
          email: email.trim(),
          message: t.message,
          consent: true,
        }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <section style={{ background: "var(--color-surface-ink)", color: "#fff", padding: "52px 0" }}>
      <div className="tds-shell grid lg:grid-cols-2 items-center" style={{ gap: 40 }}>
        <div>
          <p className="eyebrow" style={{ color: "var(--color-accent-pink)", marginBottom: 18 }}>
            {t.eyebrow}
          </p>
          <h2
            className="display"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.375rem)", margin: 0, textWrap: "balance" }}
          >
            {t.title}
          </h2>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.6,
              color: "rgba(255,255,255,.7)",
              margin: "12px 0 0",
              maxWidth: "48ch",
            }}
          >
            {t.body}
          </p>
        </div>
        <div>
          {state === "done" ? (
            /* The success case replaces the form outright. Without a live
               region that is a submit followed by silence: the control the
               user was on is gone and nothing says why. `role="status"`
               announces the confirmation where it appears. */
            <p
              role="status"
              style={{
                fontSize: 16,
                lineHeight: 1.6,
                fontWeight: 500,
                margin: 0,
                padding: "16px 20px",
                background: "rgba(255,255,255,.12)",
              }}
            >
              {t.done}
            </p>
          ) : (
            <form onSubmit={submit} className="newsletter-form">
              <input
                className="newsletter-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.placeholder}
                aria-label={t.placeholder}
                aria-invalid={state === "error" || undefined}
                aria-describedby="newsletter-note"
              />
              <button
                type="submit"
                className="btn-flat"
                disabled={state === "submitting"}
                aria-busy={state === "submitting"}
                style={{ height: 48, background: "#fff", color: "var(--color-surface-ink)" }}
              >
                {state === "submitting" ? (<><Spinner size="sm" /> {t.cta}</>) : t.cta}
              </button>
            </form>
          )}
          {/* One line carries two jobs: the standing legal note (which the
              field points at via aria-describedby) and, on failure, the
              error. The error used to replace the text with no role at all,
              so a submit that failed changed a paragraph nothing was
              listening to. `role="alert"` appears only in the error state,
              which is what makes the swap an announcement.

              .45 white on --color-surface-ink measured 4.49:1 at 12px —
              under AA by a hundredth. .55 lands at ~5.6:1 and is not
              distinguishable from the old value on the panel. */}
          <p
            id="newsletter-note"
            role={state === "error" ? "alert" : undefined}
            style={{
              fontSize: 12,
              lineHeight: 1.5,
              color: state === "error" ? "var(--color-accent-pink)" : "rgba(255,255,255,.55)",
              margin: "14px 0 0",
            }}
          >
            {state === "error" ? t.error : t.legal}
          </p>
        </div>
      </div>
    </section>
  );
}
