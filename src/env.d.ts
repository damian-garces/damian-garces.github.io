/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Public Web3Forms access key, used by the contact form to submit messages. Safe to expose client-side. */
  readonly PUBLIC_WEB3FORMS_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
