import { saveGlobalSeoAction } from "@/features/admin/actions/seo.actions";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import { SeoGlobalForm } from "@/features/admin/seo/components/seo-global-form";
import { getGlobalSeoSettings } from "@/services/admin/seo.admin.service";

export default async function SeoGlobalPage() {
  const settings = await getGlobalSeoSettings();

  return (
    <div>
      <AdminPageHeader
        title="SEO Management"
        description="Configure site-wide default SEO values."
      />
      <SeoAdminShell
        title="Global SEO Settings"
        description="These defaults apply when page or entity SEO fields are empty."
      >
        <SeoGlobalForm initial={settings} action={saveGlobalSeoAction} />
      </SeoAdminShell>
    </div>
  );
}
