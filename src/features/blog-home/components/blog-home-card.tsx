import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";

import { ROUTES } from "@/constants/routes";
import { formatBlogPostDate } from "@/lib/date";
import type { BlogPost } from "@/types/blog";
import { BlogCoverImage } from "@/features/blog/components/blog-cover-image";

interface BlogHomeCardProps {
  post: BlogPost;
  readMoreLabel: string;
}

export function BlogHomeCard({ post, readMoreLabel }: BlogHomeCardProps) {
  const category = post.categories?.[0];
  const publishedLabel = formatBlogPostDate(post.meta.publishedAt);
  const href = `${ROUTES.blog}/${post.slug}`;

  return (
    <article className="blog-home-card">
      <div className="blog-home-card__media">
        {post.coverImage ? (
          <BlogCoverImage
            src={post.coverImage}
            alt={post.coverImageAlt ?? post.title}
            className="blog-home-card__image"
          />
        ) : (
          <div className="blog-home-card__image blog-home-card__image--placeholder" />
        )}

        {publishedLabel ? (
          <span className="blog-home-card__date-badge">
            <CalendarDays className="blog-home-card__date-icon" aria-hidden />
            {publishedLabel}
          </span>
        ) : null}
      </div>

      <div className="blog-home-card__body">
        {category ? (
          <p className="blog-home-card__category">{category.name}</p>
        ) : null}

        <h3 className="blog-home-card__title">
          <Link href={href} className="blog-home-card__title-link">
            {post.title}
          </Link>
        </h3>

        <p className="blog-home-card__excerpt">{post.excerpt}</p>

        <Link href={href} className="blog-home-card__cta">
          <span>{readMoreLabel}</span>
          <ArrowRight className="blog-home-card__cta-icon" aria-hidden />
        </Link>
      </div>
    </article>
  );
}
