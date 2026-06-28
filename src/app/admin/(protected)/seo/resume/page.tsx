import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { saveResumeSeoAction } from "@/features/admin/actions/seo.actions";
import { adminTr } from "@/features/admin/i18n/tr";
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
      <AdminPageHeader title={adminTr.seo.management} description={adminTr.seo.resume.pageDesc} />
      <SeoAdminShell
        title={adminTr.seo.navTitles.resumeSeo}
        description={adminTr.seo.resume.shellDesc}
      >
        <div className="admin-surface rounded-xl border p-6">
          <SeoFieldsForm action={saveResumeSeoAction} initial={seoRecordToFormInitial(seo ?? undefined)} />
        </div>
      </SeoAdminShell>
    </div>
  );
}
