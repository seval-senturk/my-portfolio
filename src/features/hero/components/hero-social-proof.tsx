import type { HeroStat } from "@/types/hero";

import { Text } from "@/components/ui/text";

interface HeroSocialProofProps {
  stats: readonly HeroStat[];
}

export function HeroSocialProof({ stats }: HeroSocialProofProps) {
  return (
    <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-8 sm:gap-6">
      {stats.map((stat) => (
        <div key={stat.label}>
          <Text as="dt" variant="caption" tone="muted">
            {stat.label}
          </Text>
          <Text as="dd" variant="body-large" className="mt-1 font-semibold">
            {stat.value}
          </Text>
        </div>
      ))}
    </dl>
  );
}
