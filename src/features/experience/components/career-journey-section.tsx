import type { EducationHomeContent } from "@/types/education-home";
import type { ExperienceContent } from "@/types/experience";

import { CareerRailsLayout } from "@/features/experience/components/career-rail/career-rails-layout";
import { CareerJourneySectionHeader } from "@/features/experience/components/career-journey-section-header";
import { careerJourneySectionConfig } from "@/features/experience/config/career-journey-section.config";
import { Container } from "@/components/ui/container";

interface CareerJourneySectionProps {
  experience: ExperienceContent;
  education: EducationHomeContent;
}

export function CareerJourneySection({
  experience,
  education,
}: CareerJourneySectionProps) {
  const showExperience =
    experience.section.visible && experience.entries.length > 0;
  const showEducation =
    education.section.visible && education.entries.length > 0;

  if (!showExperience && !showEducation) {
    return null;
  }

  const headingId = "career-journey-heading";

  return (
    <section
      id="career-journey"
      aria-labelledby={headingId}
      className="career-journey-section"
    >
      <Container size="wide" className="career-journey__container">
        <CareerJourneySectionHeader
          label={careerJourneySectionConfig.label}
          title={careerJourneySectionConfig.title}
          titleAccent={careerJourneySectionConfig.titleAccent}
          description={careerJourneySectionConfig.description}
          headingId={headingId}
        />
        <CareerRailsLayout experience={experience} education={education} />
      </Container>
    </section>
  );
}
