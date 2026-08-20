"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { adminTr } from "@/features/admin/i18n/tr";
import { cn } from "@/lib/cn";

const MEDIA_NAV = [
  { href: ADMIN_ROUTES.media, label: adminTr.media.library, exact: true },
  { href: `${ADMIN_ROUTES.media}/brand`, label: adminTr.media.brand },
] as const;

interface MediaAdminShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function MediaAdminShell({ title, description, children }: MediaAdminShellProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <AdminPageHeader title={title} description={description} />

      <nav className="admin-subnav" aria-label="Medya bölümleri">
        {MEDIA_NAV.map((item) => {
          const active =
            "exact" in item && item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("admin-subnav-link", active && "admin-subnav-link--active")}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
