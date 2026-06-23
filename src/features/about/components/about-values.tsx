import type { AboutContentBlock } from "@/types/about";

import { AboutSubsection } from "@/features/about/components/about-subsection";
import { ContentCard } from "@/components/shared/content-card";

interface AboutValuesProps {
  items: readonly AboutContentBlock[];
}

export function AboutValues({ items }: AboutValuesProps) {
  return (
    <AboutSubsection title="Professional Values">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.title}>
            <ContentCard title={item.title} description={item.description} />
          </li>
        ))}
      </ul>
    </AboutSubsection>
  );
}
