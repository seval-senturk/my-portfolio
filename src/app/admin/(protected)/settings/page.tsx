export const dynamic = "force-dynamic";

import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { Text } from "@/components/ui/text";

export default function AdminSettingsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Site configuration, social links, and admin preferences."
      />
      <div className="admin-surface p-6">
        <Text tone="muted">
          Site settings are stored in the database. A settings editor for footer,
          social links, and site metadata will be added here.
        </Text>
      </div>
    </div>
  );
}
