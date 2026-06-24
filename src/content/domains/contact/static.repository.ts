import { contactContent } from "@/data/contact.data";

import type { ContactRepository } from "@/content/domains/contact/repository";

export const staticContactRepository: ContactRepository = {
  async get() {
    return contactContent;
  },
};
