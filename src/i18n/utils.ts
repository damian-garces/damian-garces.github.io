import { defaultLocale, locales, ui, type Locale, type UiKey } from "./ui";

/** Derives the active locale from an Astro `Astro.url`. */
export function getLangFromUrl(url: URL): Locale {
  const [, maybeLocale] = url.pathname.split("/");
  if (locales.includes(maybeLocale as Locale)) {
    return maybeLocale as Locale;
  }
  return defaultLocale;
}

/** Returns a `t(key)` translator bound to the given locale, falling back to English. */
export function useTranslations(locale: Locale) {
  return function t(key: UiKey): string {
    return ui[locale][key] ?? ui[defaultLocale][key];
  };
}

/** Prefixes a path with the locale segment, matching `prefixDefaultLocale: false`. */
export function localizedPath(locale: Locale, path = "/"): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return locale === defaultLocale ? cleanPath : `/${locale}${cleanPath}`;
}

/** Swaps the locale segment of the current pathname, preserving the rest of the path. */
export function getAlternatePath(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
    segments.shift();
  }
  const rest = segments.length > 0 ? `/${segments.join("/")}/` : "/";
  return localizedPath(targetLocale, rest);
}
