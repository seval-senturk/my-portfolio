import Link from "next/link";

import type { BlogHomeContent } from "@/types/blog-home";
import { HomeSectionShell } from "@/components/sections";
import { BlogHomeCard } from "@/features/blog-home/components/blog-home-card";
import { BlogHomeCarousel } from "@/features/blog-home/components/blog-home-carousel";

interface BlogHomeSectionProps {
  content: BlogHomeContent;
}

export function BlogHomeSection({ content }: BlogHomeSectionProps) {
  const { section, posts } = content;

  if (!section.visible || posts.length === 0) {
    return null;
  }

  const headingId = "blog-home-section-heading";

  return (
    <HomeSectionShell
      id="blog"
      headingId={headingId}
      header={{
        label: section.label,
        title: section.title,
        titleAccent: section.titleAccent,
        description: section.description,
        descriptionClassName: "home-section-header__description--muted",
      }}
    >
      {section.carousel.enabled ? (
        <BlogHomeCarousel
          posts={posts}
          settings={section.carousel}
          readMoreLabel={section.readMoreLabel}
          labelId={headingId}
        />
      ) : (
        <div className="blog-home-grid">
          {posts.map((post) => (
            <BlogHomeCard
              key={post.id}
              post={post}
              readMoreLabel={section.readMoreLabel}
            />
          ))}
        </div>
      )}

      {section.ctaLabel && section.ctaHref ? (
        <div className="blog-home-section__cta-wrap">
          <Link href={section.ctaHref} className="blog-home-section__cta">
            {section.ctaLabel}
          </Link>
        </div>
      ) : null}
    </HomeSectionShell>
  );
}
