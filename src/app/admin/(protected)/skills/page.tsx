export const dynamic = "force-dynamic";

import { listSkillEntries } from "@/services/admin";
import { SkillsAdminView } from "@/features/admin/components/skills-admin-view";

export default async function AdminSkillsPage() {
  const entries = await listSkillEntries();

  return (
    <SkillsAdminView
      entries={entries.map((entry) => ({
        id: entry.id,
        name: entry.name,
        category: entry.category,
        description: entry.description,
        featured: entry.featured,
        yearsOfExperience: entry.yearsOfExperience,
        proficiencyLevel: entry.proficiencyLevel,
      }))}
    />
  );
}
