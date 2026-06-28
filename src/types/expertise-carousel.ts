export interface ExpertiseCarouselSection {
  label: string;
  title: string;
  description: string;
  visible: boolean;
}

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
  description: string;
  visible: boolean;
}
