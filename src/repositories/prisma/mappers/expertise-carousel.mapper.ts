import type {
  ExpertiseCarouselConfig,
  ExpertiseCarouselItem as PrismaExpertiseCarouselItem,
} from "@prisma/client";

import type {
  ExpertiseCarouselContent,
  ExpertiseCarouselItem,
} from "@/types/expertise-carousel";

function parseBulletItems(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export function mapExpertiseCarouselItem(
  item: PrismaExpertiseCarouselItem,
): ExpertiseCarouselItem {
  return {
    id: item.id,
    icon: item.icon,
    title: item.title,
    description: item.description ?? undefined,
    bulletItems: parseBulletItems(item.bulletItems),
    ctaLabel: item.ctaLabel,
    ctaHref: item.ctaHref,
    visible: item.visible,
    sortOrder: item.sortOrder,
  };
}

export function mapExpertiseCarouselToContent(
  config: ExpertiseCarouselConfig,
  items: PrismaExpertiseCarouselItem[],
): ExpertiseCarouselContent {
  return {
    section: {
      label: config.label,
      title: config.title,
      titleAccent: config.titleAccent,
      description: config.description,
      visible: config.visible,
    },
    items: items
      .filter((item) => item.visible)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(mapExpertiseCarouselItem),
  };
}
