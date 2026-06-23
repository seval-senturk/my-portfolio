export interface ProfessionalHighlight {
  id: string;
  label: string;
  value: string;
}

export const professionalHighlights: readonly ProfessionalHighlight[] = [
  { id: "experience", label: "Years of Experience", value: "5+" },
  { id: "projects", label: "Projects Delivered", value: "20+" },
  { id: "technologies", label: "Technologies Used", value: "15+" },
  { id: "industries", label: "Industries Worked With", value: "5+" },
] as const;

export const heroHighlights = professionalHighlights.slice(0, 3);
