import { Mail, MapPin, Phone } from "lucide-react";

import { FooterSocialLinks } from "@/features/footer/components/footer-social-links";
import type { SiteFooterContent } from "@/types/footer";
import type { SiteSocialLink } from "@/types/social";

interface FooterContactRowProps {
  contact: SiteFooterContent["contact"];
  socialLinks: readonly SiteSocialLink[];
}

export function FooterContactRow({ contact, socialLinks }: FooterContactRowProps) {
  const hasPhone = Boolean(contact.phone?.trim());
  const hasEmail = Boolean(contact.email?.trim());
  const hasAddress = Boolean(contact.address?.trim());
  const visibleSocial = socialLinks.filter(
    (link) => link.visible && link.platform !== "email",
  );

  if (!hasPhone && !hasEmail && !hasAddress && visibleSocial.length === 0) {
    return null;
  }

  return (
    <section className="site-footer__contact" aria-label="Contact information">
      <div className="site-footer__contact-grid">
        {hasPhone ? (
          <div className="site-footer__contact-item">
            <span className="site-footer__contact-icon" aria-hidden>
              <Phone size={16} />
            </span>
            <a href={`tel:${contact.phone}`} className="site-footer__contact-link">
              {contact.phone}
            </a>
          </div>
        ) : (
          <div className="site-footer__contact-item site-footer__contact-item--empty" />
        )}

        {hasEmail ? (
          <div className="site-footer__contact-item site-footer__contact-item--center">
            <span className="site-footer__contact-icon" aria-hidden>
              <Mail size={16} />
            </span>
            <a href={`mailto:${contact.email}`} className="site-footer__contact-link">
              {contact.email}
            </a>
          </div>
        ) : hasAddress ? (
          <div className="site-footer__contact-item site-footer__contact-item--center">
            <span className="site-footer__contact-icon" aria-hidden>
              <MapPin size={16} />
            </span>
            <p className="site-footer__contact-text">{contact.address}</p>
          </div>
        ) : (
          <div className="site-footer__contact-item site-footer__contact-item--empty" />
        )}

        <FooterSocialLinks links={visibleSocial} />
      </div>
      {hasEmail && hasAddress ? (
        <p className="site-footer__address">{contact.address}</p>
      ) : null}
    </section>
  );
}
