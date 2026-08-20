import { notFound } from "next/navigation";

import { ROUTES } from "@/constants/routes";
import { SEO_ENTITY_TYPES } from "@/constants/seo-pages";
import { ProjectDetailView } from "@/features/projects/components/project-detail-view";
import { requestProjectBySlug } from "@/lib/cache/request-dedupe";
import { JsonLd } from "@/seo/json-ld";
import { createPageMetadata } from "@/seo/metadata";
import { buildEntityMetadata } from "@/services/seo/seo-resolver.service";
import { buildProjectDetailStructuredData } from "@/services/seo/seo-structured-data.service";
import { Container } from "@/components/ui/container";

export const revalidate = 300;

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await requestProjectBySlug(slug);

  if (!project) {
    return createPageMetadata({ title: "Project not found", noIndex: true });
  }

  return buildEntityMetadata(SEO_ENTITY_TYPES.PROJECT, project.id, {
    title: project.title,
    description: project.shortDescription,
    pathname: `${ROUTES.projects}/${project.slug}`,
    ogImagePath: project.coverImage,
  });
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await requestProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const structuredData = await buildProjectDetailStructuredData(project);

  return (
    <section className="project-detail-page">
      <JsonLd data={structuredData} />
      <Container size="wide">
        <ProjectDetailView project={project} />
      </Container>
    </section>
  );
}
