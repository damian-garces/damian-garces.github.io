import { useEffect, useRef, useState, type FormEvent } from "react";
import { submitContactForm, isValidEmail, type ContactPayload } from "../../lib/contact";
import { loadHCaptcha, HCAPTCHA_SITE_KEY } from "../../lib/hcaptcha";

/** How long the "Message sent." confirmation stays up before the form reappears, ready for another message. */
const SUCCESS_RESET_DELAY_MS = 8000;

interface ContactFormLabels {
  nameLabel: string;
  emailLabel: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  sendLabel: string;
  successTitle: string;
  successSubtitle: string;
  errorEmail: string;
  errorCaptcha: string;
  errorGeneric: string;
}

interface ContactFormProps {
  labels: ContactFormLabels;
  accessKey: string;
}

type Status = "idle" | "submitting" | "success" | "error";

const inputStyle: React.CSSProperties = {
  background: "var(--field-bg)",
  border: "1px solid var(--border-strong)",
  borderRadius: 10,
  padding: "13px 14px",
  color: "var(--text)",
  fontSize: 15,
  outline: "none",
  width: "100%",
  transition: "border-color .2s ease, background .2s ease",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 11,
  letterSpacing: ".1em",
  textTransform: "uppercase",
  color: "var(--faint)",
};

export default function ContactForm({ labels, accessKey }: ContactFormProps) {
  const [form, setForm] = useState<ContactPayload>({ name: "", email: "", subject: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [emailError, setEmailError] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  const captchaContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);

  // Render the hCaptcha widget once the script is ready. Runs client-side
  // only (this whole component is a client:visible island), so no SSR guard
  // is needed for `window`/`document` here.
  useEffect(() => {
    let cancelled = false;
    loadHCaptcha().then((hcaptcha) => {
      if (cancelled || !captchaContainerRef.current || widgetIdRef.current !== undefined) return;
      widgetIdRef.current = hcaptcha.render(captchaContainerRef.current, { sitekey: HCAPTCHA_SITE_KEY, theme: "dark" });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setField = (key: keyof ContactPayload) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    if (key === "email") setEmailError(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidEmail(form.email)) {
      setEmailError(true);
      return;
    }

    const captchaToken = window.hcaptcha?.getResponse(widgetIdRef.current) ?? "";
    if (captchaToken === "") {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);

    setStatus("submitting");
    const result = await submitContactForm(accessKey, form, honeypot, captchaToken);
    window.hcaptcha?.reset(widgetIdRef.current);
    setStatus(result.ok ? "success" : "error");
  };

  // After a successful send, clear the form and bring it back so a visitor
  // can see the confirmation, then send another message without reloading.
  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => {
      setForm({ name: "", email: "", subject: "", message: "" });
      setHoneypot("");
      setStatus("idle");
    }, SUCCESS_RESET_DELAY_MS);
    return () => clearTimeout(timer);
  }, [status]);

  if (status === "success") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          padding: "40px 0",
          textAlign: "center",
        }}
      >
        <span
          style={{
            width: 54,
            height: 54,
            borderRadius: "50%",
            border: "1.5px solid var(--accent)",
            display: "grid",
            placeItems: "center",
            color: "var(--accent-text)",
            fontSize: 24,
          }}
        >
          ✓
        </span>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 20 }}>{labels.successTitle}</div>
        <div style={{ fontSize: 14, color: "var(--dim)" }}>{labels.successSubtitle}</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }} noValidate>
      {/* Honeypot: invisible to real visitors, only a bot filling every field blindly would fill this. */}
      <input
        type="text"
        name="botcheck"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <label style={{ flex: "1 1 180px", display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={labelStyle}>{labels.nameLabel}</span>
          <input required value={form.name} onChange={setField("name")} placeholder="Jane Doe" style={inputStyle} />
        </label>
        <label style={{ flex: "1 1 180px", display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={labelStyle}>{labels.emailLabel}</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={setField("email")}
            placeholder="jane@company.com"
            aria-invalid={emailError}
            style={{ ...inputStyle, borderColor: emailError ? "#E5484D" : inputStyle.borderColor }}
          />
        </label>
      </div>
      {emailError && (
        <p role="alert" style={{ margin: 0, color: "#E5484D", fontSize: 13 }}>
          {labels.errorEmail}
        </p>
      )}
      <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={labelStyle}>{labels.subjectLabel}</span>
        <input value={form.subject} onChange={setField("subject")} placeholder={labels.subjectPlaceholder} style={inputStyle} />
      </label>
      <label style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={labelStyle}>{labels.messageLabel}</span>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={setField("message")}
          placeholder={labels.messagePlaceholder}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
        />
      </label>
      <div ref={captchaContainerRef} />
      {captchaError && (
        <p role="alert" style={{ margin: 0, color: "#E5484D", fontSize: 13 }}>
          {labels.errorCaptcha}
        </p>
      )}
      {status === "error" && (
        <p role="alert" style={{ margin: 0, color: "#E5484D", fontSize: 13 }}>
          {labels.errorGeneric}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        data-magnetic="1"
        style={{
          alignSelf: "flex-start",
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "var(--accent)",
          color: "var(--accent-contrast)",
          border: "none",
          padding: "14px 26px",
          borderRadius: 11,
          fontWeight: 600,
          fontSize: 15,
          cursor: status === "submitting" ? "wait" : "pointer",
          opacity: status === "submitting" ? 0.7 : 1,
        }}
      >
        {labels.sendLabel} <span style={{ fontFamily: "var(--font-mono)" }}>→</span>
      </button>
    </form>
  );
}
