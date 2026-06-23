import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { siteConfig } from "@/config/site.config";

export default function HomePage() {
  return (
    <Container
      size="narrow"
      className="flex flex-1 items-center py-16 md:py-24"
    >
      <div>
        <Text
          variant="caption"
          tone="muted"
          className="uppercase tracking-wide"
        >
          Portfolio
        </Text>
        <Heading as="h1" className="mt-4">
          {siteConfig.author.name}
        </Heading>
        <Text variant="body-large" tone="muted" className="mt-4">
          {siteConfig.author.jobTitle}
        </Text>
        <Text tone="muted" className="mt-6 max-w-prose">
          Professional portfolio and career site. Content sections will be
          developed in upcoming phases.
        </Text>
      </div>
    </Container>
  );
}
