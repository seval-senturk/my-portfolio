export interface MediaFolderDefinition {
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
}

export const MEDIA_FOLDER_DEFINITIONS: readonly MediaFolderDefinition[] = [
  { slug: "portfolio", name: "Portfolio", description: "General portfolio assets", sortOrder: 10 },
  { slug: "blog", name: "Blog", description: "Blog post images and covers", sortOrder: 20 },
  { slug: "projects", name: "Projects", description: "Project cover and gallery images", sortOrder: 30 },
  { slug: "resume", name: "Resume", description: "Resume PDFs and preview images", sortOrder: 40 },
  { slug: "seo", name: "SEO", description: "SEO-related imagery", sortOrder: 50 },
  { slug: "hero", name: "Hero", description: "Homepage hero imagery", sortOrder: 60 },
  { slug: "logos", name: "Logos", description: "Brand logos and wordmarks", sortOrder: 70 },
  { slug: "icons", name: "Icons", description: "Icons and favicons", sortOrder: 80 },
  { slug: "og-images", name: "Open Graph", description: "Open Graph and social share images", sortOrder: 90 },
  { slug: "documents", name: "Documents", description: "PDFs, certificates, and documents", sortOrder: 100 },
  { slug: "ai-career", name: "AI Career", description: "AI Career Platform assets (future)", sortOrder: 110 },
] as const;

export function getMediaFolderSlug(category: string | null | undefined): string {
  const normalized = category?.toLowerCase().trim();

  const categoryToFolder: Record<string, string> = {
    hero: "hero",
    projects: "projects",
    project: "projects",
    blog: "blog",
    resume: "resume",
    seo: "seo",
    "open graph": "og-images",
    "og-images": "og-images",
    logo: "logos",
    favicon: "icons",
    icons: "icons",
    documents: "documents",
    document: "documents",
    "ai-career": "ai-career",
  };

  if (normalized && categoryToFolder[normalized]) {
    return categoryToFolder[normalized];
  }

  return "portfolio";
}
