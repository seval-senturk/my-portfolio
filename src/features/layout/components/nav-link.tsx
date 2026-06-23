"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { type ComponentProps } from "react";

import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";
import { isActiveRoute } from "@/lib/navigation";

interface NavLinkProps extends Omit<
  ComponentProps<typeof NextLink>,
  "className"
> {
  className?: string;
}

export function NavLink({ href, className, children, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const hrefString = typeof href === "string" ? href : (href.pathname ?? "/");
  const isActive = isActiveRoute(pathname, hrefString);

  return (
    <NextLink
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "rounded-md px-3 py-2 text-small font-medium transition-base",
        FOCUS_RING_CLASS,
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </NextLink>
  );
}
