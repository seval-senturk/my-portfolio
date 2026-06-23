import type { AboutContent } from "@/types/about";
import type { HeadingLevel } from "@/types/ui";

import { aboutContent } from "@/data/about.data";

import { AboutExpertise } from "@/features/about/components/about-expertise";
import { AboutHighlights } from "@/features/about/components/about-highlights";
import { AboutIntroduction } from "@/features/about/components/about-introduction";
import { AboutPrinciples } from "@/features/about/components/about-principles";
import { AboutStoryBlock } from "@/features/about/components/about-story";
import { AboutValues } from "@/features/about/components/about-values";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

interface AboutSectionProps {
  content?: AboutContent;
  titleAs?: HeadingLevel;
}

export function AboutSection({
  content = aboutContent,
  titleAs = "h2",
}: AboutSectionProps) {
  const {
    section,
    introduction,
    story,
    coreExpertise,
    workingPrinciples,
    professionalHighlights,
    personalValues,
  } = content;

  return (
    <Section
      id="about"
      title={section.title}
      description={section.description}
      titleAs={titleAs}
      headingId="about-section-heading"
      headerContainerSize="default"
      spacing="default"
    >
      <Container size="default">
        <AboutIntroduction paragraphs={introduction.paragraphs} />
        <AboutStoryBlock story={story} />
        <AboutExpertise section={coreExpertise} />
        <AboutPrinciples section={workingPrinciples} />
        <AboutHighlights section={professionalHighlights} />
        <AboutValues section={personalValues} />
      </Container>
    </Section>
  );
}
