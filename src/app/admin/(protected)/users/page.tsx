export const dynamic = "force-dynamic";

import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { Text } from "@/components/ui/text";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users"
        description="Admin kullanıcı yönetimi — rol atama ve erişim kontrolü."
      />
      <div className="admin-surface p-6">
        <Text tone="muted">
          Kullanıcı modülü yakında eklenecek. Şimdilik admin hesapları veritabanı seed
          ve Google OAuth (yalnızca mevcut ADMIN rolüne sahip kullanıcılar) ile yönetilir.
        </Text>
      </div>
    </div>
  );
}
