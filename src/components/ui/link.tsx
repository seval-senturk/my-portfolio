import NextLink from "next/link";
import { type ComponentProps, type ReactNode } from "react";
import { ExternalLink } from "lucide-react";

import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";

type LinkVariant = "default" | "muted" | "accent";

const VARIANT_CLASSES: Record<LinkVariant, string> = {
  default: "text-foreground hover:text-foreground/80",
  muted: "text-muted-foreground hover:text-foreground",
  accent: "text-accent hover:text-accent/80",
};

function isExternalHref(href: string): boolean {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

interface BaseLinkProps {
  href: string;
  variant?: LinkVariant;
  showExternalIcon?: boolean;
  className?: string;
  children: ReactNode;
}

type InternalLinkProps = BaseLinkProps &
  Omit<ComponentProps<typeof NextLink>, "href" | "className" | "children">;

type ExternalLinkProps = BaseLinkProps &
  Omit<ComponentProps<"a">, "href" | "className" | "children">;

export type LinkProps = InternalLinkProps | ExternalLinkProps;

export function Link({
  href,
  variant = "accent",
  showExternalIcon = true,
  className,
  children,
  ...props
}: LinkProps) {
  const classes = cn(
    "inline-flex items-center gap-1 underline-offset-4 transition-base hover:underline",
    FOCUS_RING_CLASS,
    VARIANT_CLASSES[variant],
    className,
  );

  if (isExternalHref(href)) {
    const isNewTab = href.startsWith("http");
    const anchorProps = props as Omit<
      ComponentProps<"a">,
      "href" | "className" | "children"
    >;

    return (
      <a
        href={href}
        className={classes}
        {...(isNewTab && {
          target: "_blank",
          rel: "noopener noreferrer",
        })}
        {...anchorProps}
      >
        {children}
        {showExternalIcon && isNewTab && (
          <ExternalLink size={14} aria-hidden className="shrink-0" />
        )}
      </a>
    );
  }

  const nextLinkProps = props as Omit<
    ComponentProps<typeof NextLink>,
    "href" | "className" | "children"
  >;

  return (
    <NextLink href={href} className={classes} {...nextLinkProps}>
      {children}
    </NextLink>
  );
}
