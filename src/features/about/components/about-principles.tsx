import type { AboutContentBlock, AboutTitledSection } from "@/types/about";

import { AboutSubsection } from "@/features/about/components/about-subsection";
import { ContentCard } from "@/components/shared/content-card";
import { FeatureGrid } from "@/components/shared/feature-grid";

interface AboutPrinciplesProps {
  section: AboutTitledSection<AboutContentBlock>;
}

export function AboutPrinciples({ section }: AboutPrinciplesProps) {
  return (
    <AboutSubsection title={section.title}>
      <FeatureGrid columns={3}>
        {section.items.map((item) => (
          <li key={item.title}>
            <ContentCard title={item.title} description={item.description} />
          </li>
        ))}
      </FeatureGrid>
    </AboutSubsection>
  );
}
