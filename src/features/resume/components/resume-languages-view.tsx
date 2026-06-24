import type { ResumeLanguage } from "@/types/resume";

import { ResumeSubsection } from "@/features/resume/components/resume-subsection";
import { Text } from "@/components/ui/text";

interface ResumeLanguagesViewProps {
  title: string;
  items: readonly ResumeLanguage[];
}

export function ResumeLanguagesView({ title, items }: ResumeLanguagesViewProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ResumeSubsection title={title}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((language) => (
          <li key={language.id}>
            <Text as="span" className="font-medium">
              {language.name}
            </Text>
            <Text as="span" tone="muted">
              {" "}
              — {language.proficiency}
            </Text>
          </li>
        ))}
      </ul>
    </ResumeSubsection>
  );
}
