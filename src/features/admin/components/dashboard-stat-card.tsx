import { TrendingDown, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/cn";

interface DashboardStatCardProps {
  label: string;
  value: number | string;
  description?: string;
  trend?: {
    direction: "up" | "down" | "flat";
    label: string;
  };
}

export function DashboardStatCard({
  label,
  value,
  description,
  trend,
}: DashboardStatCardProps) {
  const TrendIcon = trend?.direction === "down" ? TrendingDown : TrendingUp;

  return (
    <Card>
      <Card.Content className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <Text as="p" variant="small" tone="muted">
            {label}
          </Text>
          {trend && trend.direction !== "flat" ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-caption font-medium",
                trend.direction === "up"
                  ? "bg-success/10 text-success"
                  : "bg-error/10 text-error",
              )}
            >
              <TrendIcon className="h-3 w-3" aria-hidden />
              {trend.label}
            </span>
          ) : null}
        </div>
        <Text as="p" variant="body-large" className="font-semibold">
          {value}
        </Text>
        {description ? (
          <Text as="p" variant="small" tone="muted">
            {description}
          </Text>
        ) : null}
      </Card.Content>
    </Card>
  );
}
