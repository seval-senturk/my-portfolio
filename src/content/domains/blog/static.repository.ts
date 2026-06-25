import { blogContent } from "@/data/blog.data";

import type { BlogRepository } from "@/content/domains/blog/repository";

export const staticBlogRepository: BlogRepository = {
  async get() {
    return blogContent;
  },

  async getPostBySlug(slug) {
    return blogContent.posts.find((post) => post.slug === slug) ?? null;
  },

  async getPostBySlugAnyStatus(slug) {
    return this.getPostBySlug(slug);
  },

  async listPublishedPosts() {
    return blogContent.posts.filter((post) => post.meta.status === "published");
  },

  async getFeaturedPosts(_locale, limit = 3) {
    return blogContent.posts
      .filter((post) => post.featured && post.meta.status === "published")
      .slice(0, limit);
  },

  async getRelatedPosts(postId, limit = 3) {
    const current = blogContent.posts.find((post) => post.id === postId);
    if (!current) return [];

    return blogContent.posts
      .filter(
        (post) =>
          post.id !== postId &&
          post.meta.status === "published" &&
          post.categoryIds.some((id) => current.categoryIds.includes(id)),
      )
      .slice(0, limit);
  },
};
