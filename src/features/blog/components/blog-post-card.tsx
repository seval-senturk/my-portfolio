import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import { formatReadingTime } from "@/lib/blog/reading-time";
import type { BlogPost } from "@/types/blog";
import { BlogCoverImage } from "@/features/blog/components/blog-cover-image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="h-full overflow-hidden" interactive>
      {post.coverImage ? (
        <BlogCoverImage
          src={post.coverImage}
          alt={post.coverImageAlt ?? post.title}
          className="aspect-[16/9] rounded-t-xl"
        />
      ) : null}
      <Card.Content className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {post.featured ? <Badge variant="accent">Featured</Badge> : null}
          {post.categories?.slice(0, 2).map((category) => (
            <Link
              key={category.id}
              href={`${ROUTES.blog}?category=${category.slug}`}
              className="no-underline"
            >
              <Badge variant="outline">{category.name}</Badge>
            </Link>
          ))}
        </div>
        <Link href={`${ROUTES.blog}/${post.slug}`} className="block no-underline">
          <Heading as="h3" className="text-h4 hover:text-accent">
            {post.title}
          </Heading>
        </Link>
        <Text tone="muted">{post.excerpt}</Text>
        <div className="flex flex-wrap gap-3 text-caption text-muted-foreground">
          <span>{post.author.name}</span>
          <span>{formatReadingTime(post.readingTimeMinutes)}</span>
        </div>
      </Card.Content>
    </Card>
  );
}
