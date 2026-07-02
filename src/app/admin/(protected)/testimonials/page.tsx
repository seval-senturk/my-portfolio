import { testimonialsContent } from "@/data/testimonials.data";
import { TestimonialsAdminView } from "@/features/admin/components/testimonials-admin-view";
import {
  getTestimonialsConfig,
  listTestimonialItems,
} from "@/services/admin";

export default async function AdminTestimonialsPage() {
  const [config, items] = await Promise.all([
    getTestimonialsConfig(),
    listTestimonialItems(),
  ]);

  const resolvedConfig = config
    ? {
        label: config.label,
        title: config.title,
        titleAccent: config.titleAccent ?? "",
        description: config.description,
        sectionNumber: config.sectionNumber,
        visible: config.visible,
        carouselEnabled: config.carouselEnabled,
        autoplay: config.autoplay,
        autoplayDelayMs: config.autoplayDelayMs,
        loop: config.loop,
      }
    : {
        label: testimonialsContent.section.label,
        title: testimonialsContent.section.title,
        titleAccent: testimonialsContent.section.titleAccent ?? "",
        description: testimonialsContent.section.description,
        sectionNumber: testimonialsContent.section.sectionNumber,
        visible: testimonialsContent.section.visible,
        carouselEnabled: testimonialsContent.section.carousel.enabled,
        autoplay: testimonialsContent.section.carousel.autoplay,
        autoplayDelayMs: testimonialsContent.section.carousel.autoplayDelayMs,
        loop: testimonialsContent.section.carousel.loop,
      };

  return (
    <TestimonialsAdminView
      config={resolvedConfig}
      items={items.map((item: (typeof items)[number]) => ({
        id: item.id,
        quote: item.quote,
        authorName: item.authorName,
        authorTitle: item.authorTitle,
        company: item.company,
        avatarUrl: item.avatarUrl,
        companyLogoUrl: item.companyLogoUrl,
        rating: item.rating,
        testimonialDate: item.testimonialDate?.toISOString() ?? null,
        visible: item.visible,
      }))}
    />
  );
}
