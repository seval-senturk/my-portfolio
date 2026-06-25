import { BlogPostCard } from "@/features/blog/components/blog-post-card";
import type { BlogPost } from "@/types/blog";
import { Heading } from "@/components/ui/heading";

interface BlogRelatedPostsProps {
  posts: readonly BlogPost[];
}

export function BlogRelatedPosts({ posts }: BlogRelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-10">
      <Heading as="h2" className="mb-6">
        Related Articles
      </Heading>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
