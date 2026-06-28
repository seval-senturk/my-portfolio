import NextLink from "next/link";

import { mainNavigation } from "@/config/navigation.config";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";

export function DesktopNav() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center gap-1">
        {mainNavigation.map((item) => (
          <li key={item.href}>
            <NextLink
              href={item.href}
              prefetch
              className={cn(
                "rounded-lg px-3 py-2 text-small font-medium text-muted-foreground transition-base hover:text-foreground",
                FOCUS_RING_CLASS,
              )}
            >
              {item.label}
            </NextLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
