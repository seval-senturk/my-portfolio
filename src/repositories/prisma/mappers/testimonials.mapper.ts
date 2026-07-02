import type {
  TestimonialItem,
  TestimonialsContent,
} from "@/types/testimonials";

export function mapTestimonialItem(item: {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
  company: string;
  avatarUrl: string | null;
  companyLogoUrl: string | null;
  rating: number | null;
  testimonialDate: Date | null;
  visible: boolean;
  sortOrder: number;
}): TestimonialItem {
  return {
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
    sortOrder: item.sortOrder,
  };
}

export function mapTestimonialsToContent(
  config: {
    label: string;
    title: string;
    titleAccent: string | null;
    description: string;
    sectionNumber: string;
    visible: boolean;
    carouselEnabled: boolean;
    autoplay: boolean;
    autoplayDelayMs: number;
    loop: boolean;
  },
  items: Array<Parameters<typeof mapTestimonialItem>[0]>,
): TestimonialsContent {
  return {
    section: {
      label: config.label,
      title: config.title,
      titleAccent: config.titleAccent,
      description: config.description,
      sectionNumber: config.sectionNumber,
      visible: config.visible,
      carousel: {
        enabled: config.carouselEnabled,
        autoplay: config.autoplay,
        autoplayDelayMs: config.autoplayDelayMs,
        loop: config.loop,
      },
    },
    items: items
      .filter((item) => item.visible)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(mapTestimonialItem),
  };
}
