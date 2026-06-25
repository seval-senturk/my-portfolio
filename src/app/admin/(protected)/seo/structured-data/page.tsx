import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import { SeoStructuredDataEditor } from "@/features/admin/seo/components/seo-structured-data-editor";
import { listStructuredDataRules } from "@/services/admin/seo.admin.service";

export default async function SeoStructuredDataAdminPage() {
  const rules = await listStructuredDataRules();

  return (
    <div>
      <AdminPageHeader title="SEO Management" description="Manage JSON-LD schema generation." />
      <SeoAdminShell
        title="Structured Data"
        description="Enable or disable automatic JSON-LD schema types across the site."
      >
        <SeoStructuredDataEditor rules={rules} />
      </SeoAdminShell>
    </div>
  );
}
