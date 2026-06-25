import { siteConfig } from "@/config/site.config";
import { EMPTY_BLOG_DOCUMENT } from "@/lib/blog";
import {
  getBlogPostAdmin,
  serializeBlogPostForForm,
} from "@/services/admin/blog.admin.service";
import { listBlogCategoriesAdmin } from "@/services/admin/blog-category.admin.service";
import { listBlogTagsAdmin } from "@/services/admin/blog-tag.admin.service";
import { prisma } from "@/lib/prisma";

export async function getBlogEditorContext() {
  const [categories, tags] = await Promise.all([
    listBlogCategoriesAdmin(),
    listBlogTagsAdmin(),
  ]);

  return {
    categories: categories.map((item) => ({ id: item.id, name: item.name })),
    tags: tags.map((item) => ({ id: item.id, name: item.name })),
  };
}

export async function getBlogPostEditorInitial(id?: string) {
  const { categories, tags } = await getBlogEditorContext();

  if (!id) {
    return {
      categories,
      tags,
      initial: {
        title: "",
        slug: "",
        excerpt: "",
        contentHtml: "",
        contentJson: EMPTY_BLOG_DOCUMENT,
        authorName: siteConfig.author.name,
        status: "draft" as const,
        featured: false,
        coverImageUrl: "",
        coverImageAlt: "",
        categoryIds: [],
        tagIds: [],
        scheduledAt: "",
        seo: {
          metaTitle: "",
          metaDescription: "",
          canonicalUrl: "",
          focusKeyword: "",
          seoNotes: "",
          ogImageUrl: "",
          ogImageAlt: "",
          ogType: "article",
          twitterImageUrl: "",
          twitterCardType: "SUMMARY_LARGE_IMAGE",
          keywords: "",
        },
      },
    };
  }

  const post = await getBlogPostAdmin(id);
  if (!post) return null;

  const seo = await prisma.seoMetadata.findUnique({
    where: {
      entityType_entityId: { entityType: "blog_post", entityId: post.id },
    },
  });

  return {
    categories,
    tags,
    initial: serializeBlogPostForForm(post, seo),
  };
}
