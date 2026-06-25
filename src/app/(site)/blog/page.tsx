import { blogContentService } from "@/content";
import { ROUTES } from "@/constants/routes";
import { BlogListingSection } from "@/features/blog";
import { SEO_PAGE_KEYS } from "@/constants/seo-pages";
import { buildPageMetadata } from "@/services/seo/seo-resolver.service";

export const dynamic = "force-dynamic";

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    tag?: string;
    featured?: string;
    year?: string;
    month?: string;
    q?: string;
  }>;
}

export async function generateMetadata() {
  const blog = await blogContentService.get();

  return buildPageMetadata(SEO_PAGE_KEYS.BLOG, {
    title: "Blog",
    description: blog.section.description,
    pathname: ROUTES.blog,
  });
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const blog = await blogContentService.get();
  const posts = await blogContentService.listPublishedPosts({
    categorySlug: params.category,
    tagSlug: params.tag,
    featured: params.featured === "1",
    year: params.year ? Number(params.year) : undefined,
    month: params.month ? Number(params.month) : undefined,
    query: params.q,
  });

  return (
    <BlogListingSection
      content={blog}
      posts={posts}
      activeCategory={params.category}
      activeTag={params.tag}
      featured={params.featured === "1"}
    />
  );
}
