export const dynamic = "force-dynamic";

import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { Text } from "@/components/ui/text";

export default function AdminSeoPage() {
  return (
    <div>
      <AdminPageHeader
        title="SEO"
        description="Manage SEO metadata for pages, blog posts, and projects."
      />
      <div className="admin-surface p-6">
        <Text tone="muted">
          SEO metadata is stored in the database via the SeoMetadata model. A
          dedicated SEO manager UI will connect here in a future phase.
        </Text>
      </div>
    </div>
  );
}
