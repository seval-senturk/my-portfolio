import type { EducationHomeContent } from "@/types/education-home";
import type { ExperienceContent } from "@/types/experience";

import { HomeSectionShell } from "@/components/sections";
import { CareerRailsLayout } from "@/features/experience/components/career-rail/career-rails-layout";
import { careerJourneySectionConfig } from "@/features/experience/config/career-journey-section.config";

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
    <HomeSectionShell
      id="career-journey"
      headingId={headingId}
      header={{
        label: careerJourneySectionConfig.label,
        title: careerJourneySectionConfig.title,
        titleAccent: careerJourneySectionConfig.titleAccent,
        description: careerJourneySectionConfig.description,
      }}
    >
      <CareerRailsLayout experience={experience} education={education} />
    </HomeSectionShell>
  );
}
