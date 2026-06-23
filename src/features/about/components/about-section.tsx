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
  titleAs?: HeadingLevel;
}

export function AboutSection({ titleAs = "h2" }: AboutSectionProps) {
  const {
    section,
    introduction,
    story,
    coreExpertise,
    workingPrinciples,
    personalValues,
  } = aboutContent;

  return (
    <Section
      id="about"
      title={section.title}
      description={section.description}
      titleAs={titleAs}
      headingId="about-section-heading"
      spacing="default"
    >
      <Container size="default">
        <AboutIntroduction paragraphs={introduction.paragraphs} />
        <AboutStoryBlock story={story} />
        <AboutExpertise items={coreExpertise} />
        <AboutPrinciples items={workingPrinciples} />
        <AboutHighlights />
        <AboutValues items={personalValues} />
      </Container>
    </Section>
  );
}
