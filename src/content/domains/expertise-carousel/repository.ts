import type { ContentQueryOptions } from "@/content/shared/types";
import type { ContentRepository } from "@/content/shared/repository";
import type { ExpertiseCarouselContent } from "@/types/expertise-carousel";

export type ExpertiseCarouselRepository =
  ContentRepository<ExpertiseCarouselContent>;

export type { ContentQueryOptions };
