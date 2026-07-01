import { AboutHomeIcon } from "@/features/about-home/components/about-home-icon";
import type { AboutHomeStatItem } from "@/types/about-home";

interface AboutHomeStatsProps {
  items: readonly AboutHomeStatItem[];
}

export function AboutHomeStats({ items }: AboutHomeStatsProps) {
  const visibleItems = items.filter((item) => item.visible);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <ul className="about-home__stats">
      {visibleItems.map((item) => (
        <li key={item.id} className="about-home__stat-card">
          <span className="about-home__stat-icon" aria-hidden>
            <AboutHomeIcon name={item.icon} size={20} />
          </span>
          <p className="about-home__stat-value">{item.value}</p>
          <p className="about-home__stat-label">{item.label}</p>
        </li>
      ))}
    </ul>
  );
}
