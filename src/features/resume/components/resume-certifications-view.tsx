import type { ResumeCertification } from "@/types/resume";
import { formatMonthYear } from "@/lib/date";

import { ResumeSubsection } from "@/features/resume/components/resume-subsection";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";

interface ResumeCertificationsViewProps {
  title: string;
  items: readonly ResumeCertification[];
}

export function ResumeCertificationsView({
  title,
  items,
}: ResumeCertificationsViewProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ResumeSubsection title={title}>
      <ul className="space-y-4">
        {items.map((certification) => (
          <li key={certification.id}>
            <Card>
              <Card.Content className="space-y-2">
                <Heading as="h4" variant="h4">
                  {certification.title}
                </Heading>
                <Text className="font-medium">
                  {certification.organization}
                </Text>
                {certification.issueDate && (
                  <Text as="time" variant="small" tone="muted">
                    Issued {formatMonthYear(certification.issueDate)}
                  </Text>
                )}
                {certification.credentialUrl && (
                  <Link
                    href={certification.credentialUrl}
                    variant="accent"
                    className="text-small"
                  >
                    View credential
                  </Link>
                )}
              </Card.Content>
            </Card>
          </li>
        ))}
      </ul>
    </ResumeSubsection>
  );
}
