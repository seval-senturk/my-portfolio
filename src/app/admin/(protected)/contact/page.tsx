import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import { Text } from "@/components/ui/text";

export default function AdminContactPage() {
  return (
    <div>
      <AdminPageHeader
        title={adminTr.contact.title}
        description={adminTr.contact.description}
      />
      <div className="admin-surface p-6">
        <Text tone="muted">{adminTr.contact.placeholder}</Text>
      </div>
    </div>
  );
}

