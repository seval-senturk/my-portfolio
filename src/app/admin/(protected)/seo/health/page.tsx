import Link from "next/link";

import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import { getSeoHealthReport } from "@/services/admin/seo.admin.service";

export default async function SeoHealthAdminPage() {
  const health = await getSeoHealthReport();

  return (
    <div>
      <AdminPageHeader title={adminTr.seo.management} description={adminTr.seo.health.pageDesc} />
      <SeoAdminShell
        title={adminTr.seo.health.shellTitle}
        description={adminTr.seo.health.shellDesc}
      >
        <div className="admin-surface rounded-xl border p-5">
          <p className="text-caption text-muted-foreground">{adminTr.seo.health.score}</p>
          <p className="mt-1 text-h2 font-semibold text-[var(--admin-brand,#7c3aed)]">
            {health.score}/100
          </p>
          <p className="mt-2 text-small text-muted-foreground">
            {health.issueCount} {adminTr.seo.health.issuesDetected}
          </p>
        </div>

        <div className="admin-surface mt-4 overflow-hidden rounded-xl border">
          <table className="min-w-full text-left text-small">
            <thead className="bg-muted/40 text-caption uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">{adminTr.seo.health.columns.severity}</th>
                <th className="px-5 py-3 font-medium">{adminTr.seo.health.columns.category}</th>
                <th className="px-5 py-3 font-medium">{adminTr.seo.health.columns.entity}</th>
                <th className="px-5 py-3 font-medium">{adminTr.seo.health.columns.message}</th>
                <th className="px-5 py-3 font-medium">{adminTr.common.fix}</th>
              </tr>
            </thead>
            <tbody>
              {health.issues.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-muted-foreground">
                    {adminTr.seo.health.noIssues}
                  </td>
                </tr>
              ) : (
                health.issues.map((issue) => (
                  <tr key={issue.id} className="border-t border-border">
                    <td className="px-5 py-3">
                      <span className={issue.severity === "error" ? "text-error" : "text-warning"}>
                        {issue.severity}
                      </span>
                    </td>
                    <td className="px-5 py-3">{issue.category}</td>
                    <td className="px-5 py-3">{issue.entityLabel}</td>
                    <td className="px-5 py-3">{issue.message}</td>
                    <td className="px-5 py-3">
                      {issue.fixHref ? (
                        <Link href={issue.fixHref} className="text-accent hover:underline">
                          {adminTr.common.fix}
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SeoAdminShell>
    </div>
  );
}
