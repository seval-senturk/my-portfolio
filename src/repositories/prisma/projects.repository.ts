import type { ProjectsRepository } from "@/content/domains/projects/repository";
import { projectsContent } from "@/data/projects.data";
import { prisma } from "@/lib/prisma";
import {
  mapProjectEntry,
  mapProjectsToContent,
} from "@/repositories/prisma/mappers/project.mapper";
import { ContentNotFoundError } from "@/repositories/shared/errors";
import { resolveLocale } from "@/repositories/shared/locale";
import type { ProjectsContent } from "@/types/project";
import { normalizeProjectsContent } from "@/lib/projects/normalize";

const projectInclude = {
  technologies: {
    include: { technology: true },
  },
} as const;

function hasProjectsPageModels(): boolean {
  return (
    "projectsPageConfig" in prisma &&
    typeof prisma.projectsPageConfig?.findUnique === "function" &&
    "projectPageFilter" in prisma &&
    typeof prisma.projectPageFilter?.findMany === "function"
  );
}

function withProjectsDefaults(content: Partial<ProjectsContent>): ProjectsContent {
  return normalizeProjectsContent(content);
}

export const prismaProjectsRepository: ProjectsRepository = {
  async get(options) {
    if (!hasProjectsPageModels()) {
      return projectsContent;
    }

    try {
      const locale = resolveLocale(options);
      const [config, filters, projects] = await Promise.all([
        prisma.projectsPageConfig.findUnique({ where: { locale } }),
        prisma.projectPageFilter.findMany({
          where: { locale, visible: true },
          orderBy: { sortOrder: "asc" },
        }),
        prisma.project.findMany({
          where: { visible: true },
          orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
          include: projectInclude,
        }),
      ]);

      if (!config) {
        throw new ContentNotFoundError("Projects page config", locale);
      }

      return withProjectsDefaults(mapProjectsToContent(config, filters, projects));
    } catch (error) {
      if (error instanceof ContentNotFoundError) {
        return projectsContent;
      }

      console.error("[projects.repository] Falling back to static projects content.", error);
      return projectsContent;
    }
  },

  async getBySlug(slug) {
    try {
      const project = await prisma.project.findFirst({
        where: { slug, visible: true },
        include: projectInclude,
      });

      return project ? mapProjectEntry(project) : null;
    } catch {
      return projectsContent.entries.find((entry) => entry.slug === slug) ?? null;
    }
  },

  async getByCategory(category) {
    try {
      const projects = await prisma.project.findMany({
        where: { category, visible: true },
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
        include: projectInclude,
      });

      return projects.map(mapProjectEntry);
    } catch {
      return projectsContent.entries.filter((entry) => entry.category === category);
    }
  },
};
