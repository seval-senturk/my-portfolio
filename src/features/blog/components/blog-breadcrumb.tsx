import Link from "next/link";

import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/cn";

interface BlogBreadcrumbProps {
  items: Array<{ label: string; href?: string }>;
  className?: string;
}

export function BlogBreadcrumb({ items, className }: BlogBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-small text-muted-foreground", className)}>
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href={ROUTES.home} className="hover:text-foreground">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
