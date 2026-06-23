import {
  AtSign,
  BookOpen,
  Briefcase,
  Code2,
  Mail,
  type LucideIcon,
} from "lucide-react";

import { socialLinks, type SocialPlatform } from "@/config/social-links.config";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";

const SOCIAL_ICONS: Record<SocialPlatform, LucideIcon> = {
  github: Code2,
  linkedin: Briefcase,
  email: Mail,
  x: AtSign,
  medium: BookOpen,
};

interface SocialLinksProps {
  className?: string;
  iconSize?: "sm" | "md";
}

export function SocialLinks({ className, iconSize = "md" }: SocialLinksProps) {
  const size = iconSize === "sm" ? 18 : 20;

  return (
    <ul className={cn("flex flex-wrap items-center gap-3", className)}>
      {socialLinks.map((link) => {
        const IconComponent = SOCIAL_ICONS[link.platform];
        const isEmail = link.platform === "email";

        return (
          <li key={link.platform}>
            <a
              href={link.href}
              className={cn(
                "inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-base hover:bg-muted hover:text-foreground",
                FOCUS_RING_CLASS,
              )}
              aria-label={link.label}
              {...(!isEmail && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
            >
              <IconComponent size={size} aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
