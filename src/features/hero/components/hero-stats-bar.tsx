import {
  Briefcase,
  Code2,
  FolderKanban,
  Rocket,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

import type { HeroStatItem } from "@/types/hero";
import { cn } from "@/lib/cn";

const HERO_STAT_ICON_MAP: Record<string, LucideIcon> = {
  code: Code2,
  folder: FolderKanban,
  users: Users,
  star: Star,
  briefcase: Briefcase,
  rocket: Rocket,
};

interface HeroStatsBarProps {
  stats: readonly HeroStatItem[];
  className?: string;
}

export function HeroStatsBar({ stats, className }: HeroStatsBarProps) {
  if (stats.length === 0) {
    return null;
  }

  return (
    <div className={cn("hero-stats-bar", className)}>
      <dl className="hero-stats-bar__grid">
        {stats.map((stat) => {
          const Icon = HERO_STAT_ICON_MAP[stat.icon] ?? Code2;

          return (
            <div key={stat.id} className="hero-stats-bar__item">
              <span className="hero-stats-bar__icon-wrap" aria-hidden>
                <Icon className="hero-stats-bar__icon" strokeWidth={1.5} />
              </span>
              <div className="hero-stats-bar__copy">
                <dt className="hero-stats-bar__label">{stat.label}</dt>
                <dd className="hero-stats-bar__value">{stat.value}</dd>
              </div>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
