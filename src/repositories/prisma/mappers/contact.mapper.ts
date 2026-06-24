import type { ContactPageConfig, SocialLink } from "@prisma/client";

import { fromJson } from "@/repositories/prisma/mappers/json";
import type { ContactContent } from "@/types/contact";
import type { SocialPlatform } from "@/config/social-links.config";

export function mapContactToContent(
  config: ContactPageConfig,
  socialLinks: SocialLink[],
): ContactContent {
  return {
    section: {
      title: config.sectionTitle,
      description: config.sectionDescription,
    },
    information: {
      email: config.email,
      phone: config.phone ?? undefined,
      location: config.location,
      website: config.website,
      linkedin: config.linkedin,
      github: config.github,
    },
    availabilityStatus: config.availabilityStatus as ContactContent["availabilityStatus"],
    responseTime: config.responseTime,
    calendarUrl: config.calendarUrl ?? undefined,
    socialLinks: socialLinks.map((link) => ({
      id: link.id,
      platform: link.platform as SocialPlatform,
      label: link.label,
      href: link.href,
      visible: link.visible,
    })),
    resumeHref: config.resumeHref,
    resumeLabel: config.resumeLabel,
    form: fromJson<ContactContent["form"]>(config.formConfig),
    messages: fromJson<ContactContent["messages"]>(config.messagesConfig),
  };
}
