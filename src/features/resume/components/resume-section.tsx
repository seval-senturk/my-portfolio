import type { ExperienceContent } from "@/types/experience";
import type { ResumeContent } from "@/types/resume";
import type { SkillsContent } from "@/types/skills";
import type { HeadingLevel } from "@/types/ui";

import { experienceContent } from "@/data/experience.data";
import { resumeContent } from "@/data/resume.data";
import { skillsContent } from "@/data/skills.data";

import { ResumeHubView } from "@/features/resume/components/resume-hub-view";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

interface ResumeSectionProps {
  content?: ResumeContent;
  experience?: ExperienceContent;
  skills?: SkillsContent;
  titleAs?: HeadingLevel;
}

export function ResumeSection({
  content = resumeContent,
  experience = experienceContent,
  skills = skillsContent,
  titleAs = "h2",
}: ResumeSectionProps) {
  const { section } = content;

  return (
    <Section
      id="resume"
      title={section.title}
      description={section.description}
      titleAs={titleAs}
      headingId="resume-section-heading"
      headerContainerSize="default"
      spacing="default"
    >
      <Container size="default">
        <ResumeHubView
          content={content}
          experienceContent={experience}
          skillsContent={skills}
        />
      </Container>
    </Section>
  );
}
