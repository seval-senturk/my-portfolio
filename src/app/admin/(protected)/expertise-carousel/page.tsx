import {
  getExpertiseCarouselConfig,
  listExpertiseCarouselItems,
} from "@/services/admin";
import { ExpertiseCarouselAdminView } from "@/features/admin/components/expertise-carousel-admin-view";
import { expertiseCarouselContent } from "@/data/expertise-carousel.data";
import type { ExpertiseCarouselItemRow } from "@/features/admin/components/expertise-carousel-admin-view";

function normalizeBulletItems(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
}

export default async function AdminExpertiseCarouselPage() {
  const [config, items] = await Promise.all([
    getExpertiseCarouselConfig(),
    listExpertiseCarouselItems(),
  ]);

  const fallback = expertiseCarouselContent;
  const resolvedItems =
    items.length > 0
      ? items
      : fallback.items.map((item, index) => ({
          id: item.id,
          icon: item.icon,
          title: item.title,
          description: item.description ?? null,
          bulletItems: [...item.bulletItems],
          ctaLabel: item.ctaLabel ?? null,
          ctaHref: item.ctaHref ?? null,
          visible: item.visible,
          sortOrder: index,
        }));

  return (
    <ExpertiseCarouselAdminView
      config={{
        label: config?.label ?? fallback.section.label,
        title: config?.title ?? fallback.section.title,
        titleAccent:
          config?.titleAccent ?? fallback.section.titleAccent ?? "",
        description: config?.description ?? fallback.section.description,
        visible: config?.visible ?? fallback.section.visible,
      }}
      items={resolvedItems.map(
        (item): ExpertiseCarouselItemRow => ({
          id: item.id,
          icon: item.icon,
          title: item.title,
          description: item.description,
          bulletItems: normalizeBulletItems(item.bulletItems),
          ctaLabel: item.ctaLabel,
          ctaHref: item.ctaHref,
          visible: item.visible,
          sortOrder: item.sortOrder,
        }),
      )}
    />
  );
}
