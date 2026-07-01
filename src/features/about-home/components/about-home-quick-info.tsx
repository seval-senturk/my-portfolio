import { AboutHomeIcon } from "@/features/about-home/components/about-home-icon";
import type { AboutHomeQuickInfoItem } from "@/types/about-home";

interface AboutHomeQuickInfoProps {
  items: readonly AboutHomeQuickInfoItem[];
}

export function AboutHomeQuickInfo({ items }: AboutHomeQuickInfoProps) {
  const visibleItems = items.filter((item) => item.visible);

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <dl className="about-home__quick-info">
      {visibleItems.map((item) => (
        <div key={item.id} className="about-home__quick-info-item">
          <dt className="about-home__quick-info-label">
            <span className="about-home__quick-info-icon" aria-hidden>
              <AboutHomeIcon name={item.icon} size={16} />
            </span>
            {item.label}
          </dt>
          <dd className="about-home__quick-info-value">
            {item.icon === "mail" ? (
              <a href={`mailto:${item.value}`} className="about-home__quick-info-link">
                {item.value}
              </a>
            ) : (
              item.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
