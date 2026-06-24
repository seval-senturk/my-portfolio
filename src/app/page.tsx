import {
  aboutContentService,
  contactContentService,
  experienceContentService,
  heroContentService,
  projectsContentService,
  resumeContentService,
  siteContentService,
  skillsContentService,
} from "@/content";
import { AboutSection } from "@/features/about";
import { ContactSection } from "@/features/contact";
import { ExperienceSection } from "@/features/experience";
import { HeroSection } from "@/features/hero";
import { ProjectsSection } from "@/features/projects";
import { ResumeSection } from "@/features/resume";
import { SkillsSection } from "@/features/skills";
import { createPageMetadata } from "@/seo/metadata";
import { ROUTES } from "@/constants/routes";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const hero = await heroContentService.get();

  return createPageMetadata({
    description: hero.summary,
    pathname: ROUTES.home,
  });
}

export default async function HomePage() {
  const [
    hero,
    about,
    experience,
    projects,
    skills,
    resume,
    contact,
    professionalHighlights,
  ] = await Promise.all([
    heroContentService.get(),
    aboutContentService.get(),
    experienceContentService.get(),
    projectsContentService.get(),
    skillsContentService.get(),
    resumeContentService.get(),
    contactContentService.get(),
    siteContentService.getProfessionalHighlights(),
  ]);

  return (
    <>
      <HeroSection
        content={hero}
        professionalHighlights={professionalHighlights}
      />
      <AboutSection content={about} />
      <ExperienceSection content={experience} />
      <ProjectsSection content={projects} />
      <SkillsSection content={skills} />
      <ResumeSection
        content={resume}
        experience={experience}
        skills={skills}
      />
      <ContactSection content={contact} />
    </>
  );
}
