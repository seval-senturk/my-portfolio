import { professionalHighlights } from "@/data/professional-highlights.data";

import { AboutSubsection } from "@/features/about/components/about-subsection";
import { StatGrid } from "@/components/shared/stat-grid";

export function AboutHighlights() {
  return (
    <AboutSubsection title="Professional Highlights">
      <StatGrid items={professionalHighlights} columns={4} />
    </AboutSubsection>
  );
}
