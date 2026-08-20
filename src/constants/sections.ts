export const SECTION_IDS = {
  hero: "hero",
  about: "about",
  expertise: "expertise",
  experience: "experience",
  projects: "projects",
  testimonials: "testimonials",
  blog: "blog",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

export const ONE_PAGE_SECTION_IDS: readonly SectionId[] = [
  SECTION_IDS.hero,
  SECTION_IDS.about,
  SECTION_IDS.expertise,
  SECTION_IDS.experience,
  SECTION_IDS.projects,
  SECTION_IDS.testimonials,
  SECTION_IDS.blog,
  SECTION_IDS.contact,
];

/** Sticky header height used for scroll offset (matches lg header). */
export const SECTION_SCROLL_OFFSET_PX = 72;
