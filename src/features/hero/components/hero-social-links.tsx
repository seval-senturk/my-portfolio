import type { SiteSocialLink } from "@/types/social";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";

import { HeroSocialIcon } from "@/features/hero/components/hero-social-icon";

interface HeroSocialLinksProps {
  links: readonly SiteSocialLink[];
  className?: string;
  variant?: "row" | "portrait-rail";
}

export function HeroSocialLinks({
  links,
  className,
  variant = "row",
}: HeroSocialLinksProps) {
  const visibleLinks = links.filter((link) => link.visible);

  if (visibleLinks.length === 0) {
    return null;
  }

  if (variant === "portrait-rail") {
    return (
      <ul
        className={cn(
          "hero-portrait-social-rail m-0 list-none p-0",
          className,
        )}
        aria-label="Social profiles"
      >
        {visibleLinks.map((link) => (
          <li key={link.id}>
            <PortraitSocialLink link={link} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul
      className={cn("flex flex-wrap items-center gap-2.5", className)}
      aria-label="Social profiles"
    >
      {visibleLinks.map((link) => (
        <li key={link.id}>
          <PortraitSocialLink link={link} size="md" />
        </li>
      ))}
    </ul>
  );
}

function PortraitSocialLink({
  link,
  size = "sm",
}: {
  link: SiteSocialLink;
  size?: "sm" | "md";
}) {
  const isEmail = link.platform === "email";
  const dimension = size === "sm" ? "h-10 w-10" : "h-11 w-11";

  return (
    <a
      href={link.href}
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-white/25 bg-transparent text-white/90 transition-[transform,border-color,color,box-shadow] duration-200 ease-out hover:scale-105 hover:border-[rgb(124_131_255/0.55)] hover:text-white hover:shadow-[0_0_0_1px_rgb(124_131_255/0.2)]",
        dimension,
        FOCUS_RING_CLASS,
      )}
      aria-label={link.label}
      {...(!isEmail && {
        target: "_blank",
        rel: "noopener noreferrer",
      })}
    >
      <HeroSocialIcon platform={link.platform} size={size === "sm" ? 16 : 18} />
    </a>
  );
}
