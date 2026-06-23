import type { IdentifiedStatItem } from "@/types/stats";

export interface AboutSectionHeader {
  title: string;
  description: string;
}

export interface AboutContentBlock {
  title: string;
  description: string;
  technologies?: readonly string[];
}

export interface AboutStory {
  title: string;
  paragraphs: readonly string[];
}

export interface AboutTitledSection<T> {
  title: string;
  items: readonly T[];
}

export interface AboutContent {
  section: AboutSectionHeader;
  introduction: {
    paragraphs: readonly string[];
  };
  story: AboutStory;
  coreExpertise: AboutTitledSection<AboutContentBlock>;
  workingPrinciples: AboutTitledSection<AboutContentBlock>;
  professionalHighlights: AboutTitledSection<IdentifiedStatItem>;
  personalValues: AboutTitledSection<AboutContentBlock>;
}
