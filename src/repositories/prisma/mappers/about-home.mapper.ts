import type {
  AboutHomeConfig,
  AboutHomeQuickInfo,
  AboutHomeStat,
} from "@prisma/client";

import type { AboutHomeContent } from "@/types/about-home";

export function mapAboutHomeToContent(
  config: AboutHomeConfig,
  quickInfo: AboutHomeQuickInfo[],
  stats: AboutHomeStat[],
): AboutHomeContent {
  return {
    section: {
      visible: config.visible,
      label: config.sectionLabel,
      title: config.title,
      titleAccent: config.titleAccent,
      description: config.description,
    },
    profile: {
      imageUrl: config.profileImageUrl,
      imageAlt: config.profileImageAlt,
    },
    quickInfo: quickInfo.map((item) => ({
      id: item.id,
      icon: item.icon,
      label: item.label,
      value: item.value,
      visible: item.visible,
      sortOrder: item.sortOrder,
    })),
    stats: stats.map((item) => ({
      id: item.id,
      icon: item.icon,
      value: item.value,
      label: item.label,
      visible: item.visible,
      sortOrder: item.sortOrder,
    })),
    actions: {
      primary: {
        label: config.primaryCtaLabel,
        href: config.primaryCtaHref,
        visible: config.primaryCtaVisible,
      },
      secondary: {
        label: config.secondaryCtaLabel,
        href: config.secondaryCtaHref,
        visible: config.secondaryCtaVisible,
      },
    },
  };
}
