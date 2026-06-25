export const dynamic = "force-dynamic";

import { listBlogPostsAdmin } from "@/services/admin/blog.admin.service";
import { BlogAdminView } from "@/features/admin/blog/components/blog-admin-view";

export default async function AdminBlogPage() {
  const posts = await listBlogPostsAdmin();

  const entries = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    status: post.status.toLowerCase(),
    featured: post.featured,
    readingTimeMinutes: post.readingTimeMinutes,
    updatedAt: post.updatedAt.toISOString(),
    categoryNames: post.categories.map((item) => item.category.name),
  }));

  return <BlogAdminView entries={entries} />;
}
