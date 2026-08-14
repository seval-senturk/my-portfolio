import { notFound } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { ProjectsPageSection } from "@/features/projects";
import { requestProjectsContent } from "@/lib/cache/request-dedupe";
import { JsonLd } from "@/seo/json-ld";
import { SEO_PAGE_KEYS } from "@/constants/seo-pages";
import { buildPageMetadata } from "@/services/seo/seo-resolver.service";
import { buildProjectsStructuredData } from "@/services/seo/seo-structured-data.service";

export const revalidate = 300;

function isProjectsPageAvailable(
  content: Awaited<ReturnType<typeof requestProjectsContent>>,
): boolean {
  return content.visible && content.entries.length > 0;
}

export async function generateMetadata() {
  const projects = await requestProjectsContent();

  if (!isProjectsPageAvailable(projects)) {
    return {
      title: "Projects",
      robots: { index: false, follow: false },
    };
  }

  return buildPageMetadata(SEO_PAGE_KEYS.PROJECTS, {
    title: "Projects",
    description: projects.hero.description,
    pathname: ROUTES.projects,
  });
}

export default async function ProjectsPage() {
  const projects = await requestProjectsContent();

  if (!isProjectsPageAvailable(projects)) {
    notFound();
  }

  const structuredData = await buildProjectsStructuredData({
    title: projects.hero.title,
    description: projects.hero.description,
    projects: projects.entries,
  });

  return (
    <>
      <JsonLd data={structuredData} />
      <ProjectsPageSection content={projects} headingLevel="h1" />
    </>
  );
}
