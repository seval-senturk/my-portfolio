export const dynamic = "force-dynamic";

import { AdminPlaceholderPage } from "@/features/admin/components/admin-placeholder-page";

export default function AdminSettingsPage() {
  return (
    <AdminPlaceholderPage
      title="Settings"
      description="Site settings, SEO defaults, and admin configuration will be managed here."
    />
  );
}
