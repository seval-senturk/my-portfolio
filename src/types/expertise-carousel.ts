import type { HomeCmsSection } from "@/types/section-header";

export interface ExpertiseCarouselSection extends HomeCmsSection {}

export interface ExpertiseCarouselItem {
  id: string;
  icon: string;
  title: string;
  description?: string;
  bulletItems: readonly string[];
  ctaLabel?: string | null;
  ctaHref?: string | null;
  visible: boolean;
  sortOrder: number;
}

export interface ExpertiseCarouselContent {
  section: ExpertiseCarouselSection;
  items: readonly ExpertiseCarouselItem[];
}

export interface ExpertiseCarouselItemInput {
  id?: string;
  icon: string;
  title: string;
  description?: string;
  bulletItems: string[];
  ctaLabel?: string;
  ctaHref?: string;
  visible: boolean;
}

export interface ExpertiseCarouselConfigInput {
  label: string;
  title: string;
  titleAccent?: string | null;
  description: string;
  visible: boolean;
}
