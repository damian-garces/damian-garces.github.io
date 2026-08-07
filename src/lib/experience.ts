/**
 * Single source of truth for "years of experience". Bump only this constant
 * when it's wrong — every "{{years}}" placeholder in content JSON resolves
 * from it automatically at build time (see interpolate.ts), instead of a
 * number hardcoded in several content files that drifts out of date.
 */
export const CAREER_START_YEAR = 2010;

export function getYearsOfExperience(referenceDate: Date = new Date()): number {
  return referenceDate.getFullYear() - CAREER_START_YEAR;
}
