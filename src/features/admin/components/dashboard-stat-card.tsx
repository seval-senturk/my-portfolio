import { TrendingDown, TrendingUp } from "lucide-react";

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
    <article className="admin-stat-card">
      <div className="flex items-start justify-between gap-3">
        <p className="admin-stat-card__label">{label}</p>
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
      <p className="admin-stat-card__value">{value}</p>
      {description ? <p className="admin-stat-card__description">{description}</p> : null}
    </article>
  );
}
