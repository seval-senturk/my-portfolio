import type { ContactContent } from "@/types/contact";

import { ContactInfoPanel } from "@/features/contact/components/contact-info-panel";
import { LazyContactForm } from "@/features/contact/components/lazy-contact-form";

interface ContactLayoutProps {
  content: ContactContent;
}

export function ContactLayout({ content }: ContactLayoutProps) {
  return (
    <div className="contact-layout">
      <div className="contact-layout__form">
        <LazyContactForm config={content.form} messages={content.messages} />
      </div>

      <div className="contact-layout__info">
        <ContactInfoPanel
          information={content.information}
          infoLabels={content.infoLabels}
          socialLinks={content.socialLinks}
        />
      </div>
    </div>
  );
}
