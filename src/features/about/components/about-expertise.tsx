import type { AboutContentBlock } from "@/types/about";

import { AboutSubsection } from "@/features/about/components/about-subsection";
import { ContentCard } from "@/components/shared/content-card";

interface AboutExpertiseProps {
  items: readonly AboutContentBlock[];
}

export function AboutExpertise({ items }: AboutExpertiseProps) {
  return (
    <AboutSubsection title="Core Expertise">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.title}>
            <ContentCard
              title={item.title}
              description={item.description}
              technologies={item.technologies}
            />
          </li>
        ))}
      </ul>
    </AboutSubsection>
  );
}
