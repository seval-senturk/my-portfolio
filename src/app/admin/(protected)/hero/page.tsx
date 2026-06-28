import { heroContentService } from "@/content";
import { HeroAdminView } from "@/features/admin/components/hero-admin-view";
import { HeroSocialAdminSection } from "@/features/admin/components/hero-social-admin-section";
import { getSocialLinksForAdmin } from "@/services/admin/social.admin.service";

export default async function AdminHeroPage() {
  const [hero, socialLinks] = await Promise.all([
    heroContentService.get(),
    getSocialLinksForAdmin(),
  ]);

  return (
    <div className="space-y-10">
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
      <HeroSocialAdminSection
        initialLinks={socialLinks.map((link) => ({
          platform: link.platform,
          label: link.label,
          href: link.href,
          visible: link.visible,
        }))}
      />
    </div>
  );
}
