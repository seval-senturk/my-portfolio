import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import type { BlogCategory, BlogTag } from "@/types/blog";
import { cn } from "@/lib/cn";

interface BlogFiltersProps {
  categories: readonly BlogCategory[];
  tags: readonly BlogTag[];
  activeCategory?: string;
  activeTag?: string;
  featured?: boolean;
}

export function BlogFilters({
  categories,
  tags,
  activeCategory,
  activeTag,
  featured,
}: BlogFiltersProps) {
  function buildHref(params: Record<string, string | undefined>) {
    const search = new URLSearchParams();
    if (params.category) search.set("category", params.category);
    if (params.tag) search.set("tag", params.tag);
    if (params.featured) search.set("featured", "1");
    const query = search.toString();
    return query ? `${ROUTES.blog}?${query}` : ROUTES.blog;
  }

  return (
    <div className="flex flex-wrap gap-2" aria-label="Blog filters">
      <Link
        href={ROUTES.blog}
        className={cn(
          "rounded-full border px-3 py-1 text-caption transition-base",
          !activeCategory && !activeTag && !featured
            ? "border-foreground bg-foreground text-primary-foreground"
            : "border-border hover:bg-muted",
        )}
      >
        All
      </Link>
      <Link
        href={buildHref({ featured: "1" })}
        className={cn(
          "rounded-full border px-3 py-1 text-caption transition-base",
          featured
            ? "border-foreground bg-foreground text-primary-foreground"
            : "border-border hover:bg-muted",
        )}
      >
        Featured
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={buildHref({ category: category.slug, tag: activeTag })}
          className={cn(
            "rounded-full border px-3 py-1 text-caption transition-base",
            activeCategory === category.slug
              ? "border-foreground bg-foreground text-primary-foreground"
              : "border-border hover:bg-muted",
          )}
        >
          {category.name}
        </Link>
      ))}
      {tags.slice(0, 8).map((tag) => (
        <Link
          key={tag.id}
          href={buildHref({ tag: tag.slug, category: activeCategory })}
          className={cn(
            "rounded-full border px-3 py-1 text-caption transition-base",
            activeTag === tag.slug
              ? "border-foreground bg-foreground text-primary-foreground"
              : "border-border hover:bg-muted",
          )}
        >
          #{tag.name}
        </Link>
      ))}
    </div>
  );
}
