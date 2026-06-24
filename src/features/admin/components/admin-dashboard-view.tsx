import {
  blogContentService,
  experienceContentService,
  projectsContentService,
} from "@/content";

import { DashboardStatCard } from "@/features/admin/components/dashboard-stat-card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export async function AdminDashboardView() {
  const [projects, experience, blog] = await Promise.all([
    projectsContentService.get(),
    experienceContentService.get(),
    blogContentService.get(),
  ]);

  const stats = [
    {
      id: "projects",
      label: "Total Projects",
      value: projects.entries.length,
      description: "Published in project showcase",
    },
    {
      id: "experience",
      label: "Experience Entries",
      value: experience.entries.length,
      description: "Work history records",
    },
    {
      id: "blog",
      label: "Blog Posts",
      value: blog.posts.length,
      description: "Draft and published posts",
    },
    {
      id: "contact",
      label: "Contact Messages",
      value: 0,
      description: "Inbound leads (database integration pending)",
    },
  ] as const;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <Heading as="h1">Dashboard</Heading>
        <Text tone="muted">
          Foundation overview for upcoming CMS and content management
          workflows.
        </Text>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardStatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </div>
    </div>
  );
}
