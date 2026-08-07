/** Typed contact form payload, decoupled from the Web3Forms wire format. */
export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type SubmitResult = { ok: true } | { ok: false; reason: "validation" | "network" };

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email);
}

/**
 * Submits the contact form to Web3Forms. Kept separate from the React
 * component so the request/validation logic is independently testable and
 * not tangled with UI state.
 */
export async function submitContactForm(accessKey: string, payload: ContactPayload): Promise<SubmitResult> {
  if (!isValidEmail(payload.email) || payload.name.trim() === "" || payload.message.trim() === "") {
    return { ok: false, reason: "validation" };
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
