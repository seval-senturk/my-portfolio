import type { Skill, SkillsPageConfig } from "@prisma/client";

import { fromJson } from "@/repositories/prisma/mappers/json";
import type { SkillEntry, SkillsContent } from "@/types/skills";

export function mapSkillEntry(skill: Skill): SkillEntry {
  return {
    id: skill.id,
    name: skill.name,
    category: skill.category as SkillEntry["category"],
    description: skill.description ?? undefined,
    featured: skill.featured,
    yearsOfExperience: skill.yearsOfExperience ?? undefined,
    proficiencyLevel: skill.proficiencyLevel as SkillEntry["proficiencyLevel"],
  };
}

export function mapSkillsToContent(
  config: SkillsPageConfig,
  skills: Skill[],
): SkillsContent {
  const featuredExpertise = fromJson<SkillsContent["featuredExpertise"]["items"]>(
    config.featuredExpertise,
  );

  return {
    section: {
      title: config.sectionTitle,
      description: config.sectionDescription,
    },
    featuredExpertise: {
      header: { title: config.featuredTitle },
      items: featuredExpertise,
    },
    categories: {
      header: { title: config.categoriesTitle },
    },
    entries: skills.map(mapSkillEntry),
  };
}
