import type { ExpertiseCarouselContent } from "@/types/expertise-carousel";
import { HomeSectionShell } from "@/components/sections";
import { ExpertiseGrid } from "@/features/expertise-carousel/components/expertise-grid";

interface ExpertiseCarouselSectionProps {
  content: ExpertiseCarouselContent;
}

export function ExpertiseCarouselSection({
  content,
}: ExpertiseCarouselSectionProps) {
  if (!content.section.visible || content.items.length === 0) {
    return null;
  }

  const headingId = "expertise-section-heading";

  return (
    <HomeSectionShell
      id="expertise"
      headingId={headingId}
      sectionClassName="expertise-section"
      header={{
        label: content.section.label,
        title: content.section.title,
        titleAccent: content.section.titleAccent,
      }}
    >
      <ExpertiseGrid items={content.items} />
    </HomeSectionShell>
  );
}
