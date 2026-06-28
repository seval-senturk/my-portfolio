import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import { SeoProjectsEditor } from "@/features/admin/seo/components/seo-projects-editor";
import { listProjectSeoEntries } from "@/services/admin/seo.admin.service";

export default async function SeoProjectsAdminPage() {
  const projects = await listProjectSeoEntries();

  return (
    <div>
      <AdminPageHeader title={adminTr.seo.management} description={adminTr.seo.projects.pageDesc} />
      <SeoAdminShell
        title={adminTr.seo.navTitles.projectSeo}
        description={adminTr.seo.projects.shellDesc}
      >
        <SeoProjectsEditor projects={projects} />
      </SeoAdminShell>
    </div>
  );
}
