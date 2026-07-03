import type { ContentQueryOptions } from "@/content/shared/types";
import type { BlogHomeContent } from "@/types/blog-home";

export interface BlogHomeRepository {
  get(options?: ContentQueryOptions): Promise<BlogHomeContent>;
}
