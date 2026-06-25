import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import { SeoPagesEditor } from "@/features/admin/seo/components/seo-pages-editor";
import { listSeoPages } from "@/services/admin/seo.admin.service";

export default async function SeoPagesAdminPage() {
  const pages = await listSeoPages();

  return (
    <div>
      <AdminPageHeader title="SEO Management" description="Manage SEO for static site pages." />
      <SeoAdminShell
        title="Page SEO"
        description="Configure meta, Open Graph, Twitter, and robots directives per page."
      >
        <SeoPagesEditor pages={pages} />
      </SeoAdminShell>
    </div>
  );
}
