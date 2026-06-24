import type { ContactContent } from "@/types/contact";
import type { HeadingLevel } from "@/types/ui";

import { ContactHubView } from "@/features/contact/components/contact-hub-view";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

interface ContactSectionProps {
  content: ContactContent;
  titleAs?: HeadingLevel;
}

export function ContactSection({
  content,
  titleAs = "h2",
}: ContactSectionProps) {
  const { section } = content;

  return (
    <Section
      id="contact"
      title={section.title}
      description={section.description}
      titleAs={titleAs}
      headingId="contact-section-heading"
      headerContainerSize="default"
      spacing="default"
    >
      <Container size="default">
        <ContactHubView content={content} />
      </Container>
    </Section>
  );
}
