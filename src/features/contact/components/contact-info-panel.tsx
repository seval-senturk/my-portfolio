import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

import type {
  ContactContent,
  ContactInfoFieldSettings,
} from "@/types/contact";
import { CardHoverOrbitals } from "@/components/shared/card-hover-orbitals";
import { ContactSocialRow } from "@/features/contact/components/contact-social-row";
import { cn } from "@/lib/cn";

interface ContactInfoPanelProps {
  information: ContactContent["information"];
  infoLabels: ContactContent["infoLabels"];
  socialLinks: ContactContent["socialLinks"];
}

interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}

function InfoRow({ icon, label, value, href }: InfoRowProps) {
  const content = (
    <>
      <span className="contact-info-panel__icon" aria-hidden>
        {icon}
      </span>
      <span className="contact-info-panel__copy">
        <span className="contact-info-panel__label">{label}</span>
        <span className="contact-info-panel__value">{value}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <a href={href} className="contact-info-panel__row contact-info-panel__row--link">
        {content}
      </a>
    );
  }

  return <div className="contact-info-panel__row">{content}</div>;
}

function shouldShowRow(
  settings: ContactInfoFieldSettings,
  value?: string,
): value is string {
  return settings.visible && Boolean(value?.trim());
}

export function ContactInfoPanel({
  information,
  infoLabels,
  socialLinks,
}: ContactInfoPanelProps) {
  const rows = [
    shouldShowRow(infoLabels.email, information.email)
      ? {
          key: "email",
          icon: <Mail size={22} strokeWidth={1.5} />,
          label: infoLabels.email.label,
          value: information.email,
          href: `mailto:${information.email}`,
        }
      : null,
    shouldShowRow(infoLabels.phone, information.phone)
      ? {
          key: "phone",
          icon: <Phone size={22} strokeWidth={1.5} />,
          label: infoLabels.phone.label,
          value: information.phone!,
          href: `tel:${information.phone!.replace(/\s+/g, "")}`,
        }
      : null,
    shouldShowRow(infoLabels.location, information.location)
      ? {
          key: "location",
          icon: <MapPin size={22} strokeWidth={1.5} />,
          label: infoLabels.location.label,
          value: information.location,
        }
      : null,
  ].filter(Boolean) as Array<{
    key: string;
    icon: ReactNode;
    label: string;
    value: string;
    href?: string;
  }>;

  return (
    <article className={cn("contact-info-panel", "interactive-card")}>
      <CardHoverOrbitals />
      <div className="contact-info-panel__inner">
        <div className="contact-info-panel__rows">
          {rows.map((row) => (
            <InfoRow
              key={row.key}
              icon={row.icon}
              label={row.label}
              value={row.value}
              href={row.href}
            />
          ))}
        </div>

        <ContactSocialRow links={socialLinks} />
      </div>
    </article>
  );
}
