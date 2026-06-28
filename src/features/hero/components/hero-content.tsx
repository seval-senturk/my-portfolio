import type { HeroContent } from "@/types/hero";
import type { SiteSocialLink } from "@/types/social";

import { HeroActions } from "@/features/hero/components/hero-actions";
import { HeroHeadline } from "@/features/hero/components/hero-headline";
import { HeroSocialLinks } from "@/features/hero/components/hero-social-links";
import { Text } from "@/components/ui/text";

interface HeroContentBlockProps {
  content: HeroContent;
  socialLinks: readonly SiteSocialLink[];
}

export function HeroContentBlock({
  content,
  socialLinks,
}: HeroContentBlockProps) {
  return (
    <div className="hero-content-block max-w-xl">
      <HeroHeadline greeting={content.eyebrow} name={content.headline} />
      <Text variant="body-large" tone="muted" className="mt-8 max-w-md leading-relaxed">
        {content.summary}
      </Text>
      <HeroActions primaryCta={content.primaryCta} />
      <HeroSocialLinks
        links={socialLinks}
        className="mt-10 lg:hidden"
      />
    </div>
  );
}
