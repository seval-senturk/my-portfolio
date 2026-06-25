export const dynamic = "force-dynamic";

import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { Text } from "@/components/ui/text";

export default function AdminContactPage() {
  return (
    <div>
      <AdminPageHeader
        title="Contact Messages"
        description="Review and manage inbound contact form submissions."
      />
      <div className="admin-surface p-6">
        <Text tone="muted">
          Contact messages are saved to the database. Inbox list, filtering, and
          status updates will be added using the reusable DataTable component.
        </Text>
      </div>
    </div>
  );
}
