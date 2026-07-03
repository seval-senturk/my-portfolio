import type { BlogHomeContent } from "@/types/blog-home";

export const blogHomeContent: BlogHomeContent = {
  section: {
    label: "LATEST BLOG",
    title: "Latest Insights",
    titleAccent: "Insights",
    description:
      "Sharing development experiences, performance optimizations, SEO techniques and modern software engineering practices.",
    sectionNumber: "09",
    visible: true,
    postLimit: 3,
    selectionMode: "latest",
    readMoreLabel: "Read Article",
    ctaLabel: "View All Articles",
    ctaHref: "/blog",
    carousel: {
      enabled: true,
      autoplay: false,
      autoplayDelayMs: 5000,
      loop: true,
    },
  },
  posts: [],
};
