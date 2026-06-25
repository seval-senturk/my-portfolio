export const dynamic = "force-dynamic";

import { SettingsAdminView } from "@/features/admin/components/settings-admin-view";
import {
  getPlatformEnvironmentInfo,
  getPlatformSettings,
} from "@/services/platform/settings.service";

export default async function AdminSettingsPage() {
  const [settings, environment] = await Promise.all([
    getPlatformSettings(),
    Promise.resolve(getPlatformEnvironmentInfo()),
  ]);

  return <SettingsAdminView settings={settings} environment={environment} />;
}
