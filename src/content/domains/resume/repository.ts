import type { ContentQueryOptions } from "@/content/shared/types";
import type { ContentRepository } from "@/content/shared/repository";
import type { ResumeContent, ResumeFile } from "@/types/resume";

export interface ResumeRepository extends ContentRepository<ResumeContent> {
  getDefaultFile(options?: ContentQueryOptions): Promise<ResumeFile | null>;
}

export type { ContentQueryOptions };
