import {
  experienceContentService,
  resumeContentService,
  skillsContentService,
} from "@/content";
import { ROUTES } from "@/constants/routes";
import { ResumeSection } from "@/features/resume";
import { createPageMetadata } from "@/seo/metadata";

export async function generateMetadata() {
  const resume = await resumeContentService.get();

  return createPageMetadata({
    title: "Resume",
    description: resume.section.description,
    pathname: ROUTES.resume,
  });
}

export default async function ResumePage() {
  const [resume, experience, skills] = await Promise.all([
    resumeContentService.get(),
    experienceContentService.get(),
    skillsContentService.get(),
  ]);

  return (
    <ResumeSection
      content={resume}
      experience={experience}
      skills={skills}
      titleAs="h1"
    />
  );
}
