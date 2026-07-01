import {
  requestExperienceContent,
  requestProjectsContent,
  requestResumeContent,
  requestSkillsContent,
} from "@/lib/cache/request-dedupe";
import { ExperienceSection } from "@/features/experience";
import { ProjectsSection } from "@/features/projects";
import { ResumeSection } from "@/features/resume";
import { SkillsSection } from "@/features/skills";

export async function HomeBelowFoldSections() {
  const [experience, projects, skills, resume] = await Promise.all([
    requestExperienceContent(),
    requestProjectsContent(),
    requestSkillsContent(),
    requestResumeContent(),
  ]);

  return (
    <>
      <ExperienceSection content={experience} />
      <ProjectsSection content={projects} />
      <SkillsSection content={skills} />
      <ResumeSection content={resume} experience={experience} skills={skills} />
    </>
  );
}
