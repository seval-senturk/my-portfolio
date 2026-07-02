import type { TestimonialsRepository } from "@/content/domains/testimonials/repository";
import { testimonialsContent } from "@/data/testimonials.data";
import { prisma } from "@/lib/prisma";
import { mapTestimonialsToContent } from "@/repositories/prisma/mappers/testimonials.mapper";
import { resolveLocale } from "@/repositories/shared/locale";

function hasTestimonialsModels(): boolean {
  return (
    "testimonialsSectionConfig" in prisma &&
    "testimonial" in prisma &&
    typeof prisma.testimonialsSectionConfig?.findUnique === "function"
  );
}

export const prismaTestimonialsRepository: TestimonialsRepository = {
  async get(options) {
    if (!hasTestimonialsModels()) {
      return testimonialsContent;
    }

    const locale = resolveLocale(options);
    const [config, items] = await Promise.all([
      prisma.testimonialsSectionConfig.findUnique({ where: { locale } }),
      prisma.testimonial.findMany({
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    if (!config) {
      return testimonialsContent;
    }

    return mapTestimonialsToContent(config, items);
  },
};
