import type { StatItem } from "@/types/stats";

export const TECHNOLOGY_LIST_SEPARATOR = " · ";

export function formatTechnologyList(technologies: readonly string[]): string {
  return technologies.join(TECHNOLOGY_LIST_SEPARATOR);
}

export function selectStats<T extends StatItem>(
  items: readonly T[],
  limit?: number,
): readonly T[] {
  if (limit === undefined) {
    return items;
  }

  return items.slice(0, limit);
}
