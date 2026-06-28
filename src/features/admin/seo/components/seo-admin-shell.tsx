"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { adminTr } from "@/features/admin/i18n/tr";
import { cn } from "@/lib/cn";

const SEO_NAV = [
  { href: ADMIN_ROUTES.seo, label: adminTr.seo.nav.overview, exact: true },
  { href: `${ADMIN_ROUTES.seo}/global`, label: adminTr.seo.nav.global },
  { href: `${ADMIN_ROUTES.seo}/pages`, label: adminTr.seo.nav.pages },
  { href: `${ADMIN_ROUTES.seo}/blog`, label: adminTr.seo.nav.blog },
  { href: `${ADMIN_ROUTES.seo}/projects`, label: adminTr.seo.nav.projects },
  { href: `${ADMIN_ROUTES.seo}/resume`, label: adminTr.seo.nav.resume },
  { href: `${ADMIN_ROUTES.seo}/ai-career`, label: adminTr.seo.nav.aiCareer },
  { href: `${ADMIN_ROUTES.seo}/structured-data`, label: adminTr.seo.nav.structuredData },
  { href: `${ADMIN_ROUTES.seo}/sitemap`, label: adminTr.seo.nav.sitemap },
  { href: `${ADMIN_ROUTES.seo}/robots`, label: adminTr.seo.nav.robots },
  { href: `${ADMIN_ROUTES.seo}/redirects`, label: adminTr.seo.nav.redirects },
  { href: `${ADMIN_ROUTES.seo}/health`, label: adminTr.seo.nav.health },
] as const;

interface SeoAdminNavProps {
  className?: string;
}

export function SeoAdminNav({ className }: SeoAdminNavProps) {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-wrap gap-2", className)} aria-label="SEO bölümleri">
      {SEO_NAV.map((item) => {
        const active = "exact" in item && item.exact
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
  );
}

interface SeoAdminShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function SeoAdminShell({ title, description, children }: SeoAdminShellProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h3 font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-small text-muted-foreground">{description}</p>
      </div>
      <SeoAdminNav />
      {children}
    </div>
  );
}
