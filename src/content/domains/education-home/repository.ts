import type { ContentQueryOptions } from "@/content/shared/types";
import type { ContentRepository } from "@/content/shared/repository";
import type { EducationHomeContent } from "@/types/education-home";

export type EducationHomeRepository = ContentRepository<EducationHomeContent>;

export type { ContentQueryOptions };
