import type { ContentQueryOptions } from "@/content/shared/types";
import type { ContentRepository } from "@/content/shared/repository";
import type { ContactContent } from "@/types/contact";

export type ContactRepository = ContentRepository<ContactContent>;

export type { ContentQueryOptions };
