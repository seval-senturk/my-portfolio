import Link from "next/link";

import { adminQuickActions } from "@/config/admin-navigation.config";
import { getDashboardStats } from "@/services/admin";

import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { DashboardStatCard } from "@/features/admin/components/dashboard-stat-card";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";

export async function AdminDashboardView() {
  const stats = await getDashboardStats();

  const statCards = [
    {
      id: "projects",
      label: "Total Projects",
      value: stats.projects,
      description: "Published in project showcase",
    },
    {
      id: "blog",
      label: "Blog Posts",
      value: stats.blogPosts,
      description: "Draft and published posts",
    },
    {
      id: "experience",
      label: "Experience Entries",
      value: stats.experienceEntries,
      description: "Work history records",
    },
    {
      id: "skills",
      label: "Skills",
      value: stats.skills,
      description: "Skills and expertise items",
    },
    {
      id: "contact",
      label: "Contact Messages",
      value: stats.contactMessages,
      description: "Inbound leads in database",
    },
    {
      id: "resume",
      label: "Resume Status",
      value: stats.resumeUpdatedAt ?? "Not set",
      description: "Last content update date",
    },
  ] as const;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Your content management hub — monitor site data and jump into quick actions."
        actions={
          <Badge variant="accent">
            Site {stats.siteStatus}
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((stat) => (
          <DashboardStatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </div>

      <section className="admin-surface p-6">
        <div className="mb-4">
          <h2 className="text-h4 font-semibold">Quick Actions</h2>
          <Text tone="muted" className="mt-1">
            Common workflows to keep your portfolio up to date.
          </Text>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {adminQuickActions.map((action) => (
            <Link
              key={action.id}
              href={action.href}
              className="rounded-xl border border-border bg-background p-4 transition-base hover:border-foreground/20 hover:bg-muted/40"
            >
              <p className="text-small font-medium text-foreground">{action.label}</p>
              <p className="mt-1 text-caption text-muted-foreground">
                {action.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
