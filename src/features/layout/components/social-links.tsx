import {
  AtSign,
  BookOpen,
  Briefcase,
  Code2,
  Globe,
  Mail,
  type LucideIcon,
} from "lucide-react";

import { socialLinks, type SocialPlatform } from "@/config/social-links.config";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";

const SOCIAL_ICONS: Partial<Record<SocialPlatform, LucideIcon>> = {
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
  const size = iconSize === "sm" ? 16 : 18;

  return (
    <ul className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {socialLinks.map((link) => {
        const IconComponent = SOCIAL_ICONS[link.platform] ?? Globe;
        const isEmail = link.platform === "email";

        return (
          <li key={link.platform}>
            <a
              href={link.href}
              className={cn(
                "inline-flex items-center justify-center rounded-full border border-border/60 bg-surface/40 text-muted-foreground transition-base hover:border-accent/40 hover:text-foreground",
                iconSize === "sm" ? "h-9 w-9" : "h-11 w-11",
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
