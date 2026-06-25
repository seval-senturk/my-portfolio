export const dynamic = "force-dynamic";

import { listBlogCategoriesAdmin } from "@/services/admin/blog-category.admin.service";
import { BlogCategoriesAdminView } from "@/features/admin/blog/components/blog-categories-admin-view";

export default async function AdminBlogCategoriesPage() {
  const categories = await listBlogCategoriesAdmin();

  return (
    <BlogCategoriesAdminView
      entries={categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        postCount: category._count.posts,
      }))}
    />
  );
}
