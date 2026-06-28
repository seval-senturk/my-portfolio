import { ensureDefaultResumePdfExists } from "@/lib/resume/pdf-storage";
import { ROUTES } from "@/constants/routes";
import { ResumeSection } from "@/features/resume";
import {
  requestExperienceContent,
  requestResumeContent,
  requestSkillsContent,
} from "@/lib/cache/request-dedupe";
import { getDefaultResumeFile, toResumeStructuredDataInput } from "@/lib/resume";
import { JsonLd } from "@/seo/json-ld";
import { buildResumeMetadata } from "@/services/seo/seo-resolver.service";
import { buildResumeStructuredData } from "@/services/seo/seo-structured-data.service";

export const revalidate = 300;

export async function generateMetadata() {
  const resume = await requestResumeContent();
  const resumeEntityId = resume.id ?? "default";

  return buildResumeMetadata(resumeEntityId, {
    title: resume.section.title,
    description: resume.section.description,
    pathname: ROUTES.resume,
  });
}

export default async function ResumePage() {
  await ensureDefaultResumePdfExists();

  const [resume, experience, skills] = await Promise.all([
    requestResumeContent(),
    requestExperienceContent(),
    requestSkillsContent(),
  ]);

  const resumeFile = getDefaultResumeFile(resume.files);
  const structuredData = await buildResumeStructuredData({
    title: resume.section.title,
    description: resume.section.description,
    pathname: ROUTES.resume,
    resume: toResumeStructuredDataInput(resume, experience, skills),
    pdfUrl: resumeFile?.filePath,
  });

  return (
    <>
      <JsonLd data={structuredData} />
      <ResumeSection
        content={resume}
        experience={experience}
        skills={skills}
        titleAs="h1"
      />
    </>
  );
}
