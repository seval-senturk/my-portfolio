/** Shared label + title + description block for home page sections. */
export interface SectionHeaderContent {
  label: string;
  title: string;
  titleAccent?: string | null;
  description?: string;
}

/** CMS-managed home section header fields. */
export interface HomeCmsSection extends SectionHeaderContent {
  description: string;
  visible: boolean;
}

/** Standard `{ section, items }` envelope for list-based home sections. */
export interface CmsSectionContent<TItem> {
  section: HomeCmsSection;
  items: readonly TItem[];
}
