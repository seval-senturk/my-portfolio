import type { BlogPost } from "@/types/blog";
import type { HomeCmsSection } from "@/types/section-header";

export type BlogHomeSelectionMode = "latest" | "featured" | "curated";

export interface BlogHomeCarouselSettings {
  enabled: boolean;
  autoplay: boolean;
  autoplayDelayMs: number;
  loop: boolean;
}

export interface BlogHomeSection extends HomeCmsSection {
  titleAccent?: string | null;
  sectionNumber: string;
  postLimit: number;
  selectionMode: BlogHomeSelectionMode;
  readMoreLabel: string;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  carousel: BlogHomeCarouselSettings;
}

export interface BlogHomeCuratedEntry {
  id: string;
  blogPostId: string;
  sortOrder: number;
  visible: boolean;
}

export interface BlogHomeContent {
  section: BlogHomeSection;
  posts: readonly BlogPost[];
}

export interface BlogHomeConfigInput {
  label: string;
  title: string;
  titleAccent?: string | null;
  description: string;
  sectionNumber: string;
  visible: boolean;
  carouselEnabled: boolean;
  autoplay: boolean;
  autoplayDelayMs: number;
  loop: boolean;
  postLimit: number;
  selectionMode: BlogHomeSelectionMode;
  readMoreLabel: string;
  ctaLabel?: string | null;
  ctaHref?: string | null;
}
