import { prisma } from "@/lib/prisma";
import { resolveLocale } from "@/repositories/shared/locale";

export interface ProjectsPageConfigInput {
  label: string;
  sectionTitle: string;
  titleAccent?: string;
  sectionDescription: string;
  featuredTitle: string;
  additionalTitle: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonLabel: string;
  ctaButtonHref: string;
  ctaVisible: boolean;
  sectionVisible: boolean;
  homeSectionVisible: boolean;
  homeFeaturedLimit: number;
  homeSectionDescription?: string;
  homeCtaLabel: string;
  homeCtaHref: string;
}

export interface ProjectPageFilterInput {
  id?: string;
  label: string;
  slug: string;
  matchType: string;
  matchValue: string;
  visible: boolean;
}

export async function getProjectsPageConfig(locale = resolveLocale()) {
  return prisma.projectsPageConfig.findUnique({ where: { locale } });
}

export async function updateProjectsPageConfig(input: ProjectsPageConfigInput) {
  const locale = resolveLocale();
  return prisma.projectsPageConfig.upsert({
    where: { locale },
    update: input,
    create: { locale, ...input },
  });
}

export async function listProjectPageFilters(locale = resolveLocale()) {
  return prisma.projectPageFilter.findMany({
    where: { locale },
    orderBy: { sortOrder: "asc" },
  });
}

export async function saveProjectPageFilter(input: ProjectPageFilterInput) {
  const locale = resolveLocale();
  const id = input.id ?? `pf-${Date.now()}`;
  const count = await prisma.projectPageFilter.count({ where: { locale } });

  return prisma.projectPageFilter.upsert({
    where: { locale_slug: { locale, slug: input.slug } },
    update: {
      label: input.label,
      matchType: input.matchType,
      matchValue: input.matchValue,
      visible: input.visible,
    },
    create: {
      id,
      locale,
      label: input.label,
      slug: input.slug,
      matchType: input.matchType,
      matchValue: input.matchValue,
      visible: input.visible,
      sortOrder: count,
    },
  });
}

export async function deleteProjectPageFilter(id: string) {
  await prisma.projectPageFilter.delete({ where: { id } });
}

export async function reorderProjectPageFilters(ids: readonly string[]) {
  await Promise.all(
    ids.map((id, index) =>
      prisma.projectPageFilter.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );
}
