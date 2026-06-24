import type { ContentQueryOptions } from "@/content/shared/types";
import type { ContentRepository } from "@/content/shared/repository";
import type { SkillCategory, SkillEntry, SkillsContent } from "@/types/skills";

export interface SkillsRepository extends ContentRepository<SkillsContent> {
  getByCategory(
    category: SkillCategory,
    options?: ContentQueryOptions,
  ): Promise<SkillEntry[]>;
}

export type { ContentQueryOptions };
