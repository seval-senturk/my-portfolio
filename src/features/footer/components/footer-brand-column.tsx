import type { SiteFooterContent } from "@/types/footer";
import type { SiteSocialLink } from "@/types/social";

import { FooterSocialLinks } from "@/features/footer/components/footer-social-links";

interface FooterBrandColumnProps {
  brand: SiteFooterContent["brand"];
  socialLinks: readonly SiteSocialLink[];
}

export function FooterBrandColumn({ brand, socialLinks }: FooterBrandColumnProps) {
  return (
    <div className="site-footer__brand-col">
      {brand.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={brand.logoUrl}
          alt=""
          width={40}
          height={40}
          className="site-footer__brand-logo"
        />
      ) : null}

      <p className="site-footer__brand-name">
        {brand.siteName}
        <span className="site-footer__brand-name-dot" aria-hidden>
          .
        </span>
      </p>

      {brand.role ? <p className="site-footer__brand-role">{brand.role}</p> : null}

      {brand.description ? (
        <p className="site-footer__brand-description">{brand.description}</p>
      ) : null}

      <FooterSocialLinks links={socialLinks} />
    </div>
  );
}
