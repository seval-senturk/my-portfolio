import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import { SeoPagesEditor } from "@/features/admin/seo/components/seo-pages-editor";
import { listSeoPages } from "@/services/admin/seo.admin.service";

export default async function SeoPagesAdminPage() {
  const pages = await listSeoPages();

  return (
    <div>
      <AdminPageHeader title={adminTr.seo.management} description={adminTr.seo.pages.pageDesc} />
      <SeoAdminShell
        title={adminTr.seo.navTitles.pageSeo}
        description={adminTr.seo.pages.shellDesc}
      >
        <SeoPagesEditor pages={pages} />
      </SeoAdminShell>
    </div>
  );
}
