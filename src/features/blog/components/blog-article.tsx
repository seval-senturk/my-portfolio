import type { BlogPost } from "@/types/blog";
import { formatReadingTime } from "@/lib/blog";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface BlogArticleProps {
  post: BlogPost;
  preview?: boolean;
}

export function BlogArticle({ post, preview = false }: BlogArticleProps) {
  return (
    <article className="mx-auto max-w-3xl">
      <header className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {post.featured ? <Badge variant="accent">Featured</Badge> : null}
          {post.categories?.map((category) => (
            <Badge key={category.id} variant="outline">
              {category.name}
            </Badge>
          ))}
        </div>
        <Heading as="h1">{post.title}</Heading>
        <Text tone="muted" variant="body-large">
          {post.excerpt}
        </Text>
        <div className="flex flex-wrap gap-4 text-small text-muted-foreground">
          <span>By {post.author.name}</span>
          <span>{formatReadingTime(post.readingTimeMinutes)}</span>
          {post.meta.publishedAt ? (
            <time dateTime={post.meta.publishedAt}>
              {new Intl.DateTimeFormat("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }).format(new Date(post.meta.publishedAt))}
            </time>
          ) : null}
          {preview ? <span className="text-warning">Preview</span> : null}
        </div>
      </header>

      {post.coverImage ? (
        <div className="my-8 overflow-hidden rounded-xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.coverImageAlt ?? post.title}
            className="h-auto w-full object-cover"
          />
        </div>
      ) : null}

      <div
        className="blog-article-content prose prose-neutral max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {post.tags && post.tags.length > 0 ? (
        <footer className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
          {post.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary">
              #{tag.name}
            </Badge>
          ))}
        </footer>
      ) : null}
    </article>
  );
}
