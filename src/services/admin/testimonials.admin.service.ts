import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";
import type {
  TestimonialItemInput,
  TestimonialsConfigInput,
} from "@/types/testimonials";

function hasTestimonialsModels(): boolean {
  return (
    "testimonialsSectionConfig" in prisma &&
    "testimonial" in prisma &&
    typeof prisma.testimonialsSectionConfig?.findUnique === "function"
  );
}

export async function getTestimonialsConfig() {
  if (!hasTestimonialsModels()) {
    return null;
  }

  return prisma.testimonialsSectionConfig.findUnique({
    where: { locale: DEFAULT_LOCALE },
  });
}

export async function updateTestimonialsConfig(input: TestimonialsConfigInput) {
  if (!hasTestimonialsModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  return prisma.testimonialsSectionConfig.upsert({
    where: { locale: DEFAULT_LOCALE },
    update: {
      label: input.label,
      title: input.title,
      titleAccent: input.titleAccent || null,
      description: input.description,
      sectionNumber: input.sectionNumber,
      visible: input.visible,
      carouselEnabled: input.carouselEnabled,
      autoplay: input.autoplay,
      autoplayDelayMs: input.autoplayDelayMs,
      loop: input.loop,
    },
    create: {
      locale: DEFAULT_LOCALE,
      label: input.label,
      title: input.title,
      titleAccent: input.titleAccent || null,
      description: input.description,
      sectionNumber: input.sectionNumber,
      visible: input.visible,
      carouselEnabled: input.carouselEnabled,
      autoplay: input.autoplay,
      autoplayDelayMs: input.autoplayDelayMs,
      loop: input.loop,
    },
  });
}

export async function listTestimonialItems() {
  if (!hasTestimonialsModels()) {
    return [];
  }

  return prisma.testimonial.findMany({
    orderBy: { sortOrder: "asc" },
  });
}

export async function createTestimonialItem(input: TestimonialItemInput) {
  if (!hasTestimonialsModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  const count = await prisma.testimonial.count();
  const id = input.id ?? `testimonial-${Date.now()}`;

  return prisma.testimonial.create({
    data: {
      id,
      quote: input.quote,
      authorName: input.authorName,
      authorTitle: input.authorTitle,
      company: input.company,
      avatarUrl: input.avatarUrl || null,
      companyLogoUrl: input.companyLogoUrl || null,
      rating: input.rating ?? null,
      testimonialDate: input.testimonialDate ? new Date(input.testimonialDate) : null,
      visible: input.visible,
      sortOrder: count,
    },
  });
}

export async function updateTestimonialItem(id: string, input: TestimonialItemInput) {
  if (!hasTestimonialsModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  return prisma.testimonial.update({
    where: { id },
    data: {
      quote: input.quote,
      authorName: input.authorName,
      authorTitle: input.authorTitle,
      company: input.company,
      avatarUrl: input.avatarUrl || null,
      companyLogoUrl: input.companyLogoUrl || null,
      rating: input.rating ?? null,
      testimonialDate: input.testimonialDate ? new Date(input.testimonialDate) : null,
      visible: input.visible,
    },
  });
}

export async function deleteTestimonialItem(id: string) {
  if (!hasTestimonialsModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  await prisma.testimonial.delete({ where: { id } });
}

export async function reorderTestimonialItems(orderedIds: string[]) {
  if (!hasTestimonialsModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.testimonial.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );
}
