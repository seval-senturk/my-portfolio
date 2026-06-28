import Link from "next/link";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import { getSeoDashboardOverview, getSeoHealthReport } from "@/services/admin/seo.admin.service";
import { AI_SEO_CAPABILITIES } from "@/types/seo-management";

export default async function SeoOverviewPage() {
  const [overview, health] = await Promise.all([
    getSeoDashboardOverview(),
    getSeoHealthReport(),
  ]);

  return (
    <div>
      <AdminPageHeader
        title={adminTr.seo.management}
        description={adminTr.seo.overview.desc}
      />

      <SeoAdminShell
        title={adminTr.seo.overview.shellTitle}
        description={adminTr.seo.overview.shellDesc}
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label={adminTr.seo.overview.managedPages} value={overview.pageCount} />
          <StatCard label={adminTr.seo.overview.blogPosts} value={overview.blogPostCount} />
          <StatCard label={adminTr.seo.overview.projects} value={overview.projectCount} />
          <StatCard label={adminTr.seo.overview.redirects} value={overview.redirectCount} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="admin-surface rounded-xl border p-5">
            <h3 className="text-small font-semibold">{adminTr.seo.overview.healthScore}</h3>
            <p className="mt-2 text-h2 font-semibold text-[var(--admin-brand,#7c3aed)]">
              {overview.healthScore}/100
            </p>
            <p className="mt-1 text-caption text-muted-foreground">
              {overview.issueCount} {adminTr.seo.overview.openIssues}
            </p>
            <Link
              href={`${ADMIN_ROUTES.seo}/health`}
              className="mt-4 inline-block text-caption text-[var(--admin-brand,#7c3aed)] hover:underline"
            >
              {adminTr.seo.overview.viewHealth}
            </Link>
          </div>

          <div className="admin-surface rounded-xl border p-5">
            <h3 className="text-small font-semibold">{adminTr.seo.overview.aiSeoFuture}</h3>
            <ul className="mt-3 space-y-1 text-caption text-muted-foreground">
              {Object.entries(AI_SEO_CAPABILITIES).map(([key, enabled]) => (
                <li key={key}>
                  {enabled ? "✓" : "○"} {key}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {health.issues.length > 0 ? (
          <div className="admin-surface mt-6 overflow-hidden rounded-xl border">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-small font-semibold">{adminTr.seo.overview.topIssues}</h3>
            </div>
            <ul className="divide-y divide-border">
              {health.issues.slice(0, 8).map((issue) => (
                <li key={issue.id} className="px-5 py-3 text-small">
                  <span
                    className={
                      issue.severity === "error" ? "text-error" : "text-warning"
                    }
                  >
                    {issue.severity === "error"
                      ? adminTr.seo.overview.severity.error
                      : adminTr.seo.overview.severity.warning}
                  </span>
                  {" — "}
                  {issue.message}
                  {issue.fixHref ? (
                    <>
                      {" "}
                      <Link href={issue.fixHref} className="text-accent hover:underline">
                        {adminTr.common.fix}
                      </Link>
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </SeoAdminShell>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="admin-surface rounded-xl border p-5">
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className="mt-2 text-h3 font-semibold">{value}</p>
    </div>
  );
}
