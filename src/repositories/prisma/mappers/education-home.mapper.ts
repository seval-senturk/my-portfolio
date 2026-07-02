import type { EducationHomeEntry as EducationHomeEntryModel } from "@prisma/client";

import type {
  EducationHomeContent,
  EducationHomeEntry,
} from "@/types/education-home";

function mapEducationDate(
  month: number | null | undefined,
  year: number | null | undefined,
): EducationHomeEntry["startDate"] | undefined {
  if (year == null) {
    return undefined;
  }

  return month != null ? { month, year } : { year };
}

export function mapEducationHomeEntry(
  entry: EducationHomeEntryModel,
): EducationHomeEntry {
  return {
    id: entry.id,
    institution: entry.institution,
    degree: entry.degree,
    fieldOfStudy: entry.fieldOfStudy ?? undefined,
    levelBadge: entry.levelBadge ?? undefined,
    startDate: mapEducationDate(entry.startMonth, entry.startYear),
    endDate: mapEducationDate(entry.endMonth, entry.endYear),
    description: entry.description,
    technologies: entry.technologies,
    visible: entry.visible,
  };
}

export function mapEducationHomeToContent(
  config: {
    sectionLabel: string;
    sectionTitle: string;
    sectionDescription: string | null;
    sectionVisible: boolean;
  },
  entries: EducationHomeEntryModel[],
): EducationHomeContent {
  return {
    section: {
      label: config.sectionLabel,
      title: config.sectionTitle,
      description: config.sectionDescription ?? undefined,
      visible: config.sectionVisible,
    },
    entries: entries.map(mapEducationHomeEntry),
  };
}
