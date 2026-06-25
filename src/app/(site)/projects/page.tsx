import { projectsContentService } from "@/content";
import { ROUTES } from "@/constants/routes";
import { ProjectsSection } from "@/features/projects";
import { SEO_PAGE_KEYS } from "@/constants/seo-pages";
import { buildPageMetadata } from "@/services/seo/seo-resolver.service";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const projects = await projectsContentService.get();

  return buildPageMetadata(SEO_PAGE_KEYS.PROJECTS, {
    title: "Projects",
    description: projects.section.description,
    pathname: ROUTES.projects,
  });
}

export default async function ProjectsPage() {
  const projects = await projectsContentService.get();

  return <ProjectsSection content={projects} titleAs="h1" />;
}
