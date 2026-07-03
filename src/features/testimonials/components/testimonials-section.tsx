import type { TestimonialsContent } from "@/types/testimonials";

import { HomeSectionShell } from "@/components/sections";
import { TestimonialCard } from "@/features/testimonials/components/testimonial-card";
import { TestimonialsCarousel } from "@/features/testimonials/components/testimonials-carousel";

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
    <HomeSectionShell
      id="testimonials"
      headingId={headingId}
      header={{
        label: section.label,
        title: section.title,
        titleAccent: section.titleAccent,
        description: section.description,
        descriptionClassName: "home-section-header__description--muted",
      }}
    >
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
    </HomeSectionShell>
  );
}
