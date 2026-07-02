import type { ContentQueryOptions } from "@/content/shared/types";
import type { TestimonialsRepository } from "@/content/domains/testimonials/repository";
import { cacheContent } from "@/lib/cache/server";
import { prismaTestimonialsRepository } from "@/repositories/prisma/testimonials.repository";
import { resolveLocale } from "@/repositories/shared/locale";
import type { TestimonialsContent } from "@/types/testimonials";

export class TestimonialsService {
  constructor(
    private readonly repository: TestimonialsRepository = prismaTestimonialsRepository,
  ) {}

  get(options?: ContentQueryOptions): Promise<TestimonialsContent> {
    const locale = resolveLocale(options);
    return cacheContent("testimonials", [locale], () =>
      this.repository.get({ ...options, locale }),
    );
  }
}

export const testimonialsService = new TestimonialsService();
