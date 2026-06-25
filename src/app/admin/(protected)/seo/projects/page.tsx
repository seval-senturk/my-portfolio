import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import { SeoProjectsEditor } from "@/features/admin/seo/components/seo-projects-editor";
import { listProjectSeoEntries } from "@/services/admin/seo.admin.service";

export default async function SeoProjectsAdminPage() {
  const projects = await listProjectSeoEntries();

  return (
    <div>
      <AdminPageHeader title="SEO Management" description="Manage SEO metadata per project." />
      <SeoAdminShell
        title="Project SEO"
        description="Configure slug-aware SEO metadata for each portfolio project."
      >
        <SeoProjectsEditor projects={projects} />
      </SeoAdminShell>
    </div>
  );
}
