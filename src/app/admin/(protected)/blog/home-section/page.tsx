import {
  getBlogHomeConfig,
  listBlogHomeCuratedPosts,
  listPublishedBlogPostsForPicker,
} from "@/services/admin";
import { BlogHomeAdminView } from "@/features/admin/components/blog-home-admin-view";
import { blogHomeContent } from "@/data/blog-home.data";

export default async function AdminBlogHomeSectionPage() {
  const [config, curatedPosts, publishedPosts] = await Promise.all([
    getBlogHomeConfig(),
    listBlogHomeCuratedPosts(),
    listPublishedBlogPostsForPicker(),
  ]);

  const fallback = blogHomeContent.section;

  return (
    <BlogHomeAdminView
      config={{
        label: config?.label ?? fallback.label,
        title: config?.title ?? fallback.title,
        titleAccent: config?.titleAccent ?? fallback.titleAccent ?? "",
        description: config?.description ?? fallback.description,
        sectionNumber: config?.sectionNumber ?? fallback.sectionNumber,
        visible: config?.visible ?? fallback.visible,
        carouselEnabled: config?.carouselEnabled ?? fallback.carousel.enabled,
        autoplay: config?.autoplay ?? fallback.carousel.autoplay,
        autoplayDelayMs: config?.autoplayDelayMs ?? fallback.carousel.autoplayDelayMs,
        loop: config?.loop ?? fallback.carousel.loop,
        postLimit: config?.postLimit ?? fallback.postLimit,
        selectionMode:
          (config?.selectionMode as "latest" | "featured" | "curated") ??
          fallback.selectionMode,
        readMoreLabel: config?.readMoreLabel ?? fallback.readMoreLabel,
        ctaLabel: config?.ctaLabel ?? fallback.ctaLabel ?? "",
        ctaHref: config?.ctaHref ?? fallback.ctaHref ?? "",
      }}
      curatedPosts={curatedPosts.map((entry) => ({
        id: entry.id,
        blogPostId: entry.blogPostId,
        sortOrder: entry.sortOrder,
        visible: entry.visible,
        title: entry.blogPost.title,
        slug: entry.blogPost.slug,
        status: entry.blogPost.status,
      }))}
      publishedPosts={publishedPosts}
    />
  );
}
