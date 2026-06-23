import type { HeroTechnologyHighlight } from "@/types/hero";

import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";

interface HeroTechnologyHighlightsProps {
  highlights: readonly HeroTechnologyHighlight[];
}

export function HeroTechnologyHighlights({
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
        Core Expertise
      </Text>
      <ul className="grid gap-4 sm:grid-cols-2">
        {highlights.map((highlight) => (
          <li key={highlight.category}>
            <Badge variant="outline" className="mb-2">
              {highlight.category}
            </Badge>
            <Text as="p" variant="small" className="text-foreground">
              {highlight.technologies.join(" · ")}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
}
