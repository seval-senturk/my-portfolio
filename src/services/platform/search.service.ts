import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";
import type { SearchQuery, SearchResultItem, SearchProviderHooks } from "@/types/platform";

/** Future: AI semantic search registers here */
export const searchProviderHooks: SearchProviderHooks = {
  semanticSearch: undefined,
};

export async function searchContent(query: SearchQuery): Promise<SearchResultItem[]> {
  const term = query.q.trim();

  if (term.length < 2) {
    return [];
  }

  if (searchProviderHooks.semanticSearch) {
    return searchProviderHooks.semanticSearch(query);
  }

  const limit = Math.min(20, query.limit ?? 10);
  const types = query.types ?? ["blog", "project", "experience"];
  const results: SearchResultItem[] = [];

  if (types.includes("blog")) {
    const posts = await prisma.blogPost.findMany({
      where: {
        locale: DEFAULT_LOCALE,
        status: "PUBLISHED",
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { excerpt: { contains: term, mode: "insensitive" } },
          { searchText: { contains: term, mode: "insensitive" } },
        ],
      },
      take: limit,
      select: { id: true, title: true, excerpt: true, slug: true },
    });

    results.push(
      ...posts.map((post) => ({
        id: post.id,
        type: "blog" as const,
        title: post.title,
        excerpt: post.excerpt,
        href: `/blog/${post.slug}`,
      })),
    );
  }

  if (types.includes("project")) {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { shortDescription: { contains: term, mode: "insensitive" } },
        ],
      },
      take: limit,
      select: { id: true, title: true, shortDescription: true, slug: true },
    });

    results.push(
      ...projects.map((project) => ({
        id: project.id,
        type: "project" as const,
        title: project.title,
        excerpt: project.shortDescription,
        href: `/projects#${project.slug}`,
      })),
    );
  }

  if (types.includes("experience")) {
    const experiences = await prisma.experience.findMany({
      where: {
        OR: [
          { position: { contains: term, mode: "insensitive" } },
          { company: { contains: term, mode: "insensitive" } },
          { summary: { contains: term, mode: "insensitive" } },
        ],
      },
      take: limit,
      select: { id: true, position: true, company: true, summary: true },
    });

    results.push(
      ...experiences.map((entry) => ({
        id: entry.id,
        type: "experience" as const,
        title: `${entry.position} @ ${entry.company}`,
        excerpt: entry.summary,
        href: "/experience",
      })),
    );
  }

  return results.slice(0, limit);
}
