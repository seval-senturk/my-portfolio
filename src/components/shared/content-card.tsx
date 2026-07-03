import { formatTechnologyList } from "@/lib/content";

import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface ContentCardProps {
  title: string;
  description: string;
  technologies?: readonly string[];
  headingLevel?: "h3" | "h4";
}

export function ContentCard({
  title,
  description,
  technologies,
  headingLevel = "h4",
}: ContentCardProps) {
  return (
    <Card className="h-full" interactive>
      <Card.Content>
        <Heading as={headingLevel} variant="h4">
          {title}
        </Heading>
        <Text tone="muted" className="mt-2">
          {description}
        </Text>
        {technologies && technologies.length > 0 && (
          <Text as="p" variant="small" className="mt-3 text-foreground">
            {formatTechnologyList(technologies)}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
}

export type { ContentCardProps };
