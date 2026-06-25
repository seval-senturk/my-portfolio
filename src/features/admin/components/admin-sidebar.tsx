"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";

import { adminNavigation } from "@/config/admin-navigation.config";
import { AdminBrandLogo } from "@/features/admin/components/admin-brand-logo";
import { useAdminShell } from "@/features/admin/context";
import { cn } from "@/lib/cn";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { siteConfig } from "@/config/site.config";

import { Link } from "@/components/ui/link";

const SECTION_LABELS = {
  main: "Genel",
  content: "İçerik",
  system: "Sistem",
} as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useAdminShell();

  const sections = ["main", "content", "system"] as const;

  return (
    <aside
      className={cn(
        "flex w-full border-b border-border bg-surface lg:w-auto lg:flex-col lg:border-r lg:border-b-0",
        isSidebarCollapsed ? "lg:w-[4.5rem]" : "lg:w-64",
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-4">
        {!isSidebarCollapsed ? (
          <div className="flex items-center gap-3">
            <AdminBrandLogo size="sm" />
            <div>
              <p className="text-small font-semibold text-foreground">{siteConfig.name}</p>
              <p className="text-caption text-muted-foreground">Admin Console</p>
            </div>
          </div>
        ) : (
          <AdminBrandLogo size="sm" className="mx-auto" />
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          className={cn(
            "rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground",
            FOCUS_RING_CLASS,
          )}
          aria-label={isSidebarCollapsed ? "Kenar çubuğunu genişlet" : "Kenar çubuğunu daralt"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav
        aria-label="Admin navigation"
        className="flex gap-2 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-visible"
      >
        {sections.map((section) => {
          const items = adminNavigation.filter((item) => item.section === section);

          return (
            <div key={section} className="mb-5">
              {!isSidebarCollapsed ? (
                <p className="mb-2 px-3 text-caption font-medium tracking-wide text-muted-foreground uppercase">
                  {SECTION_LABELS[section]}
                </p>
              ) : null}
              <ul className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        title={isSidebarCollapsed ? item.label : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-small no-underline transition-base",
                          FOCUS_RING_CLASS,
                          isActive
                            ? "bg-[var(--admin-brand,#7c3aed)] text-white"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          isSidebarCollapsed && "justify-center px-2",
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden />
                        {!isSidebarCollapsed ? <span>{item.label}</span> : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
