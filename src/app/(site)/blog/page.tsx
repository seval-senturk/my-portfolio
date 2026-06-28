import { blogContentService } from "@/content";
import { ROUTES } from "@/constants/routes";
import { BlogListingSection } from "@/features/blog";
import { SEO_PAGE_KEYS } from "@/constants/seo-pages";
import { requestBlogContent } from "@/lib/cache/request-dedupe";
import { absoluteUrl } from "@/lib/url";
import { buildPageMetadata } from "@/services/seo/seo-resolver.service";

export const revalidate = 300;

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

function hasActiveFilters(params: {
  category?: string;
  tag?: string;
  featured?: string;
  year?: string;
  month?: string;
  q?: string;
}): boolean {
  return Boolean(
    params.category ||
      params.tag ||
      params.featured ||
      params.year ||
      params.month ||
      params.q,
  );
}

export async function generateMetadata({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const blog = await requestBlogContent();
  const metadata = await buildPageMetadata(SEO_PAGE_KEYS.BLOG, {
    title: "Blog",
    description: blog.section.description,
    pathname: ROUTES.blog,
  });

  if (!hasActiveFilters(params)) {
    return metadata;
  }

  return {
    ...metadata,
    alternates: {
      canonical: absoluteUrl(ROUTES.blog),
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const blog = await requestBlogContent();
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
