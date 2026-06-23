import type { HeroCta } from "@/types/hero";

import { ButtonLink } from "@/components/ui/button-link";

interface HeroActionsProps {
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
}

export function HeroActions({ primaryCta, secondaryCta }: HeroActionsProps) {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-3">
      <ButtonLink href={primaryCta.href} variant="primary" size="lg">
        {primaryCta.label}
      </ButtonLink>
      <ButtonLink href={secondaryCta.href} variant="outline" size="lg">
        {secondaryCta.label}
      </ButtonLink>
    </div>
  );
}
