import { Text } from "@/components/ui/text";

interface HeroEyebrowProps {
  label: string;
}

export function HeroEyebrow({ label }: HeroEyebrowProps) {
  return (
    <Text
      as="p"
      variant="caption"
      tone="accent"
      className="font-medium uppercase tracking-wide"
    >
      {label}
    </Text>
  );
}
