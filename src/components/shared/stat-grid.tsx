import type { IdentifiedStatItem, StatItem } from "@/types/stats";

import { cn } from "@/lib/cn";
import { Text } from "@/components/ui/text";

interface StatGridProps {
  items: readonly StatItem[] | readonly IdentifiedStatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

function getStatKey(item: StatItem | IdentifiedStatItem): string {
  return "id" in item ? item.id : item.label;
}

export function StatGrid({ items, columns = 4, className }: StatGridProps) {
  const columnClasses = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  } as const;

  return (
    <dl className={cn("grid gap-6", columnClasses[columns], className)}>
      {items.map((item) => (
        <div key={getStatKey(item)}>
          <Text as="dt" variant="caption" tone="muted">
            {item.label}
          </Text>
          <Text as="dd" variant="body-large" className="mt-1 font-semibold">
            {item.value}
          </Text>
        </div>
      ))}
    </dl>
  );
}
