import { mainNavigation } from "@/config/navigation.config";

import { NavLink } from "@/features/layout/components/nav-link";

export function DesktopNav() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center gap-1">
        {mainNavigation.map((item) => (
          <li key={item.href}>
            <NavLink href={item.href}>{item.label}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
