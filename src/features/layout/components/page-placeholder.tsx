import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface PagePlaceholderProps {
  title: string;
  description?: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <Container size="default" className="py-16 md:py-24">
      <Heading as="h1">{title}</Heading>
      <Text tone="muted" className="mt-4 max-w-prose">
        {description ?? "This section will be developed in an upcoming phase."}
      </Text>
    </Container>
  );
}
