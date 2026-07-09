import type { ExperienceContent } from "@/types/experience";
import type { HeadingLevel } from "@/types/ui";

import { ExperienceDetailView } from "@/features/experience/components/experience-detail-view";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

interface ExperienceSectionProps {
  content: ExperienceContent;
  titleAs?: HeadingLevel;
}

export function ExperienceSection({
  content,
  titleAs = "h2",
}: ExperienceSectionProps) {
  const { section, entries } = content;

  if (!section.visible || entries.length === 0) {
    return null;
  }

  return (
    <Section
      id="experience"
      title={section.title}
      description={section.description}
      titleAs={titleAs}
      headingId="experience-section-heading"
      headerContainerSize="wide"
      spacing="default"
    >
      <Container size="wide">
        <ExperienceDetailView entries={entries} />

        {section.cta.visible ? (
          <div className="mt-10 border-t border-border pt-6">
            <ButtonLink href={section.cta.href} variant="link">
              {section.cta.label}
            </ButtonLink>
          </div>
        ) : null}
      </Container>
    </Section>
  );
}
