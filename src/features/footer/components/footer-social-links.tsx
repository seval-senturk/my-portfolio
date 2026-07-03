import { HeroSocialIcon } from "@/features/hero/components/hero-social-icon";
import type { SiteSocialLink } from "@/types/social";

interface FooterSocialLinksProps {
  links: readonly SiteSocialLink[];
}

export function FooterSocialLinks({ links }: FooterSocialLinksProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <nav className="site-footer__social" aria-label="Social media">
      <ul className="site-footer__social-list">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="site-footer__social-link"
              aria-label={link.label}
            >
              <HeroSocialIcon platform={link.platform} size={16} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
