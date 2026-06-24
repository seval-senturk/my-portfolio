import { blogContent } from "@/data/blog.data";

import type { BlogRepository } from "@/content/domains/blog/repository";

export const staticBlogRepository: BlogRepository = {
  async get() {
    return blogContent;
  },

  async getPostBySlug(slug) {
    return blogContent.posts.find((post) => post.slug === slug) ?? null;
  },
};
