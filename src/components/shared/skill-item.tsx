import type { SkillEntry } from "@/types/skills";

import { cn } from "@/lib/cn";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface SkillItemProps {
  skill: SkillEntry;
  className?: string;
}

function formatYearsOfExperience(years: number): string {
  return `${years}+ years`;
}

export function SkillItem({ skill, className }: SkillItemProps) {
  const hasMeta =
    skill.proficiencyLevel !== undefined || skill.yearsOfExperience !== undefined;

  return (
    <Card className={cn("h-full", className)}>
      <Card.Content>
        <Heading as="h4" variant="h4">
          {skill.name}
        </Heading>

        {hasMeta && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {skill.proficiencyLevel && (
              <Badge variant="outline">{skill.proficiencyLevel}</Badge>
            )}
            {skill.yearsOfExperience !== undefined && (
              <Text as="span" variant="small" tone="muted">
                {formatYearsOfExperience(skill.yearsOfExperience)}
              </Text>
            )}
          </div>
        )}

        {skill.description && (
          <Text tone="muted" className="mt-3">
            {skill.description}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
}
