import type { ExperienceContent } from "@/types/experience";
import type { HeadingLevel } from "@/types/ui";
import { ROUTES } from "@/constants/routes";

import { ExperienceTimelineView } from "@/features/experience/components/experience-timeline-view";
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

  return (
    <Section
      id="experience"
      title={section.title}
      description={section.description}
      titleAs={titleAs}
      headingId="experience-section-heading"
      headerContainerSize="default"
      spacing="default"
    >
      <Container size="default">
        <ExperienceTimelineView entries={entries} />
        <div className="mt-8 border-t border-border pt-6">
          <ButtonLink href={ROUTES.resume} variant="link">
            View full resume and download CV
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
