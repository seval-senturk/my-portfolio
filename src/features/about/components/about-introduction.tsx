import { Text } from "@/components/ui/text";

interface AboutIntroductionProps {
  paragraphs: readonly string[];
}

export function AboutIntroduction({ paragraphs }: AboutIntroductionProps) {
  return (
    <div className="max-w-3xl space-y-4">
      {paragraphs.map((paragraph) => (
        <Text key={paragraph} variant="body-large" tone="muted">
          {paragraph}
        </Text>
      ))}
    </div>
  );
}
