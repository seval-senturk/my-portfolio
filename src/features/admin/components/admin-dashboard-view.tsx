import Link from "next/link";

import { adminQuickActions } from "@/config/admin-navigation.config";
import {
  buildContentDistribution,
  buildSiteVisitSeries,
  computeStatTrend,
  getDashboardStats,
  getRecentContent,
} from "@/services/admin/dashboard.service";
import { adminTr } from "@/features/admin/i18n/tr";

import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { DashboardDonutChart } from "@/features/admin/components/dashboard-donut-chart";
import { DashboardLineChart } from "@/features/admin/components/dashboard-line-chart";
import { DashboardRecentContent } from "@/features/admin/components/dashboard-recent-content";
import { DashboardStatCard } from "@/features/admin/components/dashboard-stat-card";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";

export async function AdminDashboardView() {
  const [stats, recentContent] = await Promise.all([
    getDashboardStats(),
    getRecentContent(),
  ]);

  const distribution = buildContentDistribution(stats);
  const visitSeries = buildSiteVisitSeries();

  const statCards = [
    {
      id: "projects",
      label: adminTr.dashboard.stats.projects.label,
      value: stats.projects,
      description: adminTr.dashboard.stats.projects.description,
      trend: computeStatTrend(stats.projects),
    },
    {
      id: "blog",
      label: adminTr.dashboard.stats.blog.label,
      value: stats.blogPosts,
      description: adminTr.dashboard.stats.blog.description,
      trend: computeStatTrend(stats.blogPosts),
    },
    {
      id: "experience",
      label: adminTr.dashboard.stats.experience.label,
      value: stats.experienceEntries,
      description: adminTr.dashboard.stats.experience.description,
      trend: computeStatTrend(stats.experienceEntries),
    },
    {
      id: "skills",
      label: adminTr.dashboard.stats.skills.label,
      value: stats.skills,
      description: adminTr.dashboard.stats.skills.description,
      trend: computeStatTrend(stats.skills),
    },
    {
      id: "contact",
      label: adminTr.dashboard.stats.contact.label,
      value: stats.contactMessages,
      description: adminTr.dashboard.stats.contact.description,
      trend: computeStatTrend(stats.contactMessages),
    },
    {
      id: "resume",
      label: adminTr.dashboard.stats.resume.label,
      value: stats.resumeUpdatedAt ?? adminTr.dashboard.stats.resume.unset,
      description: adminTr.dashboard.stats.resume.description,
    },
  ] as const;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={adminTr.dashboard.title}
        description={adminTr.dashboard.description}
        actions={
          <Badge variant="accent">
            Site{" "}
            {stats.siteStatus === "published"
              ? adminTr.dashboard.siteStatus.published
              : adminTr.dashboard.siteStatus.draft}
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
            trend={"trend" in stat ? stat.trend : undefined}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <DashboardLineChart data={visitSeries} title={adminTr.dashboard.siteVisits} />
        <DashboardDonutChart
          data={distribution}
          title={adminTr.dashboard.contentDistribution}
        />
      </div>

      <DashboardRecentContent items={recentContent} />

      <section className="admin-surface p-6">
        <div className="mb-4">
          <h2 className="text-h4 font-semibold">{adminTr.dashboard.quickActions}</h2>
          <Text tone="muted" className="mt-1">
            {adminTr.dashboard.quickActionsDescription}
          </Text>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {adminQuickActions.map((action) => (
            <Link
              key={action.id}
              href={action.href}
              className="rounded-xl border border-border bg-background p-4 transition-base hover:border-[var(--admin-brand,#7c3aed)]/40 hover:bg-[var(--admin-brand-muted,rgb(124_58_237_/_0.12))]"
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
