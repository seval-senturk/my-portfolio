import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

import { BlogArticle } from "@/features/blog/components/blog-article";
import { mapBlogPostToContent } from "@/repositories/prisma/mappers/blog.mapper";
import { getBlogPostAdmin } from "@/services/admin/blog.admin.service";
import { prisma } from "@/lib/prisma";

interface AdminBlogPreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminBlogPreviewPage({ params }: AdminBlogPreviewPageProps) {
  const { id } = await params;
  const post = await getBlogPostAdmin(id);

  if (!post) {
    notFound();
  }

  const seo = await prisma.seoMetadata.findUnique({
    where: {
      entityType_entityId: { entityType: "blog_post", entityId: post.id },
    },
  });

  const article = mapBlogPostToContent(post, seo);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-small">
        Preview mode — this article is <strong>{post.status.toLowerCase()}</strong> and may not
        be visible on the public site.
      </div>
      <BlogArticle post={article} preview />
    </div>
  );
}
