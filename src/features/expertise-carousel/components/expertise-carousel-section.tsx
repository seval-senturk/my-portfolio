import type { ExpertiseCarouselContent } from "@/types/expertise-carousel";
import { HomeSectionShell } from "@/components/sections";
import { ExpertiseCarousel } from "@/features/expertise-carousel/components/expertise-carousel";

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
      header={{
        label: content.section.label,
        title: content.section.title,
        titleAccent: content.section.titleAccent,
        description: content.section.description,
      }}
    >
      <ExpertiseCarousel items={content.items} labelId={headingId} />
    </HomeSectionShell>
  );
}
