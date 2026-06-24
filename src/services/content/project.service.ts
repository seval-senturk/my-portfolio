import type { ContentQueryOptions } from "@/content/shared/types";
import { validateSlug } from "@/content/shared/validation";
import type { ProjectsRepository } from "@/content/domains/projects/repository";
import { prismaProjectsRepository } from "@/repositories/prisma/projects.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type {
  ProjectCategory,
  ProjectEntry,
  ProjectsContent,
} from "@/types/project";

export class ProjectService {
  constructor(
    private readonly repository: ProjectsRepository = prismaProjectsRepository,
  ) {}

  get(options?: ContentQueryOptions): Promise<ProjectsContent> {
    return this.repository.get({ ...options, locale: resolveLocale(options) });
  }

  getBySlug(
    slug: string,
    options?: ContentQueryOptions,
  ): Promise<ProjectEntry | null> {
    const error = validateSlug(slug);
    if (error) {
      return Promise.resolve(null);
    }

    return this.repository.getBySlug(slug, {
      ...options,
      locale: resolveLocale(options),
    });
  }

  getByCategory(
    category: ProjectCategory,
    options?: ContentQueryOptions,
  ): Promise<ProjectEntry[]> {
    return this.repository.getByCategory(category, {
      ...options,
      locale: resolveLocale(options),
    });
  }
}

export const projectService = new ProjectService();
