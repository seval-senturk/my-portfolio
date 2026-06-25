import { notFound } from "next/navigation";

import { SEO_ENTITY_TYPES } from "@/constants/seo-pages";
import { blogContentService } from "@/content";
import { ROUTES } from "@/constants/routes";
import { BlogArticle, BlogBreadcrumb, BlogRelatedPosts } from "@/features/blog";
import { JsonLd } from "@/seo/json-ld";
import { buildEntityMetadata } from "@/services/seo/seo-resolver.service";
import { buildBlogPostingStructuredData } from "@/services/seo/seo-structured-data.service";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { createPageMetadata } from "@/seo/metadata";

export const dynamic = "force-dynamic";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await blogContentService.getPostBySlug(slug);

  if (!post) {
    return createPageMetadata({ title: "Article not found", noIndex: true });
  }

  return buildEntityMetadata(SEO_ENTITY_TYPES.BLOG_POST, post.id, {
    title: post.seo.metaTitle ?? post.title,
    description: post.seo.metaDescription ?? post.excerpt,
    pathname: `${ROUTES.blog}/${post.slug}`,
    ogImagePath: post.seo.ogImage?.url ?? post.coverImage,
    ogType: "article",
  });
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await blogContentService.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [relatedPosts, structuredData] = await Promise.all([
    blogContentService.getRelatedPosts(post.id),
    buildBlogPostingStructuredData({
      title: post.title,
      description: post.excerpt,
      slug: post.slug,
      authorName: post.author.name,
      publishedAt: post.meta.publishedAt,
      updatedAt: post.meta.updatedAt,
      imageUrl: post.seo.ogImage?.url ?? post.coverImage,
    }),
  ]);

  return (
    <Section>
      <JsonLd data={structuredData} />
      <Container className="space-y-8">
        <BlogBreadcrumb
          items={[
            { label: "Blog", href: ROUTES.blog },
            { label: post.title },
          ]}
        />
        <BlogArticle post={post} />
        <BlogRelatedPosts posts={relatedPosts} />
      </Container>
    </Section>
  );
}
