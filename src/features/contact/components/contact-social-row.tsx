import type { ContactSocialLink } from "@/types/contact";
import { HeroSocialIcon } from "@/features/hero/components/hero-social-icon";
import { FOCUS_RING_CLASS } from "@/lib/accessibility";
import { cn } from "@/lib/cn";

interface ContactSocialRowProps {
  links: readonly ContactSocialLink[];
}

export function ContactSocialRow({ links }: ContactSocialRowProps) {
  const visibleLinks = links.filter((link) => link.visible);

  if (visibleLinks.length === 0) {
    return null;
  }

  return (
    <ul className="contact-social-row">
      {visibleLinks.map((link) => {
        const isEmail = link.platform === "email";

        return (
          <li key={link.id}>
            <a
              href={link.href}
              className={cn("contact-social-row__link", FOCUS_RING_CLASS)}
              aria-label={link.label}
              {...(!isEmail && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
            >
              <HeroSocialIcon platform={link.platform} size={18} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
