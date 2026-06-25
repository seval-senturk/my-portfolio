export const dynamic = "force-dynamic";

import { getBlogPostEditorInitial } from "@/features/admin/blog/blog-admin-data";
import { BlogPostForm } from "@/features/admin/blog/components/blog-post-form";

export default async function AdminBlogNewPage() {
  const context = await getBlogPostEditorInitial();

  if (!context) {
    return null;
  }

  return (
    <BlogPostForm
      initial={context.initial}
      categories={context.categories}
      tags={context.tags}
      mode="create"
    />
  );
}
