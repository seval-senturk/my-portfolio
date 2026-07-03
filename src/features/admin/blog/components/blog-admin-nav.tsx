"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_ROUTES } from "@/config/admin-routes.config";
import { adminTr } from "@/features/admin/i18n/tr";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: ADMIN_ROUTES.blog, labelKey: "posts" as const, exact: true },
  {
    href: ADMIN_ROUTES.blogHome,
    labelKey: "homeSection" as const,
    exact: false,
  },
  { href: `${ADMIN_ROUTES.blog}/categories`, labelKey: "categories" as const },
  { href: `${ADMIN_ROUTES.blog}/tags`, labelKey: "tags" as const },
] as const;

export function BlogAdminNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label={adminTr.blog.nav.label}
      className="flex flex-wrap gap-2 border-b border-border pb-4"
    >
      {LINKS.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full px-4 py-2 text-small font-medium transition-colors",
              isActive
                ? "bg-primary/15 text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {adminTr.blog.nav[link.labelKey]}
          </Link>
        );
      })}
    </nav>
  );
}
