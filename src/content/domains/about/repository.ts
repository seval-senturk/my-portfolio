import type { ContentQueryOptions } from "@/content/shared/types";
import type { ContentRepository } from "@/content/shared/repository";
import type { AboutContent } from "@/types/about";

export type AboutRepository = ContentRepository<AboutContent>;

export type { ContentQueryOptions };
