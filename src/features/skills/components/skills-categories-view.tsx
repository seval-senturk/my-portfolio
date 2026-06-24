import type { SkillEntry, SkillsSubsectionHeader } from "@/types/skills";

import { groupSkillsByCategory } from "@/lib/skills";

import { SkillsCategoryGroupView } from "@/features/skills/components/skills-category-group-view";
import { SkillsSubsection } from "@/features/skills/components/skills-subsection";

interface SkillsCategoriesViewProps {
  header: SkillsSubsectionHeader;
  entries: readonly SkillEntry[];
}

export function SkillsCategoriesView({
  header,
  entries,
}: SkillsCategoriesViewProps) {
  const groups = groupSkillsByCategory(entries);

  return (
    <SkillsSubsection title={header.title}>
      <div className="space-y-10 md:space-y-12">
        {groups.map((group) => (
          <SkillsCategoryGroupView key={group.category} group={group} />
        ))}
      </div>
    </SkillsSubsection>
  );
}
