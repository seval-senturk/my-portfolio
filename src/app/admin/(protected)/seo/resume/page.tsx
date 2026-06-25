import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { saveResumeSeoAction } from "@/features/admin/actions/seo.actions";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import {
  seoRecordToFormInitial,
  SeoFieldsForm,
} from "@/features/admin/seo/components/seo-fields-form";
import { getResumeSeo } from "@/services/admin/seo.admin.service";

export default async function SeoResumeAdminPage() {
  const seo = await getResumeSeo();

  return (
    <div>
      <AdminPageHeader title="SEO Management" description="Resume Center SEO settings." />
      <SeoAdminShell
        title="Resume SEO"
        description="ATS-friendly resume page metadata. Content remains factual; only presentation is optimized."
      >
        <div className="admin-surface rounded-xl border p-6">
          <SeoFieldsForm action={saveResumeSeoAction} initial={seoRecordToFormInitial(seo ?? undefined)} />
        </div>
      </SeoAdminShell>
    </div>
  );
}
