import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import { buildDynamicRobots } from "@/services/seo/seo-sitemap.service";
import { getGlobalSeoSettings } from "@/services/admin/seo.admin.service";
import { listSeoPages } from "@/services/admin/seo.admin.service";

export default async function SeoRobotsAdminPage() {
  const [robots, globalSettings, pages] = await Promise.all([
    buildDynamicRobots(),
    getGlobalSeoSettings(),
    listSeoPages(),
  ]);

  return (
    <div>
      <AdminPageHeader title="SEO Management" description="Robots.txt and indexing controls." />
      <SeoAdminShell
        title="Robots Management"
        description="Global robots defaults are managed in Global Settings. Page-level overrides are configured in Page SEO."
      >
        <div className="admin-surface rounded-xl border p-5 text-small">
          <p>
            Default index:{" "}
            <strong>{globalSettings.defaultRobotsIndex ? "Index" : "No Index"}</strong>
          </p>
          <p className="mt-2">
            Default follow:{" "}
            <strong>{globalSettings.defaultRobotsFollow ? "Follow" : "No Follow"}</strong>
          </p>
          <p className="mt-4 text-caption text-muted-foreground">
            Public robots.txt:{" "}
            <a href="/robots.txt" className="text-accent hover:underline">
              /robots.txt
            </a>
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4 text-caption">
            {JSON.stringify(robots, null, 2)}
          </pre>
        </div>

        <div className="admin-surface mt-4 overflow-hidden rounded-xl border">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-small font-semibold">Page-level overrides</h3>
          </div>
          <table className="min-w-full text-left text-small">
            <thead className="bg-muted/40 text-caption uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Page</th>
                <th className="px-5 py-3 font-medium">Index</th>
                <th className="px-5 py-3 font-medium">Follow</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id} className="border-t border-border">
                  <td className="px-5 py-3">{page.label}</td>
                  <td className="px-5 py-3">
                    {page.robotsIndex == null
                      ? "Inherit"
                      : page.robotsIndex
                        ? "Index"
                        : "No Index"}
                  </td>
                  <td className="px-5 py-3">
                    {page.robotsFollow == null
                      ? "Inherit"
                      : page.robotsFollow
                        ? "Follow"
                        : "No Follow"}
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
