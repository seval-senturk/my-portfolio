export interface SiteAuthor {
  name: string;
  jobTitle: string;
  email: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  locale: string;
  language: string;
  author: SiteAuthor;
}
