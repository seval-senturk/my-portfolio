import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import { SeoRedirectsEditor } from "@/features/admin/seo/components/seo-redirects-editor";
import { listSeoRedirects } from "@/services/admin/seo.admin.service";

export default async function SeoRedirectsAdminPage() {
  const redirects = await listSeoRedirects();

  return (
    <div>
      <AdminPageHeader title="SEO Management" description="Manage URL redirects." />
      <SeoAdminShell
        title="Redirect Management"
        description="Create 301/302/307/308 redirects to preserve link equity when URLs change."
      >
        <SeoRedirectsEditor redirects={redirects} />
      </SeoAdminShell>
    </div>
  );
}
