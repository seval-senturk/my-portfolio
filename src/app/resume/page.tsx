import { experienceContent } from "@/data/experience.data";
import { resumeContent } from "@/data/resume.data";
import { skillsContent } from "@/data/skills.data";
import { ROUTES } from "@/constants/routes";
import { ResumeSection } from "@/features/resume";
import { createPageMetadata } from "@/seo/metadata";

export const metadata = createPageMetadata({
  title: "Resume",
  description: resumeContent.section.description,
  pathname: ROUTES.resume,
});

export default function ResumePage() {
  return (
    <ResumeSection
      content={resumeContent}
      experience={experienceContent}
      skills={skillsContent}
      titleAs="h1"
    />
  );
}
