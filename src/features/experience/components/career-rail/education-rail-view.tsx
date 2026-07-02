import { GraduationCap } from "lucide-react";

import type { EducationHomeEntry } from "@/types/education-home";
import {
  CareerRailTimeline,
  type CareerRailEntryData,
} from "@/features/experience/components/career-rail/career-rail";

function formatEducationRailPeriod(education: EducationHomeEntry): string {
  const start = education.startDate?.year;
  const end = education.endDate?.year;

  if (start && end) {
    return `${start} — ${end}`;
  }

  if (start) {
    return `${start} — PRESENT`;
  }

  return end ? String(end) : String(education.startDate?.year ?? "");
}

function formatDegreeBadge(entry: EducationHomeEntry): string | undefined {
  if (entry.levelBadge?.trim()) {
    return entry.levelBadge.trim().toUpperCase();
  }

  const normalized = entry.degree.trim().toUpperCase();

  if (normalized.includes("BACHELOR")) {
    return "B.S. DEGREE";
  }

  if (normalized.includes("MASTER")) {
    return "MASTER DEGREE";
  }

  if (normalized.includes("PHD") || normalized.includes("DOCTOR")) {
    return "PHD";
  }

  return undefined;
}

function mapEducationToRailEntry(
  education: EducationHomeEntry,
  isHighlighted: boolean,
): CareerRailEntryData | null {
  const period = formatEducationRailPeriod(education);

  if (!period) {
    return null;
  }

  const title = education.fieldOfStudy ?? education.degree;

  return {
    id: education.id,
    period,
    badge: formatDegreeBadge(education),
    title,
    subtitle: education.institution,
    subtitleIcon: GraduationCap,
    description: education.description,
    tags: education.technologies,
    isHighlighted,
  };
}

interface EducationRailViewProps {
  entries: readonly EducationHomeEntry[];
}

export function EducationRailView({ entries }: EducationRailViewProps) {
  const railEntries = entries
    .map((entry, index) => mapEducationToRailEntry(entry, index === 0))
    .filter((entry): entry is CareerRailEntryData => Boolean(entry));

  if (railEntries.length === 0) {
    return null;
  }

  return (
    <CareerRailTimeline entries={railEntries} aria-label="Education timeline" />
  );
}
