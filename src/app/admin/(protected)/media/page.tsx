export const dynamic = "force-dynamic";

import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { Text } from "@/components/ui/text";

export default function AdminMediaPage() {
  return (
    <div>
      <AdminPageHeader
        title="Media"
        description="Media library and Cloudinary integration — coming in a future phase."
      />
      <div className="admin-surface p-6">
        <Text tone="muted">
          Upload fields across the admin panel are Cloudinary-ready. A dedicated
          media manager with browsing, tagging, and reuse will be added here.
        </Text>
      </div>
    </div>
  );
}
