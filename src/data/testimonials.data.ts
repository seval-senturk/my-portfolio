import type { TestimonialsContent } from "@/types/testimonials";

export const testimonialsContent: TestimonialsContent = {
  section: {
    label: "TESTIMONIALS",
    title: "What Clients Say",
    titleAccent: "Say",
    description:
      "Real feedback from clients and teams I've had the opportunity to work with.",
    sectionNumber: "06",
    visible: true,
    carousel: {
      enabled: true,
      autoplay: true,
      autoplayDelayMs: 5000,
      loop: true,
    },
  },
  items: [
    {
      id: "testimonial-001",
      quote:
        "Seval delivered a polished, performant product on schedule. Communication was clear throughout, and the codebase was clean enough for our team to extend without friction.",
      authorName: "James Carter",
      authorTitle: "CTO",
      company: "FinTech Solutions",
      avatarUrl: null,
      companyLogoUrl: null,
      rating: 5,
      visible: true,
      sortOrder: 0,
    },
    {
      id: "testimonial-002",
      quote:
        "From design handoff to production launch, the attention to detail was exceptional. Our Core Web Vitals improved significantly after the rebuild.",
      authorName: "Sarah Williams",
      authorTitle: "Product Lead",
      company: "Nova Digital",
      avatarUrl: null,
      companyLogoUrl: null,
      rating: 5,
      visible: true,
      sortOrder: 1,
    },
    {
      id: "testimonial-003",
      quote:
        "A reliable full-stack partner who understands both user experience and backend reliability. We'd work together again without hesitation.",
      authorName: "Michael Chen",
      authorTitle: "Founder",
      company: "Atlas Startup Labs",
      avatarUrl: null,
      companyLogoUrl: null,
      rating: 5,
      visible: true,
      sortOrder: 2,
    },
    {
      id: "testimonial-004",
      quote:
        "The admin panel and content workflows were thoughtfully built — our team can update the site without developer involvement.",
      authorName: "Emily Rodriguez",
      authorTitle: "Marketing Director",
      company: "BrightPath Agency",
      avatarUrl: null,
      companyLogoUrl: null,
      rating: 5,
      visible: true,
      sortOrder: 3,
    },
  ],
};
