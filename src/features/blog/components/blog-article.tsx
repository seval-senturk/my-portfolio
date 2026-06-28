import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import type { BlogPost } from "@/types/blog";
import { formatReadingTime } from "@/lib/blog/reading-time";
import { sanitizeBlogHtml } from "@/lib/security/sanitize-html";
import { BlogCoverImage } from "@/features/blog/components/blog-cover-image";
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
            <Link
              key={category.id}
              href={`${ROUTES.blog}?category=${category.slug}`}
              className="no-underline"
            >
              <Badge variant="outline">{category.name}</Badge>
            </Link>
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
        <BlogCoverImage
          src={post.coverImage}
          alt={post.coverImageAlt ?? post.title}
          priority
          className="my-8 aspect-[16/9] rounded-xl"
        />
      ) : null}

      <div
        className="blog-article-content prose prose-neutral max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.content) }}
      />

      {post.tags && post.tags.length > 0 ? (
        <footer className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
          {post.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`${ROUTES.blog}?tag=${tag.slug}`}
              className="no-underline"
            >
              <Badge variant="secondary">#{tag.name}</Badge>
            </Link>
          ))}
        </footer>
      ) : null}
    </article>
  );
}
