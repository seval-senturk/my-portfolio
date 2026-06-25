import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import { SeoAiCareerForm } from "@/features/admin/seo/components/seo-ai-career-form";
import { getAiCareerSeo } from "@/services/admin/seo.admin.service";

export default async function SeoAiCareerAdminPage() {
  const settings = await getAiCareerSeo();

  return (
    <div>
      <AdminPageHeader
        title="SEO Management"
        description="Prepare SEO for the future AI Career Platform SaaS module."
      />
      <SeoAdminShell
        title="AI Career SEO"
        description="Landing page, tool SEO, FAQ schema, and feature schema settings for /career."
      >
        <SeoAiCareerForm initial={settings} />
      </SeoAdminShell>
    </div>
  );
}
