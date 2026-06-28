export const MEDIA_CATEGORIES = [
  "Hero",
  "Projects",
  "Blog",
  "Resume",
  "SEO",
  "Open Graph",
  "Logo",
  "Favicon",
  "Icons",
  "Documents",
  "AI Career",
] as const;

export type MediaCategory = (typeof MEDIA_CATEGORIES)[number];

export const BRAND_ASSET_FIELDS = [
  { fieldName: "logo", label: "Ana Logo", category: "Logo" as const },
  { fieldName: "logo-dark", label: "Logo (Koyu Mod)", category: "Logo" as const },
  { fieldName: "favicon", label: "Favicon", category: "Favicon" as const },
  { fieldName: "apple-touch-icon", label: "Apple Dokunmatik İkon", category: "Icons" as const },
  { fieldName: "pwa-icon-192", label: "PWA İkon 192×192", category: "Icons" as const },
  { fieldName: "pwa-icon-512", label: "PWA İkon 512×512", category: "Icons" as const },
  { fieldName: "og-default", label: "Varsayılan OG Görseli", category: "Open Graph" as const },
  { fieldName: "og-blog-default", label: "Blog OG Varsayılanı", category: "Open Graph" as const },
  { fieldName: "og-project-default", label: "Proje OG Varsayılanı", category: "Open Graph" as const },
  { fieldName: "og-resume-default", label: "Özgeçmiş OG Varsayılanı", category: "Open Graph" as const },
] as const;

export const AI_CAREER_MEDIA_FIELDS = [
  { fieldName: "generated-resume-pdf", label: "Oluşturulan Özgeçmiş PDF", category: "Resume" as const },
  { fieldName: "cover-letter-pdf", label: "Ön Yazı PDF", category: "Documents" as const },
  { fieldName: "resume-preview-image", label: "Özgeçmiş Önizleme Görseli", category: "Resume" as const },
  { fieldName: "company-logo", label: "Şirket Logosu (gelecek)", category: "Logo" as const },
] as const;
