"use client";

import { usePathname } from "next/navigation";

import { adminNavigation } from "@/config/admin-navigation.config";
import { cn } from "@/lib/cn";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";

import { Link } from "@/components/ui/link";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-r border-border bg-surface">
      <nav aria-label="Admin navigation" className="flex h-full flex-col p-4">
        <div className="mb-6 px-2">
          <p className="text-small font-semibold text-foreground">Admin Panel</p>
          <p className="text-caption text-muted-foreground">Content management</p>
        </div>
        <ul className="space-y-1">
          {adminNavigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-small no-underline transition-base",
                    FOCUS_RING_CLASS,
                    isActive
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
