import type { ContentQueryOptions } from "@/content/shared/types";
import type { ContentRepository } from "@/content/shared/repository";
import type { HeroContent } from "@/types/hero";

export type HeroRepository = ContentRepository<HeroContent>;

export type { ContentQueryOptions };
