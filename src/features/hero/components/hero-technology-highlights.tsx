import type { HeroTechnologyHighlight } from "@/types/hero";

import { formatTechnologyList } from "@/lib/content";

import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";

interface HeroTechnologyHighlightsProps {
  title: string;
  highlights: readonly HeroTechnologyHighlight[];
}

export function HeroTechnologyHighlights({
  title,
  highlights,
}: HeroTechnologyHighlightsProps) {
  return (
    <div className="mt-8">
      <Text
        as="p"
        variant="caption"
        tone="muted"
        className="mb-4 uppercase tracking-wide"
      >
        {title}
      </Text>
      <ul className="grid gap-4 sm:grid-cols-2">
        {highlights.map((highlight) => (
          <li key={highlight.category}>
            <Badge variant="outline" className="mb-2">
              {highlight.category}
            </Badge>
            <Text as="p" variant="small" className="text-foreground">
              {formatTechnologyList(highlight.technologies)}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
}
