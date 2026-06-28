import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import { SeoAiCareerForm } from "@/features/admin/seo/components/seo-ai-career-form";
import { getAiCareerSeo } from "@/services/admin/seo.admin.service";

export default async function SeoAiCareerAdminPage() {
  const settings = await getAiCareerSeo();

  return (
    <div>
      <AdminPageHeader
        title={adminTr.seo.management}
        description={adminTr.seo.aiCareer.pageDesc}
      />
      <SeoAdminShell
        title={adminTr.seo.navTitles.aiCareerSeo}
        description={adminTr.seo.aiCareer.shellDesc}
      >
        <SeoAiCareerForm initial={settings} />
      </SeoAdminShell>
    </div>
  );
}
