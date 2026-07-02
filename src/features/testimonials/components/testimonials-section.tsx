import type { TestimonialsContent } from "@/types/testimonials";

import { Container } from "@/components/ui/container";
import { TestimonialCard } from "@/features/testimonials/components/testimonial-card";
import { TestimonialsCarousel } from "@/features/testimonials/components/testimonials-carousel";
import { TestimonialsSectionHeader } from "@/features/testimonials/components/testimonials-section-header";

interface TestimonialsSectionProps {
  content: TestimonialsContent;
}

export function TestimonialsSection({ content }: TestimonialsSectionProps) {
  if (!content.section.visible || content.items.length === 0) {
    return null;
  }

  const headingId = "testimonials-section-heading";
  const { section, items } = content;

  return (
    <section
      id="testimonials"
      aria-labelledby={headingId}
      className="testimonials-section"
    >
      <div className="testimonials-section__backdrop" aria-hidden>
        <span className="testimonials-section__ring testimonials-section__ring--one" />
        <span className="testimonials-section__ring testimonials-section__ring--two" />
        <span className="testimonials-section__section-number">
          {section.sectionNumber}
        </span>
      </div>

      <Container size="wide" className="testimonials-section__container">
        <TestimonialsSectionHeader
          label={section.label}
          title={section.title}
          titleAccent={section.titleAccent}
          description={section.description}
          headingId={headingId}
        />

        {section.carousel.enabled ? (
          <TestimonialsCarousel
            items={items}
            settings={section.carousel}
            labelId={headingId}
          />
        ) : (
          <div className="testimonials-static-grid">
            {items.map((item) => (
              <TestimonialCard key={item.id} item={item} isActive />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
