import type { AboutRepository } from "@/content/domains/about/repository";
import { staticAboutRepository } from "@/content/domains/about/static.repository";
import type { BlogRepository } from "@/content/domains/blog/repository";
import { staticBlogRepository } from "@/content/domains/blog/static.repository";
import type { ContactRepository } from "@/content/domains/contact/repository";
import { staticContactRepository } from "@/content/domains/contact/static.repository";
import type { ExperienceRepository } from "@/content/domains/experience/repository";
import { staticExperienceRepository } from "@/content/domains/experience/static.repository";
import type { HeroRepository } from "@/content/domains/hero/repository";
import { staticHeroRepository } from "@/content/domains/hero/static.repository";
import type { ProjectsRepository } from "@/content/domains/projects/repository";
import { staticProjectsRepository } from "@/content/domains/projects/static.repository";
import type { ResumeRepository } from "@/content/domains/resume/repository";
import { staticResumeRepository } from "@/content/domains/resume/static.repository";
import type { SiteRepository } from "@/content/domains/site/repository";
import { staticSiteRepository } from "@/content/domains/site/static.repository";
import type { SkillsRepository } from "@/content/domains/skills/repository";
import { staticSkillsRepository } from "@/content/domains/skills/static.repository";

export interface ContentRepositories {
  hero: HeroRepository;
  about: AboutRepository;
  experience: ExperienceRepository;
  projects: ProjectsRepository;
  skills: SkillsRepository;
  resume: ResumeRepository;
  contact: ContactRepository;
  blog: BlogRepository;
  site: SiteRepository;
}

export const contentRepositories: ContentRepositories = {
  hero: staticHeroRepository,
  about: staticAboutRepository,
  experience: staticExperienceRepository,
  projects: staticProjectsRepository,
  skills: staticSkillsRepository,
  resume: staticResumeRepository,
  contact: staticContactRepository,
  blog: staticBlogRepository,
  site: staticSiteRepository,
};
