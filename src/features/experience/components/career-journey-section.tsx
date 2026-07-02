import type { EducationHomeContent } from "@/types/education-home";
import type { ExperienceContent } from "@/types/experience";

import { CareerRailsLayout } from "@/features/experience/components/career-rail/career-rails-layout";
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

  return (
    <section
      id="career-journey"
      aria-label="Experience and education"
      className="career-journey-section py-16 md:py-24"
    >
      <Container size="default">
        <CareerRailsLayout experience={experience} education={education} />
      </Container>
    </section>
  );
}
