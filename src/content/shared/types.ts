export type ContentStatus = "draft" | "published" | "archived";

export type ContentLocale = string;

export type MediaProvider = "local" | "cloudinary" | "external";

export interface ContentMeta {
  id: string;
  slug?: string;
  locale: ContentLocale;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface SeoFields {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: MediaAsset;
  keywords?: readonly string[];
}

export interface MediaAsset {
  id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  provider: MediaProvider;
  publicId?: string;
}

export interface ContentQueryOptions {
  locale?: ContentLocale;
  status?: ContentStatus;
}

export interface PublishableContent<T> {
  meta: ContentMeta;
  seo: SeoFields;
  data: T;
}

export interface FooterContent {
  tagline: string;
  columns: {
    quickLinks: string;
    connect: string;
  };
  copyrightSuffix: string;
}
