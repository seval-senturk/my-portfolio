import type { BlogContent, BlogPost } from "@/types/blog";

export const blogContent: BlogContent = {
  section: {
    title: "Blog",
    description:
      "Articles on frontend engineering, full stack development, and building scalable web products.",
  },
  posts: [] as BlogPost[],
  categories: [],
  tags: [],
};
