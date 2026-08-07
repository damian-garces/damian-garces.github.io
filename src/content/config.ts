import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Shared shape for a section's eyebrow/title/note header block.
 * Reused across every section collection that renders one (About, Services,
 * Skills, Education, Experience, Contact).
 */
const sectionHeading = z.object({
  eyebrow: z.string(),
  title: z.string(),
  note: z.string(),
});

const heroMetaItem = z.object({
  key: z.string(),
  value: z.string(),
});

const statItem = z.object({
  value: z.string(),
  label: z.string(),
});

const socialLink = z.object({
  label: z.string(),
  href: z.string().url(),
});

/** One entry per locale (id: "en" | "es"), loaded from src/content/<name>/*.json */
const localeLoader = (name: string) => glob({ pattern: "*.json", base: `./src/content/${name}` });

const profile = defineCollection({
  loader: localeLoader("profile"),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    tagline: z.string(),
    location: z.string(),
    cvUrl: z.string(),
    heroMeta: z.array(heroMetaItem).min(1),
    about: z.object({
      heading: sectionHeading,
      bio: z.array(z.string()).min(1),
      stats: z.array(statItem).min(1),
    }),
    socials: z.array(socialLink).min(1),
  }),
});

const services = defineCollection({
  loader: localeLoader("services"),
  schema: z.object({
    heading: sectionHeading,
    items: z
      .array(
        z.object({
          n: z.string(),
          icon: z.string(),
          title: z.string(),
          description: z.string(),
          cta: z.string(),
        }),
      )
      .min(1),
  }),
});

const skills = defineCollection({
  loader: localeLoader("skills"),
  schema: z.object({
    heading: sectionHeading,
    categories: z
      .array(
        z.object({
          n: z.string(),
          name: z.string(),
          tags: z
            .array(
              z.object({
                name: z.string(),
                primary: z.boolean().default(false),
              }),
            )
            .min(1),
        }),
      )
      .min(1),
  }),
});

const softSkills = defineCollection({
  loader: localeLoader("soft-skills"),
  schema: z.object({
    heading: z.object({ title: z.string() }),
    items: z.array(z.string()).min(1),
  }),
});

const languages = defineCollection({
  loader: localeLoader("languages"),
  schema: z.object({
    items: z
      .array(
        z.object({
          name: z.string(),
          level: z.string(),
          /** Proficiency out of 5, driving the tick indicator. */
          proficiency: z.number().int().min(1).max(5),
        }),
      )
      .min(1),
  }),
});

const education = defineCollection({
  loader: localeLoader("education"),
  schema: z.object({
    heading: sectionHeading,
    items: z
      .array(
        z.object({
          n: z.string(),
          year: z.string(),
          title: z.string(),
          place: z.string(),
          certificateUrl: z.string().url().optional(),
        }),
      )
      .min(1),
  }),
});

const experience = defineCollection({
  loader: localeLoader("experience"),
  schema: z.object({
    heading: sectionHeading,
    items: z
      .array(
        z.object({
          n: z.string(),
          company: z.string(),
          period: z.string(),
          role: z.string(),
          bullets: z.array(z.string()).min(1),
        }),
      )
      .min(1),
  }),
});

const contact = defineCollection({
  loader: localeLoader("contact"),
  schema: z.object({
    heading: sectionHeading,
    form: z.object({
      successTitle: z.string(),
      successSubtitle: z.string(),
      nameLabel: z.string(),
      emailLabel: z.string(),
      subjectLabel: z.string(),
      subjectPlaceholder: z.string(),
      messageLabel: z.string(),
      messagePlaceholder: z.string(),
      sendLabel: z.string(),
    }),
    info: z.array(heroMetaItem).min(1),
    findMeLabel: z.string(),
  }),
});

export const collections = {
  profile,
  services,
  skills,
  "soft-skills": softSkills,
  languages,
  education,
  experience,
  contact,
};
