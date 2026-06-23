import type { AboutStory } from "@/types/about";

import { AboutSubsection } from "@/features/about/components/about-subsection";
import { Text } from "@/components/ui/text";

interface AboutStoryBlockProps {
  story: AboutStory;
}

export function AboutStoryBlock({ story }: AboutStoryBlockProps) {
  return (
    <AboutSubsection title={story.title}>
      <div className="max-w-3xl space-y-4">
        {story.paragraphs.map((paragraph) => (
          <Text key={paragraph} tone="muted">
            {paragraph}
          </Text>
        ))}
      </div>
    </AboutSubsection>
  );
}
