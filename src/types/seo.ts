export interface PageMetadataInput {
  title?: string;
  description?: string;
  keywords?: readonly string[];
  pathname?: string;
  noIndex?: boolean;
  ogImagePath?: string;
}

export interface JsonLdBase {
  "@context": "https://schema.org";
}

export interface PersonSchema extends JsonLdBase {
  "@type": "Person";
  name: string;
  jobTitle: string;
  url: string;
  email?: string;
  sameAs?: string[];
}

export interface WebSiteSchema extends JsonLdBase {
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  inLanguage: string;
}

export interface ArticleSchema extends JsonLdBase {
  "@type": "Article";
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  author: {
    "@type": "Person";
    name: string;
  };
}

export type StructuredDataSchema =
  | PersonSchema
  | WebSiteSchema
  | ArticleSchema
  | ProfilePageSchema
  | ResumeSchema;

/** Future schema — generator not implemented yet. */
export interface ProfilePageSchema extends JsonLdBase {
  "@type": "ProfilePage";
  name: string;
  url: string;
  description: string;
  mainEntity: {
    "@type": "Person";
    name: string;
    jobTitle: string;
  };
}

/** Future schema — generator not implemented yet. */
export interface ResumeSchema extends JsonLdBase {
  "@type": "Resume";
  name: string;
  url: string;
  dateModified: string;
  author: {
    "@type": "Person";
    name: string;
  };
}
