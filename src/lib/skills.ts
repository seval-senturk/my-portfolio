import type {
  SkillCategory,
  SkillCategoryGroup,
  SkillEntry,
} from "@/types/skills";

export const SKILL_CATEGORY_ORDER: readonly SkillCategory[] = [
  "Frontend Development",
  "Backend Development",
  "Databases",
  "AI & Integrations",
  "Tools & Workflow",
] as const;

export function groupSkillsByCategory(
  entries: readonly SkillEntry[],
): SkillCategoryGroup[] {
  const grouped = new Map<SkillCategory, SkillEntry[]>();

  for (const category of SKILL_CATEGORY_ORDER) {
    grouped.set(category, []);
  }

  for (const entry of entries) {
    const skills = grouped.get(entry.category);

    if (skills) {
      skills.push(entry);
    }
  }

  return SKILL_CATEGORY_ORDER.map((category) => ({
    category,
    skills: grouped.get(category) ?? [],
  })).filter((group) => group.skills.length > 0);
}

export function getFeaturedSkills(
  entries: readonly SkillEntry[],
): SkillEntry[] {
  return entries.filter((entry) => entry.featured);
}

export function getSkillsByCategory(
  entries: readonly SkillEntry[],
  category: SkillCategory,
): SkillEntry[] {
  return entries.filter((entry) => entry.category === category);
}

export function filterSkillsByQuery(
  entries: readonly SkillEntry[],
  query: string,
): SkillEntry[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [...entries];
  }

  return entries.filter((entry) => {
    const haystack = [
      entry.name,
      entry.category,
      entry.description ?? "",
      entry.proficiencyLevel ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}
