import type { ExpertiseCarouselContent } from "@/types/expertise-carousel";
import { Container } from "@/components/ui/container";
import { ExpertiseCarousel } from "@/features/expertise-carousel/components/expertise-carousel";
import { ExpertiseSectionHeader } from "@/features/expertise-carousel/components/expertise-section-header";

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
    <section
      id="expertise"
      aria-labelledby={headingId}
      className="expertise-section py-16 md:py-24"
    >
      <Container size="wide">
        <ExpertiseSectionHeader
          label={content.section.label}
          title={content.section.title}
          description={content.section.description}
          headingId={headingId}
          className="mb-10 md:mb-12"
        />
        <ExpertiseCarousel items={content.items} labelId={headingId} />
      </Container>
    </section>
  );
}
