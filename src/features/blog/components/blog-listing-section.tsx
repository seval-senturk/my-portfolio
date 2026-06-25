import { BlogFilters } from "@/features/blog/components/blog-filters";
import { BlogPostCard } from "@/features/blog/components/blog-post-card";
import type { BlogContent, BlogPost } from "@/types/blog";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";

interface BlogListingSectionProps {
  content: BlogContent;
  posts: readonly BlogPost[];
  activeCategory?: string;
  activeTag?: string;
  featured?: boolean;
}

export function BlogListingSection({
  content,
  posts,
  activeCategory,
  activeTag,
  featured,
}: BlogListingSectionProps) {
  return (
    <Section>
      <Container className="space-y-8">
        <div className="max-w-3xl space-y-3">
          <Heading as="h1">{content.section.title}</Heading>
          <Text tone="muted" variant="body-large">
            {content.section.description}
          </Text>
        </div>

        <BlogFilters
          categories={content.categories}
          tags={content.tags}
          activeCategory={activeCategory}
          activeTag={activeTag}
          featured={featured}
        />

        {posts.length === 0 ? (
          <Text tone="muted">No articles match your filters yet.</Text>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
