import type { ExperienceEntry } from "@/types/experience";

import { ExperienceCard } from "@/components/shared/experience-card";
import {
  ExperienceTimeline,
  ExperienceTimelineItem,
} from "@/components/shared/experience-timeline";

interface ExperienceTimelineViewProps {
  entries: readonly ExperienceEntry[];
}

export function ExperienceTimelineView({
  entries,
}: ExperienceTimelineViewProps) {
  const lastIndex = entries.length - 1;

  return (
    <ExperienceTimeline>
      {entries.map((entry, index) => (
        <ExperienceTimelineItem key={entry.id} isLast={index === lastIndex}>
          <ExperienceCard entry={entry} />
        </ExperienceTimelineItem>
      ))}
    </ExperienceTimeline>
  );
}
