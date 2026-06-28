import type { SocialPlatform } from "@/config/social-links.config";

export interface SiteSocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  href: string;
  visible: boolean;
  sortOrder: number;
}

export interface SocialLinkInput {
  platform: SocialPlatform;
  label: string;
  href: string;
  visible: boolean;
}
