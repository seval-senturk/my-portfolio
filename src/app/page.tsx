import { aboutContent } from "@/data/about.data";
import { experienceContent } from "@/data/experience.data";
import { heroContent } from "@/data/hero.data";
import { projectsContent } from "@/data/projects.data";
import { skillsContent } from "@/data/skills.data";
import { AboutSection } from "@/features/about";
import { ExperienceSection } from "@/features/experience";
import { HeroSection } from "@/features/hero";
import { ProjectsSection } from "@/features/projects";
import { SkillsSection } from "@/features/skills";
import { createPageMetadata } from "@/seo/metadata";
import { ROUTES } from "@/constants/routes";

export const metadata = createPageMetadata({
  description: heroContent.summary,
  pathname: ROUTES.home,
});

export default function HomePage() {
  return (
    <>
      <HeroSection content={heroContent} />
      <AboutSection content={aboutContent} />
      <ExperienceSection content={experienceContent} />
      <ProjectsSection content={projectsContent} />
      <SkillsSection content={skillsContent} />
    </>
  );
}
