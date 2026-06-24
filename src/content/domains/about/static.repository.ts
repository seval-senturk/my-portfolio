import { aboutContent } from "@/data/about.data";

import type { AboutRepository } from "@/content/domains/about/repository";

export const staticAboutRepository: AboutRepository = {
  async get() {
    return aboutContent;
  },
};
