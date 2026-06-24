import type { ProjectsRepository } from "@/content/domains/projects/repository";
import { prisma } from "@/lib/prisma";
import {
  mapProjectEntry,
  mapProjectsToContent,
} from "@/repositories/prisma/mappers/project.mapper";
import { ContentNotFoundError } from "@/repositories/shared/errors";
import { resolveLocale } from "@/repositories/shared/locale";

const projectInclude = {
  technologies: {
    include: { technology: true },
  },
} as const;

export const prismaProjectsRepository: ProjectsRepository = {
  async get(options) {
    const locale = resolveLocale(options);
    const [config, projects] = await Promise.all([
      prisma.projectsPageConfig.findUnique({ where: { locale } }),
      prisma.project.findMany({
        orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
        include: projectInclude,
      }),
    ]);

    if (!config) {
      throw new ContentNotFoundError("Projects page config", locale);
    }

    return mapProjectsToContent(config, projects);
  },

  async getBySlug(slug) {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: projectInclude,
    });

    return project ? mapProjectEntry(project) : null;
  },

  async getByCategory(category) {
    const projects = await prisma.project.findMany({
      where: { category },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
      include: projectInclude,
    });

    return projects.map(mapProjectEntry);
  },
};
