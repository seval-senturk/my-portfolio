import { expertiseCarouselContent } from "@/data/expertise-carousel.data";
import type {
  ExpertiseCarouselContent,
  ExpertiseCarouselItem,
} from "@/types/expertise-carousel";

function mergeExpertiseItem(
  item: ExpertiseCarouselItem,
  fallback?: ExpertiseCarouselItem,
): ExpertiseCarouselItem {
  if (!fallback) {
    return item;
  }

  return {
    ...item,
    icon: item.icon || fallback.icon,
    title: item.title || fallback.title,
    description: item.description?.trim() || fallback.description,
    bulletItems:
      item.bulletItems.length > 0 ? item.bulletItems : fallback.bulletItems,
    ctaLabel: item.ctaLabel?.trim() || fallback.ctaLabel,
    ctaHref: item.ctaHref?.trim() || fallback.ctaHref,
  };
}

export function normalizeExpertiseCarouselContent(
  content: ExpertiseCarouselContent,
): ExpertiseCarouselContent {
  const fallbackById = new Map(
    expertiseCarouselContent.items.map((item) => [item.id, item]),
  );

  const items =
    content.items.length > 0
      ? content.items.map((item) => mergeExpertiseItem(item, fallbackById.get(item.id)))
      : expertiseCarouselContent.items;

  return {
    section: {
      ...expertiseCarouselContent.section,
      ...content.section,
    },
    items,
  };
}
