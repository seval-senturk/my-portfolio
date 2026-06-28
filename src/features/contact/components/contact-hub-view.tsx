import type { ContactContent } from "@/types/contact";

import { LazyContactForm } from "@/features/contact/components/lazy-contact-form";
import { ContactInfoView } from "@/features/contact/components/contact-info-view";
import { ContactSocialView } from "@/features/contact/components/contact-social-view";

interface ContactHubViewProps {
  content: ContactContent;
}

export function ContactHubView({ content }: ContactHubViewProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <ContactInfoView content={content} />
        <LazyContactForm config={content.form} messages={content.messages} />
      </div>
      <ContactSocialView links={content.socialLinks} />
    </div>
  );
}
