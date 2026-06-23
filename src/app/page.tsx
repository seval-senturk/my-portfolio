import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { A11Y } from "@/lib/accessibility";
import { siteConfig } from "@/config/site.config";

export default function HomePage() {
  return (
    <main id={A11Y.mainContentId} className="flex min-h-screen items-center">
      <Container size="narrow">
        <Text
          variant="caption"
          tone="muted"
          className="uppercase tracking-wide"
        >
          Phase 1 Foundation
        </Text>
        <Heading as="h1" className="mt-4">
          {siteConfig.author.name}
        </Heading>
        <Text variant="body-large" tone="muted" className="mt-4">
          {siteConfig.author.jobTitle}
        </Text>
        <Text tone="muted" className="mt-6 max-w-prose">
          Architecture, SEO, and performance foundation is in place. Visual
          design and content sections will be implemented in upcoming phases.
        </Text>
      </Container>
    </main>
  );
}
