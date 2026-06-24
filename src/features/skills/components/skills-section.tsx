import type { SkillsContent } from "@/types/skills";
import type { HeadingLevel } from "@/types/ui";

import { FeaturedExpertiseView } from "@/features/skills/components/featured-expertise-view";
import { SkillsCategoriesView } from "@/features/skills/components/skills-categories-view";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

interface SkillsSectionProps {
  content: SkillsContent;
  titleAs?: HeadingLevel;
}

export function SkillsSection({
  content,
  titleAs = "h2",
}: SkillsSectionProps) {
  const { section, featuredExpertise, categories, entries } = content;

  return (
    <Section
      id="skills"
      title={section.title}
      description={section.description}
      titleAs={titleAs}
      headingId="skills-section-heading"
      headerContainerSize="default"
      spacing="default"
    >
      <Container size="default">
        <FeaturedExpertiseView
          header={featuredExpertise.header}
          items={featuredExpertise.items}
        />
        <SkillsCategoriesView header={categories.header} entries={entries} />
      </Container>
    </Section>
  );
}
