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
  { fieldName: "logo", label: "Primary Logo", category: "Logo" as const },
  { fieldName: "logo-dark", label: "Logo (Dark Mode)", category: "Logo" as const },
  { fieldName: "favicon", label: "Favicon", category: "Favicon" as const },
  { fieldName: "apple-touch-icon", label: "Apple Touch Icon", category: "Icons" as const },
  { fieldName: "pwa-icon-192", label: "PWA Icon 192×192", category: "Icons" as const },
  { fieldName: "pwa-icon-512", label: "PWA Icon 512×512", category: "Icons" as const },
  { fieldName: "og-default", label: "Default OG Image", category: "Open Graph" as const },
  { fieldName: "og-blog-default", label: "Blog OG Default", category: "Open Graph" as const },
  { fieldName: "og-project-default", label: "Project OG Default", category: "Open Graph" as const },
  { fieldName: "og-resume-default", label: "Resume OG Default", category: "Open Graph" as const },
] as const;

export const AI_CAREER_MEDIA_FIELDS = [
  { fieldName: "generated-resume-pdf", label: "Generated Resume PDF", category: "Resume" as const },
  { fieldName: "cover-letter-pdf", label: "Cover Letter PDF", category: "Documents" as const },
  { fieldName: "resume-preview-image", label: "Resume Preview Image", category: "Resume" as const },
  { fieldName: "company-logo", label: "Company Logo (future)", category: "Logo" as const },
] as const;
