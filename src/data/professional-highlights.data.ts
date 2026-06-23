import type { IdentifiedStatItem } from "@/types/stats";

export const professionalHighlights: readonly IdentifiedStatItem[] = [
  { id: "experience", label: "Years of Experience", value: "5+" },
  { id: "projects", label: "Projects Delivered", value: "20+" },
  { id: "technologies", label: "Technologies Used", value: "15+" },
  { id: "industries", label: "Industries Worked With", value: "5+" },
] as const;
