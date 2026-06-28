import { saveGlobalSeoAction } from "@/features/admin/actions/seo.actions";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import { SeoAdminShell } from "@/features/admin/seo/components/seo-admin-shell";
import { SeoGlobalForm } from "@/features/admin/seo/components/seo-global-form";
import { getGlobalSeoSettings } from "@/services/admin/seo.admin.service";

export default async function SeoGlobalPage() {
  const settings = await getGlobalSeoSettings();

  return (
    <div>
      <AdminPageHeader
        title={adminTr.seo.management}
        description={adminTr.seo.global.pageDesc}
      />
      <SeoAdminShell
        title={adminTr.seo.global.shellTitle}
        description={adminTr.seo.global.shellDesc}
      >
        <SeoGlobalForm initial={settings} action={saveGlobalSeoAction} />
      </SeoAdminShell>
    </div>
  );
}
