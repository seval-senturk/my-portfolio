import { Text } from "@/components/ui/text";

interface ResumeSummaryViewProps {
  paragraphs: readonly string[];
}

export function ResumeSummaryView({ paragraphs }: ResumeSummaryViewProps) {
  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <Text key={index} tone="muted">
          {paragraph}
        </Text>
      ))}
    </div>
  );
}
