/**
 * Static UI-chrome copy: labels that belong to the page shell (nav, footer,
 * toggles) rather than to CV content. CV content itself always lives in
 * `src/content/*` — this dictionary never duplicates it.
 */
export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  es: "ES",
};

export const ui = {
  en: {
    "nav.menu": "Menu",
    "nav.downloadCv": "Download CV",
    "nav.viewWork": "View experience",
    "education.certificate": "Certificate",
    "footer.rights": "All rights reserved",
    "footer.backTop": "Back to top",
    "contact.errorEmail": "Please enter a valid email address.",
    "contact.errorGeneric": "Something went wrong. Please try again or email me directly.",
  },
  es: {
    "nav.menu": "Menú",
    "nav.downloadCv": "Descargar CV",
    "nav.viewWork": "Ver experiencia",
    "education.certificate": "Certificado",
    "footer.rights": "Todos los derechos reservados",
    "footer.backTop": "Volver arriba",
    "contact.errorEmail": "Por favor ingresa un correo electrónico válido.",
    "contact.errorGeneric": "Algo salió mal. Intenta de nuevo o escríbeme directamente.",
  },
} as const satisfies Record<Locale, Record<string, string>>;

export type UiKey = keyof (typeof ui)["en"];

/** Section order + numbering shown in the nav and section eyebrows (presentation, not CV content). */
export const sectionOrder = [
  { id: "about", n: "01" },
  { id: "services", n: "02" },
  { id: "skills", n: "03" },
  { id: "education", n: "04" },
  { id: "work", n: "05" },
  { id: "contact", n: "06" },
] as const;

export type SectionId = (typeof sectionOrder)[number]["id"];
