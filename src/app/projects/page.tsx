import { projectsContentService } from "@/content";
import { ROUTES } from "@/constants/routes";
import { ProjectsSection } from "@/features/projects";
import { createPageMetadata } from "@/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const projects = await projectsContentService.get();

  return createPageMetadata({
    title: "Projects",
    description: projects.section.description,
    pathname: ROUTES.projects,
  });
}

export default async function ProjectsPage() {
  const projects = await projectsContentService.get();

  return <ProjectsSection content={projects} titleAs="h1" />;
}
