import { brandConfig } from "@/config/navigation.config";
import type { SiteFooterContent } from "@/types/footer";

interface FooterBottomBarProps {
  brand: SiteFooterContent["brand"];
}

export function FooterBottomBar({ brand }: FooterBottomBarProps) {
  const initials = brandConfig.shortName;

  return (
    <div className="site-footer__bottom">
      <p className="site-footer__copyright">{brand.copyright}</p>
      <div className="site-footer__brand">
        {brand.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.logoUrl}
            alt=""
            width={36}
            height={36}
            className="site-footer__brand-logo"
          />
        ) : (
          <span className="site-footer__brand-mark" aria-hidden>
            {initials}
          </span>
        )}
        <span className="site-footer__brand-name">{brand.siteName}</span>
      </div>
    </div>
  );
}
