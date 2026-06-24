import { formatEmploymentPeriod } from "@/lib/date";
import type { ExperienceContent, ExperienceEntry } from "@/types/experience";
import type {
  FeaturedExpertiseEntry,
  SkillsContent,
} from "@/types/skills";
import type {
  ResumeContent,
  ResumeFile,
  ResumeStructuredDataInput,
} from "@/types/resume";

export function getDefaultResumeFile(
  files: readonly ResumeFile[],
): ResumeFile | undefined {
  return files.find((file) => file.isDefault) ?? files[0];
}

export function getResumeFileByLocale(
  files: readonly ResumeFile[],
  locale: ResumeFile["locale"],
): ResumeFile | undefined {
  return files.find((file) => file.locale === locale);
}

export function resolveExperienceSnapshot(
  entries: readonly ExperienceEntry[],
  entryIds: readonly string[],
): ExperienceEntry[] {
  const entryMap = new Map(entries.map((entry) => [entry.id, entry]));

  return entryIds
    .map((id) => entryMap.get(id))
    .filter((entry): entry is ExperienceEntry => entry !== undefined);
}

export function resolveSkillsSnapshot(
  items: readonly FeaturedExpertiseEntry[],
  itemIds: readonly string[],
): FeaturedExpertiseEntry[] {
  const itemMap = new Map(items.map((item) => [item.id, item]));

  return itemIds
    .map((id) => itemMap.get(id))
    .filter((item): item is FeaturedExpertiseEntry => item !== undefined);
}

export function toResumeStructuredDataInput(
  content: ResumeContent,
  experience: ExperienceContent,
  skills: SkillsContent,
): ResumeStructuredDataInput {
  const experienceEntries = resolveExperienceSnapshot(
    experience.entries,
    content.experienceSnapshot.entryIds,
  );

  const skillItems = resolveSkillsSnapshot(
    skills.featuredExpertise.items,
    content.skillsSnapshot.itemIds,
  );

  return {
    fullName: content.profile.fullName,
    title: content.profile.title,
    email: content.profile.email,
    url: content.profile.website,
    linkedin: content.profile.linkedin,
    github: content.profile.github,
    summary: content.profile.summary,
    location: content.profile.location,
    yearsOfExperience: content.profile.yearsOfExperience,
    updatedAt: content.updatedAt,
    skills: skillItems.map((item) => item.title),
    languages: content.languages.items.map(
      (language) => `${language.name} (${language.proficiency})`,
    ),
    workHistory: experienceEntries.map((entry) => ({
      position: entry.position,
      company: entry.company,
      period: formatEmploymentPeriod(entry),
      summary: entry.summary,
    })),
  };
}
