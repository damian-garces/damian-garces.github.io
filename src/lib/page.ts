import type { Locale } from "../i18n/ui";
import { sectionOrder } from "../i18n/ui";
import { getLocalizedEntry } from "./content";
import { getYearsOfExperience } from "./experience";
import { interpolateYears } from "./interpolate";

/**
 * Loads every content collection for a locale and assembles the page-level
 * view model (including the nav items derived from each section's own
 * heading). Shared by both the "/" and "/es/" pages so the fetch-and-wire
 * logic is written exactly once, not duplicated per locale.
 */
export async function loadPageData(locale: Locale) {
  const years = getYearsOfExperience();

  const [profileRaw, servicesRaw, skillsRaw, softSkillsRaw, languagesRaw, educationRaw, experienceRaw, contactRaw] = await Promise.all([
    getLocalizedEntry("profile", locale),
    getLocalizedEntry("services", locale),
    getLocalizedEntry("skills", locale),
    getLocalizedEntry("soft-skills", locale),
    getLocalizedEntry("languages", locale),
    getLocalizedEntry("education", locale),
    getLocalizedEntry("experience", locale),
    getLocalizedEntry("contact", locale),
  ]);

  // "{{years}}" in any content string resolves here, from the single
  // CAREER_START_YEAR constant — content authors never hardcode the number.
  const profile = interpolateYears(profileRaw, years);
  const services = interpolateYears(servicesRaw, years);
  const skills = interpolateYears(skillsRaw, years);
  const softSkills = interpolateYears(softSkillsRaw, years);
  const languages = interpolateYears(languagesRaw, years);
  const education = interpolateYears(educationRaw, years);
  const experience = interpolateYears(experienceRaw, years);
  const contact = interpolateYears(contactRaw, years);

  const headingsById = {
    about: profile.about.heading,
    services: services.heading,
    skills: skills.heading,
    education: education.heading,
    work: experience.heading,
    contact: contact.heading,
  } as const;

  const navItems = sectionOrder.map(({ id, n }) => ({
    id,
    n,
    label: headingsById[id].eyebrow,
  }));

  return { profile, services, skills, softSkills, languages, education, experience, contact, navItems };
}
