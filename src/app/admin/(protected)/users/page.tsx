import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import { Text } from "@/components/ui/text";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={adminTr.users.title}
        description={adminTr.users.description}
      />
      <div className="admin-surface p-6">
        <Text tone="muted">{adminTr.users.placeholder}</Text>
      </div>
    </div>
  );
}

