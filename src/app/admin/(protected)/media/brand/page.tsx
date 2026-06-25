export const dynamic = "force-dynamic";

import { BrandAssetsView } from "@/features/admin/media/components/brand-assets-view";
import { getMediaLibraryOverview } from "@/services/admin/media.admin.service";

export default async function AdminBrandAssetsPage() {
  const overview = await getMediaLibraryOverview();

  return (
    <BrandAssetsView assignments={overview.brandAssignments} assets={overview.brandAssets} />
  );
}
