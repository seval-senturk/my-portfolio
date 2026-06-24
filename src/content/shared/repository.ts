import type { ContentQueryOptions } from "@/content/shared/types";

export interface ContentRepository<T> {
  get(options?: ContentQueryOptions): Promise<T>;
}
