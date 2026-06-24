import type { ContentQueryOptions } from "@/content/shared/types";

import { staticProjectsRepository } from "@/content/domains/projects/static.repository";
import type { ProjectCategory, ProjectEntry, ProjectsContent } from "@/types/project";

export const projectsContentService = {
  get(options?: ContentQueryOptions): Promise<ProjectsContent> {
    return staticProjectsRepository.get(options);
  },

  getBySlug(
    slug: string,
    options?: ContentQueryOptions,
  ): Promise<ProjectEntry | null> {
    return staticProjectsRepository.getBySlug(slug, options);
  },

  getByCategory(
    category: ProjectCategory,
    options?: ContentQueryOptions,
  ): Promise<ProjectEntry[]> {
    return staticProjectsRepository.getByCategory(category, options);
  },
};
