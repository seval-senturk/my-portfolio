import type { ProfessionalHighlight } from "@/data/professional-highlights.data";

import { cn } from "@/lib/cn";
import { Text } from "@/components/ui/text";

interface StatGridProps {
  items:
    | readonly ProfessionalHighlight[]
    | readonly { label: string; value: string }[];
  columns?: 2 | 3 | 4;
  className?: string;
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
        <div key={"id" in item ? item.id : item.label}>
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
