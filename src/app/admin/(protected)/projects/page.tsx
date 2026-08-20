import { projectsContent } from "@/data/projects.data";
import { ProjectsAdminView } from "@/features/admin/components/projects-admin-view";
import {
  getProjectsPageConfig,
  listProjectEntries,
  listProjectPageFilters,
} from "@/services/admin";

type ProjectFilterRecord = Awaited<ReturnType<typeof listProjectPageFilters>>[number];
type ProjectEntryRecord = Awaited<ReturnType<typeof listProjectEntries>>[number];

export default async function AdminProjectsPage() {
  const [pageConfig, filters, entries] = await Promise.all([
    getProjectsPageConfig(),
    listProjectPageFilters(),
    listProjectEntries(),
  ]);

  const resolvedConfig = pageConfig
    ? {
        label: pageConfig.label,
        sectionTitle: pageConfig.sectionTitle,
        titleAccent: pageConfig.titleAccent,
        sectionDescription: pageConfig.sectionDescription,
        featuredTitle: pageConfig.featuredTitle,
        additionalTitle: pageConfig.additionalTitle,
        ctaTitle: pageConfig.ctaTitle,
        ctaDescription: pageConfig.ctaDescription,
        ctaButtonLabel: pageConfig.ctaButtonLabel,
        ctaButtonHref: pageConfig.ctaButtonHref,
        ctaVisible: pageConfig.ctaVisible,
        sectionVisible: pageConfig.sectionVisible,
        homeSectionVisible: pageConfig.homeSectionVisible ?? true,
        homeFeaturedLimit: pageConfig.homeFeaturedLimit ?? 3,
        homeSectionDescription: pageConfig.homeSectionDescription,
        homeCtaLabel: pageConfig.homeCtaLabel ?? "View All Projects",
        homeCtaHref: pageConfig.homeCtaHref ?? "/projects",
      }
    : {
        label: projectsContent.hero.label,
        sectionTitle: projectsContent.hero.title,
        titleAccent: projectsContent.hero.titleAccent,
        sectionDescription: projectsContent.hero.description,
        featuredTitle: projectsContent.featured.title,
        additionalTitle: projectsContent.grid.title,
        ctaTitle: projectsContent.cta.title,
        ctaDescription: projectsContent.cta.description,
        ctaButtonLabel: projectsContent.cta.buttonLabel,
        ctaButtonHref: projectsContent.cta.buttonHref,
        ctaVisible: projectsContent.cta.visible,
        sectionVisible: projectsContent.visible,
        homeSectionVisible: projectsContent.home.visible,
        homeFeaturedLimit: projectsContent.home.featuredLimit,
        homeSectionDescription: projectsContent.home.description,
        homeCtaLabel: projectsContent.home.ctaLabel,
        homeCtaHref: projectsContent.home.ctaHref,
      };

  const resolvedFilters =
    filters.length > 0
      ? filters.map((filter: ProjectFilterRecord) => ({
          id: filter.id,
          label: filter.label,
          slug: filter.slug,
          matchType: filter.matchType,
          matchValue: filter.matchValue,
          visible: filter.visible,
        }))
      : projectsContent.filters.map((filter) => ({
          id: filter.id,
          label: filter.label,
          slug: filter.slug,
          matchType: filter.matchType,
          matchValue: filter.matchValue,
          visible: filter.visible,
        }));

  return (
    <ProjectsAdminView
      config={resolvedConfig}
      filters={resolvedFilters}
      entries={entries.map((entry: ProjectEntryRecord) => ({
        id: entry.id,
        slug: entry.slug,
        title: entry.title,
        shortDescription: entry.shortDescription,
        longDescription: entry.longDescription,
        category: entry.category,
        status: entry.status,
        client: entry.client,
        role: entry.role,
        featured: entry.featured,
        coverImageUrl: entry.coverImageUrl,
        coverImageAlt: entry.coverImageAlt,
        projectType: entry.projectType,
        visible: entry.visible,
        githubUrl: entry.githubUrl,
        liveUrl: entry.liveUrl,
        technologies: entry.technologies.map(
          (item: ProjectEntryRecord["technologies"][number]) => item.technology.name,
        ),
        highlights: entry.highlights,
      }))}
    />
  );
}
