import type { ExperienceEntry } from "@/types/experience";
import type { ResumeExperienceSnapshotConfig } from "@/types/resume";
import { formatEmploymentPeriod } from "@/lib/date";
import { formatTechnologyList } from "@/lib/content";

import { ResumeSubsection } from "@/features/resume/components/resume-subsection";
import { ButtonLink } from "@/components/ui/button-link";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface ResumeExperienceSnapshotViewProps {
  config: ResumeExperienceSnapshotConfig;
  entries: readonly ExperienceEntry[];
}

export function ResumeExperienceSnapshotView({
  config,
  entries,
}: ResumeExperienceSnapshotViewProps) {
  return (
    <ResumeSubsection title={config.title}>
      <ul className="space-y-4">
        {entries.map((entry) => (
          <li key={entry.id}>
            <Card>
              <Card.Content className="space-y-3">
                <header className="space-y-1">
                  <Heading as="h4" variant="h4">
                    {entry.position}
                  </Heading>
                  <Text as="p" className="font-medium">
                    {entry.company}
                  </Text>
                  <Text as="time" variant="small" tone="muted">
                    {formatEmploymentPeriod(entry)}
                  </Text>
                </header>
                <Text tone="muted">{entry.summary}</Text>
                <div>
                  <Text as="span" variant="small" className="font-semibold">
                    Technologies:{" "}
                  </Text>
                  <Text as="span" variant="small">
                    {formatTechnologyList(entry.technologies)}
                  </Text>
                </div>
              </Card.Content>
            </Card>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <ButtonLink href={config.viewAllHref} variant="link">
          {config.viewAllLabel}
        </ButtonLink>
      </div>
    </ResumeSubsection>
  );
}
