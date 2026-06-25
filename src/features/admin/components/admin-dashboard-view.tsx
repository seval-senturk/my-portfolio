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
      label: "Toplam Proje",
      value: stats.projects,
      description: "Proje vitrininde yayınlanan",
      trend: computeStatTrend(stats.projects),
    },
    {
      id: "blog",
      label: "Blog Yazıları",
      value: stats.blogPosts,
      description: "Taslak ve yayınlanmış yazılar",
      trend: computeStatTrend(stats.blogPosts),
    },
    {
      id: "experience",
      label: "Deneyim Kayıtları",
      value: stats.experienceEntries,
      description: "İş geçmişi girişleri",
      trend: computeStatTrend(stats.experienceEntries),
    },
    {
      id: "skills",
      label: "Yetenekler",
      value: stats.skills,
      description: "Beceri ve uzmanlık öğeleri",
      trend: computeStatTrend(stats.skills),
    },
    {
      id: "contact",
      label: "İletişim Mesajları",
      value: stats.contactMessages,
      description: "Veritabanındaki gelen talepler",
      trend: computeStatTrend(stats.contactMessages),
    },
    {
      id: "resume",
      label: "Özgeçmiş Durumu",
      value: stats.resumeUpdatedAt ?? "Ayarlanmadı",
      description: "Son içerik güncelleme tarihi",
    },
  ] as const;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="İçerik yönetim merkeziniz — site verilerini izleyin ve hızlı işlemlere geçin."
        actions={
          <Badge variant="accent">
            Site {stats.siteStatus === "published" ? "yayında" : "taslak"}
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
          <h2 className="text-h4 font-semibold">Hızlı İşlemler</h2>
          <Text tone="muted" className="mt-1">
            Portfolyonuzu güncel tutmak için sık kullanılan iş akışları.
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
