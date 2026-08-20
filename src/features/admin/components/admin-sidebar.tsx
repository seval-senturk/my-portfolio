"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePathname } from "next/navigation";

import { adminNavigation } from "@/config/admin-navigation.config";
import { siteConfig } from "@/config/site.config";
import { AdminBrandLogo } from "@/features/admin/components/admin-brand-logo";
import { useAdminShell } from "@/features/admin/context";
import { adminTr } from "@/features/admin/i18n/tr";
import { cn } from "@/lib/cn";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";

import { Link } from "@/components/ui/link";

const SECTION_LABELS = adminTr.sidebar.sections;

export function AdminSidebar() {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar } = useAdminShell();

  const sections = ["main", "content", "pages", "system"] as const;

  return (
    <aside
      className={cn(
        "admin-sidebar",
        isSidebarCollapsed ? "admin-sidebar--collapsed" : "admin-sidebar--expanded",
      )}
    >
      <div className="admin-sidebar__brand">
        {!isSidebarCollapsed ? (
          <div className="admin-sidebar__brand-info">
            <AdminBrandLogo size="sm" />
            <div className="min-w-0">
              <p className="admin-sidebar__brand-name truncate">{siteConfig.name}</p>
              <p className="admin-sidebar__brand-tag">{adminTr.sidebar.console}</p>
            </div>
          </div>
        ) : (
          <AdminBrandLogo size="sm" className="mx-auto" />
        )}
        <button
          type="button"
          onClick={toggleSidebar}
          className={cn("admin-sidebar__toggle", FOCUS_RING_CLASS)}
          aria-label={isSidebarCollapsed ? adminTr.sidebar.expand : adminTr.sidebar.collapse}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav aria-label="Admin navigation" className="admin-sidebar__nav">
        {sections.map((section) => {
          const items = adminNavigation.filter((item) => item.section === section);

          return (
            <div key={section} className="admin-sidebar__section">
              {!isSidebarCollapsed ? (
                <p className="admin-sidebar__section-label">{SECTION_LABELS[section]}</p>
              ) : null}
              <ul className="admin-sidebar__list">
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
                          "admin-nav-link",
                          isActive && "admin-nav-link--active",
                          isSidebarCollapsed && "admin-nav-link--collapsed",
                          FOCUS_RING_CLASS,
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <Icon className="admin-nav-link__icon" aria-hidden />
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
