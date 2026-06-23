import { Heading } from "@/components/ui/heading";

interface HeroHeadlineProps {
  headline: string;
}

export function HeroHeadline({ headline }: HeroHeadlineProps) {
  return (
    <Heading as="h1" id="hero-heading" className="mt-4 max-w-2xl">
      {headline}
    </Heading>
  );
}
