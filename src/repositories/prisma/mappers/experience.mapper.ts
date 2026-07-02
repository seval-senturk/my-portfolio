import type { Experience, ExperienceTechnology, Technology } from "@prisma/client";

import { mapEmploymentDate } from "@/repositories/prisma/mappers/shared.mapper";
import type { ExperienceContent, ExperienceEntry } from "@/types/experience";

type ExperienceWithTechnologies = Experience & {
  technologies: (ExperienceTechnology & { technology: Technology })[];
};

export function mapExperienceEntry(
  entry: ExperienceWithTechnologies,
): ExperienceEntry {
  return {
    id: entry.id,
    company: entry.company,
    position: entry.position,
    employmentType: entry.employmentType as ExperienceEntry["employmentType"],
    location: entry.location,
    startDate: { month: entry.startMonth, year: entry.startYear },
    endDate: mapEmploymentDate(entry.endMonth, entry.endYear),
    current: entry.current,
    summary: entry.summary,
    responsibilities: entry.responsibilities,
    technologies: entry.technologies
      .map((item) => item.technology.name)
      .sort((a, b) => a.localeCompare(b)),
    achievements: entry.achievements,
    visible: entry.visible,
  };
}

export function mapExperienceToContent(
  config: {
    sectionLabel?: string;
    sectionTitle: string;
    sectionDescription: string;
    sectionVisible?: boolean;
    ctaLabel?: string;
    ctaHref?: string;
    ctaVisible?: boolean;
  },
  entries: ExperienceWithTechnologies[],
): ExperienceContent {
  return {
    section: {
      label: config.sectionLabel ?? "MY JOURNEY",
      title: config.sectionTitle,
      description: config.sectionDescription,
      visible: config.sectionVisible ?? true,
      cta: {
        label: config.ctaLabel ?? "View full resume and download CV",
        href: config.ctaHref ?? "/resume",
        visible: config.ctaVisible ?? true,
      },
    },
    entries: entries.map(mapExperienceEntry),
  };
}
