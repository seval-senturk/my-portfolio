import Link from "next/link";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
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
        title="SEO Management"
        description="Centralized SEO, structured data, sitemap, and search optimization controls."
      />

      <SeoAdminShell
        title="Overview"
        description="Monitor SEO coverage, health score, and quick links to all SEO modules."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Managed Pages" value={overview.pageCount} />
          <StatCard label="Blog Posts" value={overview.blogPostCount} />
          <StatCard label="Projects" value={overview.projectCount} />
          <StatCard label="Redirects" value={overview.redirectCount} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="admin-surface rounded-xl border p-5">
            <h3 className="text-small font-semibold">SEO Health Score</h3>
            <p className="mt-2 text-h2 font-semibold text-[var(--admin-brand,#7c3aed)]">
              {overview.healthScore}/100
            </p>
            <p className="mt-1 text-caption text-muted-foreground">
              {overview.issueCount} open issue{overview.issueCount === 1 ? "" : "s"}
            </p>
            <Link
              href={`${ADMIN_ROUTES.seo}/health`}
              className="mt-4 inline-block text-caption text-[var(--admin-brand,#7c3aed)] hover:underline"
            >
              View health report →
            </Link>
          </div>

          <div className="admin-surface rounded-xl border p-5">
            <h3 className="text-small font-semibold">AI SEO (Future)</h3>
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
              <h3 className="text-small font-semibold">Top Issues</h3>
            </div>
            <ul className="divide-y divide-border">
              {health.issues.slice(0, 8).map((issue) => (
                <li key={issue.id} className="px-5 py-3 text-small">
                  <span
                    className={
                      issue.severity === "error" ? "text-error" : "text-warning"
                    }
                  >
                    {issue.severity === "error" ? "Error" : "Warning"}
                  </span>
                  {" — "}
                  {issue.message}
                  {issue.fixHref ? (
                    <>
                      {" "}
                      <Link href={issue.fixHref} className="text-accent hover:underline">
                        Fix
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
