import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import { SeoRedirectsEditor } from "@/features/admin/seo/components/seo-redirects-editor";
import { listSeoRedirects } from "@/services/admin/seo.admin.service";

export default async function SeoRedirectsAdminPage() {
  const redirects = await listSeoRedirects();

  return (
    <div>
      <AdminPageHeader title={adminTr.seo.management} description={adminTr.seo.redirects.pageDesc} />
      <SeoAdminShell
        title={adminTr.seo.redirects.shellTitle}
        description={adminTr.seo.redirects.shellDesc}
      >
        <SeoRedirectsEditor redirects={redirects} />
      </SeoAdminShell>
    </div>
  );
}
