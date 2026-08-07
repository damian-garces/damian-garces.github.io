import { getEntry, type CollectionEntry, type CollectionKey } from "astro:content";
import { defaultLocale, type Locale } from "../i18n/ui";

/**
 * Loads a single-per-locale content entry with a graceful fallback chain:
 * requested locale -> default locale -> a thrown, descriptive error.
 *
 * A missing content file must never crash the whole site build silently as
 * a cryptic Zod/undefined error — this surfaces exactly which collection and
 * locale is missing, and still lets the rest of the site build by falling
 * back to English when only a translation is absent.
 */
export async function getLocalizedEntry<C extends CollectionKey>(
  collection: C,
  locale: Locale,
): Promise<CollectionEntry<C>["data"]> {
  const entry = await getEntry(collection, locale);
  if (entry) return entry.data;

  if (locale !== defaultLocale) {
    console.warn(
      `[content] Missing "${locale}" entry for collection "${collection}" — falling back to "${defaultLocale}".`,
    );
    const fallback = await getEntry(collection, defaultLocale);
    if (fallback) return fallback.data;
  }

  throw new Error(
    `[content] Collection "${collection}" has no "${locale}" or "${defaultLocale}" entry. ` +
      `Add src/content/${collection}/${locale}.json (or ${defaultLocale}.json) before building.`,
  );
}
