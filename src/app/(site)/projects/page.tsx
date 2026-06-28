import { ROUTES } from "@/constants/routes";
import { ProjectsSection } from "@/features/projects";
import { requestProjectsContent } from "@/lib/cache/request-dedupe";
import { JsonLd } from "@/seo/json-ld";
import { SEO_PAGE_KEYS } from "@/constants/seo-pages";
import { buildPageMetadata } from "@/services/seo/seo-resolver.service";
import { buildProjectsStructuredData } from "@/services/seo/seo-structured-data.service";

export const revalidate = 300;

export async function generateMetadata() {
  const projects = await requestProjectsContent();

  return buildPageMetadata(SEO_PAGE_KEYS.PROJECTS, {
    title: "Projects",
    description: projects.section.description,
    pathname: ROUTES.projects,
  });
}

export default async function ProjectsPage() {
  const projects = await requestProjectsContent();
  const structuredData = await buildProjectsStructuredData({
    title: projects.section.title,
    description: projects.section.description,
    projects: projects.entries,
  });

  return (
    <>
      <JsonLd data={structuredData} />
      <ProjectsSection content={projects} titleAs="h1" />
    </>
  );
}
