import type { EducationHomeContent } from "@/types/education-home";
import type { ExperienceContent } from "@/types/experience";

import { CareerRailColumn } from "@/features/experience/components/career-rail/career-rail";
import { EducationRailView } from "@/features/experience/components/career-rail/education-rail-view";
import { ExperienceRailView } from "@/features/experience/components/career-rail/experience-rail-view";

interface CareerRailsLayoutProps {
  experience: ExperienceContent;
  education: EducationHomeContent;
}

export function CareerRailsLayout({ experience, education }: CareerRailsLayoutProps) {
  const showExperience =
    experience.section.visible && experience.entries.length > 0;
  const showEducation =
    education.section.visible && education.entries.length > 0;

  if (!showExperience && !showEducation) {
    return null;
  }

  const singleColumn = !showExperience || !showEducation;

  return (
    <div
      className={
        singleColumn
          ? "career-rails-grid career-rails-grid--single"
          : "career-rails-grid"
      }
    >
      {showExperience ? (
        <CareerRailColumn
          label={experience.section.label}
          title={experience.section.title}
          description={experience.section.description}
          headingId="career-rail-experience"
        >
          <ExperienceRailView entries={experience.entries} />
        </CareerRailColumn>
      ) : null}

      {showEducation ? (
        <CareerRailColumn
          label={education.section.label}
          title={education.section.title}
          description={education.section.description}
          headingId="career-rail-education"
        >
          <EducationRailView entries={education.entries} />
        </CareerRailColumn>
      ) : null}
    </div>
  );
}
