import type { AboutTitledSection } from "@/types/about";
import type { IdentifiedStatItem } from "@/types/stats";

import { AboutSubsection } from "@/features/about/components/about-subsection";
import { StatGrid } from "@/components/shared/stat-grid";

interface AboutHighlightsProps {
  section: AboutTitledSection<IdentifiedStatItem>;
}

export function AboutHighlights({ section }: AboutHighlightsProps) {
  return (
    <AboutSubsection title={section.title}>
      <StatGrid items={section.items} columns={4} />
    </AboutSubsection>
  );
}
