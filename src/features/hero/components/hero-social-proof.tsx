import type { HeroStat } from "@/types/hero";

import { StatGrid } from "@/components/shared/stat-grid";

interface HeroSocialProofProps {
  stats: readonly HeroStat[];
}

export function HeroSocialProof({ stats }: HeroSocialProofProps) {
  return (
    <div className="mt-10 border-t border-border pt-8">
      <StatGrid items={stats} columns={3} />
    </div>
  );
}
