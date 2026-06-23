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

export interface AboutContent {
  section: AboutSectionHeader;
  introduction: {
    paragraphs: readonly string[];
  };
  story: AboutStory;
  coreExpertise: readonly AboutContentBlock[];
  workingPrinciples: readonly AboutContentBlock[];
  personalValues: readonly AboutContentBlock[];
}
