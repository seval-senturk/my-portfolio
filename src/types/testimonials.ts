export interface TestimonialsCarouselSettings {
  enabled: boolean;
  autoplay: boolean;
  autoplayDelayMs: number;
  loop: boolean;
}

export interface TestimonialsSection {
  label: string;
  title: string;
  titleAccent?: string | null;
  description: string;
  sectionNumber: string;
  visible: boolean;
  carousel: TestimonialsCarouselSettings;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  company: string;
  avatarUrl?: string | null;
  companyLogoUrl?: string | null;
  rating?: number | null;
  testimonialDate?: string | null;
  visible: boolean;
  sortOrder: number;
}

export interface TestimonialsContent {
  section: TestimonialsSection;
  items: readonly TestimonialItem[];
}

export interface TestimonialsConfigInput {
  label: string;
  title: string;
  titleAccent: string;
  description: string;
  sectionNumber: string;
  visible: boolean;
  carouselEnabled: boolean;
  autoplay: boolean;
  autoplayDelayMs: number;
  loop: boolean;
}

export interface TestimonialItemInput {
  id?: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  company: string;
  avatarUrl: string;
  companyLogoUrl: string;
  rating?: number;
  testimonialDate?: string;
  visible: boolean;
}
