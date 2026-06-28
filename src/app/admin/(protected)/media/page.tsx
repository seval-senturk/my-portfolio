import { MediaLibraryView } from "@/features/admin/media/components/media-library-view";
import { getMediaLibraryOverview } from "@/services/admin/media.admin.service";

export default async function AdminMediaPage() {
  const overview = await getMediaLibraryOverview({
    pageSize: 48,
    sortBy: "uploadedAt",
    sortOrder: "desc",
  });

  return <MediaLibraryView initialData={overview} />;
}

