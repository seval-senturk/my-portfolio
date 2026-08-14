import type { ContactContent } from "@/types/contact";

import { HomeSectionShell } from "@/components/sections";
import { ContactLayout } from "@/features/contact/components/contact-layout";
import { ContactSectionDecor } from "@/features/contact/components/contact-section-decor";

interface ContactSectionProps {
  content: ContactContent;
}

export function ContactSection({ content }: ContactSectionProps) {
  const { section } = content;

  if (!section.visible) {
    return null;
  }

  const headingId = "contact-section-heading";

  return (
    <HomeSectionShell
      id="contact"
      headingId={headingId}
      sectionClassName="contact-section"
      header={{
        label: section.label,
        title: section.title,
        titleAccent: section.titleAccent,
        description: section.description,
        descriptionClassName: "home-section-header__description--muted",
      }}
      backdrop={<ContactSectionDecor />}
    >
      <ContactLayout content={content} />
    </HomeSectionShell>
  );
}
