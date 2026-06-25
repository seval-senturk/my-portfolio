import Link from "next/link";

import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import { getSeoHealthReport } from "@/services/admin/seo.admin.service";

export default async function SeoHealthAdminPage() {
  const health = await getSeoHealthReport();

  return (
    <div>
      <AdminPageHeader title="SEO Management" description="SEO health audit and issue tracking." />
      <SeoAdminShell
        title="SEO Health Dashboard"
        description="Detect missing metadata, duplicate titles, broken canonicals, and invalid redirects."
      >
        <div className="admin-surface rounded-xl border p-5">
          <p className="text-caption text-muted-foreground">Health score</p>
          <p className="mt-1 text-h2 font-semibold text-[var(--admin-brand,#7c3aed)]">
            {health.score}/100
          </p>
          <p className="mt-2 text-small text-muted-foreground">
            {health.issueCount} issue{health.issueCount === 1 ? "" : "s"} detected
          </p>
        </div>

        <div className="admin-surface mt-4 overflow-hidden rounded-xl border">
          <table className="min-w-full text-left text-small">
            <thead className="bg-muted/40 text-caption uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Severity</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Entity</th>
                <th className="px-5 py-3 font-medium">Message</th>
                <th className="px-5 py-3 font-medium">Fix</th>
              </tr>
            </thead>
            <tbody>
              {health.issues.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-muted-foreground">
                    No SEO issues detected. Great job!
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
                          Fix
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
