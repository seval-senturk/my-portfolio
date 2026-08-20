import { aboutHomeContent } from "@/data/about-home.data";
import type { AboutHomeContent } from "@/types/about-home";

export function normalizeAboutHomeContent(
  content: Partial<AboutHomeContent> | null | undefined,
): AboutHomeContent {
  if (!content) {
    return aboutHomeContent;
  }

  return {
    section: {
      ...aboutHomeContent.section,
      ...content.section,
    },
    profile: {
      ...aboutHomeContent.profile,
      ...content.profile,
    },
    cta: {
      ...aboutHomeContent.cta,
      ...content.cta,
    },
    secondaryCta: {
      ...aboutHomeContent.secondaryCta,
      ...content.secondaryCta,
    },
    featureCards:
      content.featureCards && content.featureCards.length > 0
        ? content.featureCards
        : aboutHomeContent.featureCards,
  };
}
