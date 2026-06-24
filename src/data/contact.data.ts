import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site.config";
import { socialLinks } from "@/config/social-links.config";
import { absoluteUrl } from "@/lib/url";
import type { ContactContent } from "@/types/contact";

function getSocialHref(platform: "github" | "linkedin" | "email"): string {
  const link = socialLinks.find((item) => item.platform === platform);
  return link?.href ?? "";
}

export const contactContent = {
  section: {
    title: "Get in Touch",
    description:
      "Open to full-time roles, freelance projects, and professional collaborations. Reach out for opportunities, project inquiries, or technical partnerships.",
  },
  information: {
    email: siteConfig.author.email,
    location: "Istanbul, Turkey · Remote-friendly",
    website: absoluteUrl(),
    linkedin: getSocialHref("linkedin"),
    github: getSocialHref("github"),
  },
  availabilityStatus: "Available for Opportunities",
  responseTime: "Usually responds within 24–48 hours",
  socialLinks: socialLinks.map((link, index) => ({
    id: `social-${link.platform}-${index}`,
    platform: link.platform,
    label: link.label,
    href: link.href,
    visible: true,
  })),
  resumeHref: ROUTES.resume,
  resumeLabel: "View Resume Center",
  form: {
    title: "Send a Message",
    nameLabel: "Name",
    emailLabel: "Email",
    subjectLabel: "Subject",
    messageLabel: "Message",
    companyLabel: "Company",
    projectTypeLabel: "Project Type",
    submitLabel: "Send Message",
    showCompanyField: true,
    showProjectTypeField: true,
    projectTypeOptions: [
      { id: "full-time", label: "Full-time Opportunity" },
      { id: "freelance", label: "Freelance Project" },
      { id: "collaboration", label: "Collaboration" },
      { id: "other", label: "Other" },
    ],
  },
  messages: {
    successTitle: "Message sent",
    successMessage:
      "Thank you for reaching out. I will review your message and get back to you within 24–48 hours.",
    errorTitle: "Unable to send message",
    errorMessage:
      "Something went wrong while submitting your message. Please try again or email me directly.",
    loadingLabel: "Sending message…",
  },
} as const satisfies ContactContent;
