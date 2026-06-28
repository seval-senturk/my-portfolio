import Link from "next/link";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import { listBlogSeoEntries } from "@/services/admin/seo.admin.service";
import { Badge } from "@/components/ui/badge";

export default async function SeoBlogAdminPage() {
  const entries = await listBlogSeoEntries();

  return (
    <div>
      <AdminPageHeader title={adminTr.seo.management} description={adminTr.seo.blog.pageDesc} />
      <SeoAdminShell
        title={adminTr.seo.navTitles.blogSeo}
        description={adminTr.seo.blog.shellDesc}
      >
        <div className="admin-surface overflow-hidden rounded-xl border">
          <table className="min-w-full text-left text-small">
            <thead className="bg-muted/40 text-caption uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">{adminTr.common.name}</th>
                <th className="px-5 py-3 font-medium">{adminTr.common.status}</th>
                <th className="px-5 py-3 font-medium">SEO Title</th>
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium">{adminTr.common.actions}</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-t border-border">
                  <td className="px-5 py-3 font-medium">{entry.title}</td>
                  <td className="px-5 py-3">
                    <Badge variant={entry.status === "PUBLISHED" ? "accent" : "secondary"}>
                      {entry.status.toLowerCase()}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {entry.seo?.metaTitle ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {entry.seo?.metaDescription ? "✓" : "—"}
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`${ADMIN_ROUTES.blog}/${entry.id}/edit`}
                      className="text-accent hover:underline"
                    >
                      {adminTr.common.edit} SEO
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SeoAdminShell>
    </div>
  );
}
