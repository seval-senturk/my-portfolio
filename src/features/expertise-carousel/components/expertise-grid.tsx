import type { ExpertiseCarouselItem } from "@/types/expertise-carousel";
import { ExpertiseCarouselCard } from "@/features/expertise-carousel/components/expertise-carousel-card";

interface ExpertiseGridProps {
  items: readonly ExpertiseCarouselItem[];
}

export function ExpertiseGrid({ items }: ExpertiseGridProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="expertise-grid" role="list">
      {items.map((item) => (
        <div key={item.id} className="expertise-grid__item" role="listitem">
          <ExpertiseCarouselCard item={item} />
        </div>
      ))}
    </div>
  );
}
