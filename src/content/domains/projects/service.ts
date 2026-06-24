import type { ContentQueryOptions } from "@/content/shared/types";

import { projectService } from "@/services/content/project.service";
import type { ProjectCategory, ProjectEntry, ProjectsContent } from "@/types/project";

export const projectsContentService = {
  get(options?: ContentQueryOptions): Promise<ProjectsContent> {
    return projectService.get(options);
  },

  getBySlug(
    slug: string,
    options?: ContentQueryOptions,
  ): Promise<ProjectEntry | null> {
    return projectService.getBySlug(slug, options);
  },

  getByCategory(
    category: ProjectCategory,
    options?: ContentQueryOptions,
  ): Promise<ProjectEntry[]> {
    return projectService.getByCategory(category, options);
  },
};
