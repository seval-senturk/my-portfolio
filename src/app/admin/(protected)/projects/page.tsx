import { listProjectEntries } from "@/services/admin";
import { ProjectsAdminView } from "@/features/admin/components/projects-admin-view";

export default async function AdminProjectsPage() {
  const entries = await listProjectEntries();

  return (
    <ProjectsAdminView
      entries={entries.map((entry) => ({
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
        githubUrl: entry.githubUrl,
        liveUrl: entry.liveUrl,
        technologies: entry.technologies.map((item) => item.technology.name),
        highlights: entry.highlights,
      }))}
    />
  );
}

