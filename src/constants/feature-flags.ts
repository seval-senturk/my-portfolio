export const FEATURE_FLAGS = {
  blog: "blog",
  contactForm: "contactForm",
  newsletter: "newsletter",
  aiCareer: "aiCareer",
  mediaLibrary: "mediaLibrary",
  seoManagement: "seoManagement",
} as const;

export type FeatureFlagKey = (typeof FEATURE_FLAGS)[keyof typeof FEATURE_FLAGS];

export const DEFAULT_FEATURE_FLAGS: Record<FeatureFlagKey, boolean> = {
  blog: true,
  contactForm: true,
  newsletter: false,
  aiCareer: false,
  mediaLibrary: true,
  seoManagement: true,
};

export const FEATURE_FLAG_LABELS: Record<FeatureFlagKey, string> = {
  blog: "Blog",
  contactForm: "İletişim Formu",
  newsletter: "Bülten",
  aiCareer: "AI Kariyer Platformu",
  mediaLibrary: "Medya Kütüphanesi",
  seoManagement: "SEO Yönetimi",
};
