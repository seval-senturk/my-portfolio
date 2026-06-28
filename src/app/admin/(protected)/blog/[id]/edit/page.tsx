import { notFound } from "next/navigation";

import { getBlogPostEditorInitial } from "@/features/admin/blog/blog-admin-data";
import { BlogPostForm } from "@/features/admin/blog/components/blog-post-form";

interface AdminBlogEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminBlogEditPage({ params }: AdminBlogEditPageProps) {
  const { id } = await params;
  const context = await getBlogPostEditorInitial(id);

  if (!context) {
    notFound();
  }

  return (
    <BlogPostForm
      initial={context.initial}
      categories={context.categories}
      tags={context.tags}
      mode="edit"
    />
  );
}
