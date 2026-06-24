import type { SkillCategoryGroup } from "@/types/skills";

import { SkillItem } from "@/components/shared/skill-item";
import { FeatureGrid } from "@/components/shared/feature-grid";
import { Heading } from "@/components/ui/heading";

interface SkillsCategoryGroupViewProps {
  group: SkillCategoryGroup;
}

function toCategoryId(category: SkillCategoryGroup["category"]): string {
  return `skills-category-${category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")}`;
}

export function SkillsCategoryGroupView({
  group,
}: SkillsCategoryGroupViewProps) {
  const categoryId = toCategoryId(group.category);

  return (
    <section aria-labelledby={categoryId}>
      <Heading as="h4" id={categoryId}>
        {group.category}
      </Heading>
      <FeatureGrid columns={2} className="mt-4 lg:grid-cols-3">
        {group.skills.map((skill) => (
          <li key={skill.id}>
            <SkillItem skill={skill} />
          </li>
        ))}
      </FeatureGrid>
    </section>
  );
}
