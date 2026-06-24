import type { ContentQueryOptions } from "@/content/shared/types";
import type { ContentRepository } from "@/content/shared/repository";
import type { ProjectCategory, ProjectEntry, ProjectsContent } from "@/types/project";

export interface ProjectsRepository extends ContentRepository<ProjectsContent> {
  getBySlug(
    slug: string,
    options?: ContentQueryOptions,
  ): Promise<ProjectEntry | null>;

  getByCategory(
    category: ProjectCategory,
    options?: ContentQueryOptions,
  ): Promise<ProjectEntry[]>;
}

export type { ContentQueryOptions };
