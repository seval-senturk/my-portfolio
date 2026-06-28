import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import { SeoStructuredDataEditor } from "@/features/admin/seo/components/seo-structured-data-editor";
import { listStructuredDataRules } from "@/services/admin/seo.admin.service";

export default async function SeoStructuredDataAdminPage() {
  const rules = await listStructuredDataRules();

  return (
    <div>
      <AdminPageHeader title={adminTr.seo.management} description={adminTr.seo.structuredData.pageDesc} />
      <SeoAdminShell
        title={adminTr.seo.navTitles.structuredData}
        description={adminTr.seo.structuredData.shellDesc}
      >
        <SeoStructuredDataEditor rules={rules} />
      </SeoAdminShell>
    </div>
  );
}
