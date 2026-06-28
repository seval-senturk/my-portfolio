import {
  requestAboutContent,
  requestExperienceContent,
  requestProjectsContent,
  requestResumeContent,
  requestSkillsContent,
} from "@/lib/cache/request-dedupe";
import { AboutSection } from "@/features/about";
import { ExperienceSection } from "@/features/experience";
import { ProjectsSection } from "@/features/projects";
import { ResumeSection } from "@/features/resume";
import { SkillsSection } from "@/features/skills";

export async function HomeBelowFoldSections() {
  const [about, experience, projects, skills, resume] = await Promise.all([
    requestAboutContent(),
    requestExperienceContent(),
    requestProjectsContent(),
    requestSkillsContent(),
    requestResumeContent(),
  ]);

  return (
    <>
      <AboutSection content={about} />
      <ExperienceSection content={experience} />
      <ProjectsSection content={projects} />
      <SkillsSection content={skills} />
      <ResumeSection content={resume} experience={experience} skills={skills} />
    </>
  );
}
