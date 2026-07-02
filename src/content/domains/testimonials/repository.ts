import type { ContentQueryOptions } from "@/content/shared/types";
import type { ContentRepository } from "@/content/shared/repository";
import type { TestimonialsContent } from "@/types/testimonials";

export type TestimonialsRepository = ContentRepository<TestimonialsContent>;

export type { ContentQueryOptions };
