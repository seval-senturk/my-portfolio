import type { HomeCmsSection } from "@/types/section-header";

export interface AboutHomeQuickInfoItem {
  id: string;
  icon: string;
  label: string;
  value: string;
  visible: boolean;
  sortOrder: number;
}

export interface AboutHomeStatItem {
  id: string;
  icon: string;
  value: string;
  label: string;
  visible: boolean;
  sortOrder: number;
}

export interface AboutHomeContent {
  section: HomeCmsSection;
  profile: {
    imageUrl: string | null;
    imageAlt: string;
  };
  quickInfo: readonly AboutHomeQuickInfoItem[];
  stats: readonly AboutHomeStatItem[];
  actions: {
    primary: {
      label: string;
      href: string;
      visible: boolean;
    };
    secondary: {
      label: string;
      href: string;
      visible: boolean;
    };
  };
}

export interface AboutHomeConfigInput {
  visible: boolean;
  sectionLabel: string;
  title: string;
  titleAccent: string | null;
  description: string;
  profileImageUrl: string | null;
  profileImageAlt: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  primaryCtaVisible: boolean;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  secondaryCtaVisible: boolean;
}

export interface AboutHomeQuickInfoInput {
  id?: string;
  icon: string;
  label: string;
  value: string;
  visible: boolean;
}

export interface AboutHomeStatInput {
  id?: string;
  icon: string;
  value: string;
  label: string;
  visible: boolean;
}
