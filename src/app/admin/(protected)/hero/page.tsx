export const dynamic = "force-dynamic";

import { heroContentService } from "@/content";
import { HeroAdminView } from "@/features/admin/components/hero-admin-view";

export default async function AdminHeroPage() {
  const hero = await heroContentService.get();

  return (
    <HeroAdminView
      initial={{
        eyebrow: hero.eyebrow,
        headline: hero.headline,
        summary: hero.summary,
        technologyHighlightsTitle: hero.technologyHighlightsTitle,
        primaryCtaLabel: hero.primaryCta.label,
        primaryCtaHref: hero.primaryCta.href,
        secondaryCtaLabel: hero.secondaryCta.label,
        secondaryCtaHref: hero.secondaryCta.href,
        profileImageUrl: hero.profile.imageSrc ?? "",
        profileImageAlt: hero.profile.imageAlt,
        profileInitials: hero.profile.initials,
      }}
    />
  );
}
