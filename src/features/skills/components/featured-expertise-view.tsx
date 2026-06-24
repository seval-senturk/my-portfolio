import type {
  FeaturedExpertiseEntry,
  SkillsSubsectionHeader,
} from "@/types/skills";

import { SkillsSubsection } from "@/features/skills/components/skills-subsection";
import { ContentCard } from "@/components/shared/content-card";
import { FeatureGrid } from "@/components/shared/feature-grid";

interface FeaturedExpertiseViewProps {
  header: SkillsSubsectionHeader;
  items: readonly FeaturedExpertiseEntry[];
}

export function FeaturedExpertiseView({
  header,
  items,
}: FeaturedExpertiseViewProps) {
  return (
    <SkillsSubsection title={header.title}>
      <FeatureGrid columns={3}>
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
    </SkillsSubsection>
  );
}
