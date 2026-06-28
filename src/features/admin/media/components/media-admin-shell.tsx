"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
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
      <div>
        <h1 className="text-h3 font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-small text-muted-foreground">{description}</p>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="Medya bölümleri">
        {MEDIA_NAV.map((item) => {
          const active =
            "exact" in item && item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-caption font-medium transition-base",
                active
                  ? "border-[var(--admin-brand,#7c3aed)] bg-[var(--admin-brand-muted,rgb(124_58_237_/_0.12))] text-foreground"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
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
