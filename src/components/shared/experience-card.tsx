import type { ExperienceEntry } from "@/types/experience";
import { formatEmploymentPeriod } from "@/lib/date";
import { formatTechnologyList } from "@/lib/content";
import { cn } from "@/lib/cn";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface ExperienceCardProps {
  entry: ExperienceEntry;
  className?: string;
}

export function ExperienceCard({ entry, className }: ExperienceCardProps) {
  const period = formatEmploymentPeriod(entry);
  const hasAchievements =
    entry.achievements !== undefined && entry.achievements.length > 0;

  return (
    <Card
      className={cn(
        "h-full",
        entry.current && "border-accent/30 ring-1 ring-accent/10",
        className,
      )}
    >
      <Card.Content className="space-y-5">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Heading as="h3" variant="h4">
              {entry.position}
            </Heading>
            {entry.current && (
              <Badge variant="accent" aria-label="Current position">
                Current
              </Badge>
            )}
          </div>
          <Text as="p" variant="body-large" className="font-medium">
            {entry.company}
          </Text>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-small text-muted-foreground">
            <Text as="time" variant="small" tone="muted">
              {period}
            </Text>
            <Text as="span" variant="small" tone="muted" aria-hidden>
              ·
            </Text>
            <Text as="span" variant="small" tone="muted">
              {entry.location}
            </Text>
            <Text as="span" variant="small" tone="muted" aria-hidden>
              ·
            </Text>
            <Text as="span" variant="small" tone="muted">
              {entry.employmentType}
            </Text>
          </div>
        </header>

        <Text tone="muted">{entry.summary}</Text>

        <div>
          <Heading as="h4" variant="h4" className="text-small font-semibold">
            Key Responsibilities
          </Heading>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {entry.responsibilities.map((item) => (
              <li key={item}>
                <Text as="span" variant="small">
                  {item}
                </Text>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <Heading as="h4" variant="h4" className="text-small font-semibold">
            Technologies
          </Heading>
          <Text as="p" variant="small" className="mt-2 text-foreground">
            {formatTechnologyList(entry.technologies)}
          </Text>
        </div>

        {hasAchievements && entry.achievements && (
          <div>
            <Heading as="h4" variant="h4" className="text-small font-semibold">
              Achievements
            </Heading>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              {entry.achievements.map((item) => (
                <li key={item}>
                  <Text as="span" variant="small">
                    {item}
                  </Text>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card.Content>
    </Card>
  );
}
