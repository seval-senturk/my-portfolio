import type { ContactPageConfig, SocialLink } from "@prisma/client";

import { contactContent } from "@/data/contact.data";
import { fromJson } from "@/repositories/prisma/mappers/json";
import {
  normalizeContactFormConfig,
  normalizeContactInfoLabels,
  normalizeContactSocialLinks,
} from "@/lib/contact/normalize";
import type { ContactContent, ContactSocialLink } from "@/types/contact";
import type { SocialPlatform } from "@/config/social-links.config";

function mapSiteSocialLinks(links: SocialLink[]): ContactSocialLink[] {
  return links.map((link, index) => ({
    id: link.id,
    platform: link.platform as SocialPlatform,
    label: link.label,
    href: link.href,
    visible: link.visible,
    sortOrder: link.sortOrder ?? index,
  }));
}

export function mapContactToContent(
  config: ContactPageConfig,
  siteSocialLinks: SocialLink[],
): ContactContent {
  const storedSocialLinks = fromJson<ContactSocialLink[] | null>(config.socialLinksConfig);
  const fallbackSocialLinks =
    storedSocialLinks && storedSocialLinks.length > 0
      ? storedSocialLinks
      : mapSiteSocialLinks(siteSocialLinks);

  return {
    section: {
      visible: config.sectionVisible,
      label: config.sectionLabel,
      title: config.sectionTitle,
      titleAccent: config.sectionTitleAccent ?? contactContent.section.titleAccent,
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
    infoLabels: normalizeContactInfoLabels(
      fromJson<ContactContent["infoLabels"] | null>(config.infoLabelsConfig),
    ),
    availabilityStatus: config.availabilityStatus as ContactContent["availabilityStatus"],
    responseTime: config.responseTime,
    calendarUrl: config.calendarUrl ?? undefined,
    socialLinks: normalizeContactSocialLinks(
      storedSocialLinks,
      fallbackSocialLinks.length > 0 ? fallbackSocialLinks : contactContent.socialLinks,
    ),
    resumeHref: config.resumeHref,
    resumeLabel: config.resumeLabel,
    form: normalizeContactFormConfig(fromJson(config.formConfig)),
    messages: fromJson<ContactContent["messages"]>(config.messagesConfig),
  };
}
