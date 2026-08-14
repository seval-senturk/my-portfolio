import { ROUTES } from "@/constants/routes";
import { siteConfig } from "@/config/site.config";
import { socialLinks } from "@/config/social-links.config";
import { absoluteUrl } from "@/lib/url";
import type { ContactContent } from "@/types/contact";

function getSocialHref(platform: "github" | "linkedin" | "email"): string {
  const link = socialLinks.find((item) => item.platform === platform);
  return link?.href ?? "";
}

const defaultFormFields = {
  name: {
    enabled: true,
    label: "Your Name",
    placeholder: "Your Name",
    required: true,
  },
  email: {
    enabled: true,
    label: "Email Address",
    placeholder: "Email Address",
    required: true,
  },
  phone: {
    enabled: true,
    label: "Phone Number",
    placeholder: "Phone Number",
    required: false,
  },
  projectType: {
    enabled: true,
    label: "Project Type",
    placeholder: "Project Type",
    required: false,
  },
  message: {
    enabled: true,
    label: "Message",
    placeholder: "Tell me about your project",
    required: true,
  },
} as const;

export const contactContent = {
  section: {
    visible: true,
    label: "CONTACT ME",
    title: "Let's Build",
    titleAccent: "Something Amazing",
    description:
      "Have a project in mind or want to collaborate? Let's create modern digital experiences together.",
  },
  information: {
    email: siteConfig.author.email,
    phone: "+90 543 123 45 67",
    location: "Istanbul, Turkey",
    website: absoluteUrl(),
    linkedin: getSocialHref("linkedin"),
    github: getSocialHref("github"),
  },
  infoLabels: {
    email: { label: "Email Address", visible: true },
    phone: { label: "Phone Number", visible: true },
    location: { label: "Location", visible: true },
  },
  availabilityStatus: "Available for Opportunities",
  responseTime: "Usually responds within 24–48 hours",
  socialLinks: [
    {
      id: "contact-social-linkedin",
      platform: "linkedin",
      label: "LinkedIn",
      href: getSocialHref("linkedin"),
      visible: true,
      sortOrder: 0,
    },
    {
      id: "contact-social-github",
      platform: "github",
      label: "GitHub",
      href: getSocialHref("github"),
      visible: true,
      sortOrder: 1,
    },
    {
      id: "contact-social-instagram",
      platform: "instagram",
      label: "Instagram",
      href: "https://instagram.com/",
      visible: true,
      sortOrder: 2,
    },
    {
      id: "contact-social-whatsapp",
      platform: "whatsapp",
      label: "WhatsApp",
      href: "https://wa.me/905431234567",
      visible: true,
      sortOrder: 3,
    },
    {
      id: "contact-social-email",
      platform: "email",
      label: "Email",
      href: getSocialHref("email"),
      visible: true,
      sortOrder: 4,
    },
  ],
  resumeHref: ROUTES.resume,
  resumeLabel: "View Resume Center",
  form: {
    ...defaultFormFields,
    submitLabel: "Send Message",
    projectTypeOptions: [
      { id: "full-time", label: "Full-time Opportunity" },
      { id: "freelance", label: "Freelance Project" },
      { id: "collaboration", label: "Collaboration" },
      { id: "other", label: "Other" },
    ],
    securityNote: {
      text: "Your information is secure and will never be shared.",
      visible: true,
    },
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
