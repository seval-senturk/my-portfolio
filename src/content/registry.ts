import type { AboutRepository } from "@/content/domains/about/repository";
import type { BlogRepository } from "@/content/domains/blog/repository";
import type { ContactRepository } from "@/content/domains/contact/repository";
import type { ExperienceRepository } from "@/content/domains/experience/repository";
import type { HeroRepository } from "@/content/domains/hero/repository";
import type { ProjectsRepository } from "@/content/domains/projects/repository";
import type { ResumeRepository } from "@/content/domains/resume/repository";
import type { SiteRepository } from "@/content/domains/site/repository";
import type { SkillsRepository } from "@/content/domains/skills/repository";
import {
  prismaAboutRepository,
  prismaBlogRepository,
  prismaContactRepository,
  prismaExperienceRepository,
  prismaHeroRepository,
  prismaProjectsRepository,
  prismaResumeRepository,
  prismaSiteRepository,
  prismaSkillsRepository,
} from "@/repositories/prisma";

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
  hero: prismaHeroRepository,
  about: prismaAboutRepository,
  experience: prismaExperienceRepository,
  projects: prismaProjectsRepository,
  skills: prismaSkillsRepository,
  resume: prismaResumeRepository,
  contact: prismaContactRepository,
  blog: prismaBlogRepository,
  site: prismaSiteRepository,
};
