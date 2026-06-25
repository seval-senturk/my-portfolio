import Link from "next/link";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import { listBlogSeoEntries } from "@/services/admin/seo.admin.service";
import { Badge } from "@/components/ui/badge";

export default async function SeoBlogAdminPage() {
  const entries = await listBlogSeoEntries();

  return (
    <div>
      <AdminPageHeader title="SEO Management" description="Review blog post SEO coverage." />
      <SeoAdminShell
        title="Blog SEO"
        description="Edit full SEO fields inside each blog post editor. This view shows coverage status."
      >
        <div className="admin-surface overflow-hidden rounded-xl border">
          <table className="min-w-full text-left text-small">
            <thead className="bg-muted/40 text-caption uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">SEO Title</th>
                <th className="px-5 py-3 font-medium">Description</th>
                <th className="px-5 py-3 font-medium">Actions</th>
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
                      Edit SEO
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
