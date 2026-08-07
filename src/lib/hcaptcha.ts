/**
 * hCaptcha loader + typings. Uses Web3Forms' own shared, zero-config
 * sitekey for the free plan — no personal hCaptcha account is required.
 * https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha
 */
export const HCAPTCHA_SITE_KEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";

interface HCaptchaRenderOptions {
  sitekey: string;
  theme?: "light" | "dark";
  size?: "normal" | "compact" | "invisible";
}

interface HCaptchaApi {
  render(container: HTMLElement, options: HCaptchaRenderOptions): string;
  getResponse(widgetId?: string): string;
  reset(widgetId?: string): void;
}

declare global {
  interface Window {
    hcaptcha?: HCaptchaApi;
    __onHCaptchaLoad?: () => void;
  }
}

let loadPromise: Promise<HCaptchaApi> | null = null;

/** Injects the hCaptcha script once (memoized) and resolves with the ready API. */
export function loadHCaptcha(): Promise<HCaptchaApi> {
  if (window.hcaptcha) return Promise.resolve(window.hcaptcha);

  if (!loadPromise) {
    loadPromise = new Promise((resolve) => {
      window.__onHCaptchaLoad = () => resolve(window.hcaptcha!);
      const script = document.createElement("script");
      script.src = "https://js.hcaptcha.com/1/api.js?onload=__onHCaptchaLoad&render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    });
  }

  return loadPromise;
}
