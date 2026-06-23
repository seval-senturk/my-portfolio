import { Text } from "@/components/ui/text";

interface HeroSummaryProps {
  summary: string;
}

export function HeroSummary({ summary }: HeroSummaryProps) {
  return (
    <Text variant="body-large" tone="muted" className="mt-6 max-w-xl">
      {summary}
    </Text>
  );
}
