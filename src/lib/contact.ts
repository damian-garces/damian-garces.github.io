/** Typed contact form payload, decoupled from the Web3Forms wire format. */
export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

export type SubmitFailureReason = "validation" | "captcha" | "network";
export type ContactSubmitResult = { ok: true } | { ok: false; reason: SubmitFailureReason };

/**
 * Submits the contact form to Web3Forms. Kept separate from the React
 * component so the request/validation logic is independently testable and
 * not tangled with UI state.
 *
 * `honeypot` is the value of a field real visitors never see or fill (it's
 * hidden via CSS, not `type="hidden"`, which basic bots skip). If a bot
 * fills it anyway, we skip the network call entirely but still report
 * success — so the bot has no signal that its submission was discarded.
 *
 * `captchaToken` is the hCaptcha response token (see lib/hcaptcha.ts). It's
 * required — Web3Forms rejects the submission server-side without one once
 * hCaptcha is enabled on the form's dashboard settings.
 */
export async function submitContactForm(
  accessKey: string,
  payload: ContactPayload,
  honeypot = "",
  captchaToken = "",
): Promise<ContactSubmitResult> {
  if (!isValidEmail(payload.email) || payload.name.trim() === "" || payload.message.trim() === "") {
    return { ok: false, reason: "validation" };
  }

  if (honeypot.trim() !== "") {
    return { ok: true };
  }

  if (captchaToken.trim() === "") {
    return { ok: false, reason: "captcha" };
  }

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        name: payload.name,
        email: payload.email,
        subject: payload.subject || `Portfolio contact from ${payload.name}`,
        message: payload.message,
        // Web3Forms also recognizes this field name as its own honeypot
        // convention and discards matching submissions server-side too.
        botcheck: honeypot,
        "h-captcha-response": captchaToken,
      }),
    });

    if (!response.ok) return { ok: false, reason: "network" };
    const data: unknown = await response.json();
    const success = typeof data === "object" && data !== null && "success" in data && (data as { success: unknown }).success === true;
    return success ? { ok: true } : { ok: false, reason: "network" };
  } catch {
    return { ok: false, reason: "network" };
  }
}
