import type { ResumeEducation } from "@/types/resume";
import { formatMonthYear } from "@/lib/date";

import { ResumeSubsection } from "@/features/resume/components/resume-subsection";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

interface ResumeEducationViewProps {
  title: string;
  items: readonly ResumeEducation[];
}

function formatEducationPeriod(education: ResumeEducation): string | undefined {
  if (!education.startDate && !education.endDate) {
    return undefined;
  }

  const start = education.startDate
    ? formatMonthYear(education.startDate)
    : undefined;
  const end = education.endDate ? formatMonthYear(education.endDate) : undefined;

  if (start && end) {
    return `${start} – ${end}`;
  }

  return start ?? end;
}

export function ResumeEducationView({ title, items }: ResumeEducationViewProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ResumeSubsection title={title}>
      <ul className="space-y-4">
        {items.map((education) => {
          const period = formatEducationPeriod(education);

          return (
            <li key={education.id}>
              <Card>
                <Card.Content className="space-y-2">
                  <Heading as="h4" variant="h4">
                    {education.degree}
                    {education.fieldOfStudy
                      ? ` in ${education.fieldOfStudy}`
                      : ""}
                  </Heading>
                  <Text className="font-medium">{education.institution}</Text>
                  {period && (
                    <Text as="time" variant="small" tone="muted">
                      {period}
                    </Text>
                  )}
                  {education.description && (
                    <Text tone="muted">{education.description}</Text>
                  )}
                </Card.Content>
              </Card>
            </li>
          );
        })}
      </ul>
    </ResumeSubsection>
  );
}
