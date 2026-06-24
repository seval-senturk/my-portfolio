import type { ContentQueryOptions } from "@/content/shared/types";
import type { ContentRepository } from "@/content/shared/repository";
import type { ExperienceContent, ExperienceEntry } from "@/types/experience";

export interface ExperienceRepository extends ContentRepository<ExperienceContent> {
  getEntryById(
    id: string,
    options?: ContentQueryOptions,
  ): Promise<ExperienceEntry | null>;
}

export type { ContentQueryOptions };
