import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import { buildDynamicSitemap } from "@/services/seo/seo-sitemap.service";
import { seoRepository } from "@/repositories/prisma/seo.repository";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";

export default async function SeoSitemapAdminPage() {
  const [entries, globalSettings] = await Promise.all([
    buildDynamicSitemap(),
    seoRepository.getGlobalSettings(DEFAULT_LOCALE),
  ]);
  const siteUrl = seoRepository.resolveSiteUrl(globalSettings);

  return (
    <div>
      <AdminPageHeader title={adminTr.seo.management} description={adminTr.seo.sitemap.pageDesc} />
      <SeoAdminShell
        title={adminTr.seo.sitemap.shellTitle}
        description={adminTr.seo.sitemap.shellDesc}
      >
        <div className="admin-surface rounded-xl border p-5">
          <p className="text-small text-muted-foreground">
            Public URL:{" "}
            <a href="/sitemap.xml" className="text-accent hover:underline">
              {siteUrl}/sitemap.xml
            </a>
          </p>
          <p className="mt-2 text-caption text-muted-foreground">
            {entries.length} URLs indexed automatically.
          </p>
        </div>

        <div className="admin-surface mt-4 overflow-hidden rounded-xl border">
          <table className="min-w-full text-left text-small">
            <thead className="bg-muted/40 text-caption uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">URL</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Frequency</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.url} className="border-t border-border">
                  <td className="px-5 py-3 font-mono text-caption">{entry.url}</td>
                  <td className="px-5 py-3">{entry.priority ?? "—"}</td>
                  <td className="px-5 py-3">{entry.changeFrequency ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SeoAdminShell>
    </div>
  );
}
