import type { FeaturedExpertiseEntry } from "@/types/skills";
import type { ResumeSkillsSnapshotConfig } from "@/types/resume";

import { ResumeSubsection } from "@/features/resume/components/resume-subsection";
import { ContentCard } from "@/components/shared/content-card";
import { FeatureGrid } from "@/components/shared/feature-grid";
import { ButtonLink } from "@/components/ui/button-link";

interface ResumeSkillsSnapshotViewProps {
  config: ResumeSkillsSnapshotConfig;
  items: readonly FeaturedExpertiseEntry[];
}

export function ResumeSkillsSnapshotView({
  config,
  items,
}: ResumeSkillsSnapshotViewProps) {
  return (
    <ResumeSubsection title={config.title}>
      <FeatureGrid columns={2}>
        {items.map((item) => (
          <li key={item.id}>
            <ContentCard
              title={item.title}
              description={item.description}
              headingLevel="h4"
            />
          </li>
        ))}
      </FeatureGrid>
      <div className="mt-6">
        <ButtonLink href={config.viewAllHref} variant="link">
          {config.viewAllLabel}
        </ButtonLink>
      </div>
    </ResumeSubsection>
  );
}
