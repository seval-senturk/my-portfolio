import { listBlogTagsAdmin } from "@/services/admin/blog-tag.admin.service";
import { BlogTagsAdminView } from "@/features/admin/blog/components/blog-tags-admin-view";

export default async function AdminBlogTagsPage() {
  const tags = await listBlogTagsAdmin();

  return (
    <BlogTagsAdminView
      entries={tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        postCount: tag._count.posts,
      }))}
    />
  );
}

