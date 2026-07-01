import type { ContentQueryOptions } from "@/content/shared/types";
import type { AboutHomeContent } from "@/types/about-home";

export interface AboutHomeRepository {
  get(options?: ContentQueryOptions): Promise<AboutHomeContent>;
}
