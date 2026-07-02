import { MapPin } from "lucide-react";

import type { ExperienceEntry } from "@/types/experience";
import {
  CareerRailTimeline,
  type CareerRailEntryData,
} from "@/features/experience/components/career-rail/career-rail";

function formatRailPeriod(entry: ExperienceEntry): string {
  const start = entry.startDate.year;
  const end = entry.current
    ? "PRESENT"
    : entry.endDate
      ? String(entry.endDate.year)
      : "PRESENT";

  return `${start} — ${end}`;
}

function mapExperienceToRailEntry(
  entry: ExperienceEntry,
  isHighlighted: boolean,
): CareerRailEntryData {
  return {
    id: entry.id,
    period: formatRailPeriod(entry),
    badge: entry.current ? "CURRENT" : entry.employmentType.toUpperCase(),
    title: entry.position,
    subtitle: `${entry.company} — ${entry.location}`,
    subtitleIcon: MapPin,
    description: entry.summary,
    tags: entry.technologies,
    isHighlighted,
  };
}

interface ExperienceRailViewProps {
  entries: readonly ExperienceEntry[];
}

export function ExperienceRailView({ entries }: ExperienceRailViewProps) {
  const railEntries = entries.map((entry, index) =>
    mapExperienceToRailEntry(entry, index === 0 || Boolean(entry.current)),
  );

  return (
    <CareerRailTimeline entries={railEntries} aria-label="Work experience timeline" />
  );
}
