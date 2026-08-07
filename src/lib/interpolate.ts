/**
 * Recursively replaces "{{years}}" in every string of a content object with
 * a computed value. Generic on purpose — content authors can drop the
 * placeholder into any collection/field (a sentence, a stat, a heading)
 * without a component ever needing to know it's there.
 */
export function interpolateYears<T>(value: T, years: number): T {
  if (typeof value === "string") {
    return value.replaceAll("{{years}}", String(years)) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => interpolateYears(item, years)) as T;
  }
  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = interpolateYears(val, years);
    }
    return result as T;
  }
  return value;
}
