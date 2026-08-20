import { contactContent } from "@/data/contact.data";
import { prisma } from "@/lib/prisma";
import { mapContactToContent } from "@/repositories/prisma/mappers/contact.mapper";
import { toJson } from "@/repositories/prisma/mappers/json";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";
import type { ContactConfigInput } from "@/types/contact";

function hasContactModels(): boolean {
  return (
    "contactPageConfig" in prisma &&
    typeof prisma.contactPageConfig?.findUnique === "function"
  );
}

export async function getContactConfigForAdmin(): Promise<ContactConfigInput> {
  if (!hasContactModels()) {
    return {
      sectionVisible: contactContent.section.visible,
      sectionLabel: contactContent.section.label,
      sectionTitle: contactContent.section.title,
      sectionTitleAccent: contactContent.section.titleAccent,
      sectionDescription: contactContent.section.description,
      email: contactContent.information.email,
      phone: contactContent.information.phone ?? "",
      location: contactContent.information.location,
      website: contactContent.information.website,
      linkedin: contactContent.information.linkedin,
      github: contactContent.information.github,
      availabilityStatus: contactContent.availabilityStatus,
      responseTime: contactContent.responseTime,
      calendarUrl: contactContent.calendarUrl ?? "",
      resumeHref: contactContent.resumeHref,
      resumeLabel: contactContent.resumeLabel,
      formConfig: contactContent.form,
      messagesConfig: contactContent.messages,
      infoLabels: contactContent.infoLabels,
      socialLinks: [...contactContent.socialLinks],
    };
  }

  const [config, siteSettings] = await Promise.all([
    prisma.contactPageConfig.findUnique({ where: { locale: DEFAULT_LOCALE } }),
    prisma.siteSettings.findUnique({
      where: { locale: DEFAULT_LOCALE },
      include: { socialLinks: { orderBy: { sortOrder: "asc" } } },
    }),
  ]);

  if (!config) {
    return {
      sectionVisible: contactContent.section.visible,
      sectionLabel: contactContent.section.label,
      sectionTitle: contactContent.section.title,
      sectionTitleAccent: contactContent.section.titleAccent,
      sectionDescription: contactContent.section.description,
      email: contactContent.information.email,
      phone: contactContent.information.phone ?? "",
      location: contactContent.information.location,
      website: contactContent.information.website,
      linkedin: contactContent.information.linkedin,
      github: contactContent.information.github,
      availabilityStatus: contactContent.availabilityStatus,
      responseTime: contactContent.responseTime,
      calendarUrl: contactContent.calendarUrl ?? "",
      resumeHref: contactContent.resumeHref,
      resumeLabel: contactContent.resumeLabel,
      formConfig: contactContent.form,
      messagesConfig: contactContent.messages,
      infoLabels: contactContent.infoLabels,
      socialLinks: [...contactContent.socialLinks],
    };
  }

  const content = mapContactToContent(config, siteSettings?.socialLinks ?? []);

  return {
    sectionVisible: content.section.visible,
    sectionLabel: content.section.label,
    sectionTitle: content.section.title,
    sectionTitleAccent: content.section.titleAccent,
    sectionDescription: content.section.description,
    email: content.information.email,
    phone: content.information.phone ?? "",
    location: content.information.location,
    website: content.information.website,
    linkedin: content.information.linkedin,
    github: content.information.github,
    availabilityStatus: content.availabilityStatus,
    responseTime: content.responseTime,
    calendarUrl: content.calendarUrl ?? "",
    resumeHref: content.resumeHref,
    resumeLabel: content.resumeLabel,
    formConfig: content.form,
    messagesConfig: content.messages,
    infoLabels: content.infoLabels,
    socialLinks: [...content.socialLinks],
  };
}

export async function updateContactConfig(input: ContactConfigInput) {
  if (!hasContactModels()) {
    throw new Error(
      'Prisma client is out of date. Stop the dev server, run "npx prisma generate", then restart.',
    );
  }

  return prisma.contactPageConfig.upsert({
    where: { locale: DEFAULT_LOCALE },
    update: {
      sectionVisible: input.sectionVisible,
      sectionLabel: input.sectionLabel,
      sectionTitle: input.sectionTitle,
      sectionTitleAccent: input.sectionTitleAccent || null,
      sectionDescription: input.sectionDescription,
      email: input.email,
      phone: input.phone || null,
      location: input.location,
      website: input.website,
      linkedin: input.linkedin,
      github: input.github,
      availabilityStatus: input.availabilityStatus,
      responseTime: input.responseTime,
      calendarUrl: input.calendarUrl || null,
      resumeHref: input.resumeHref,
      resumeLabel: input.resumeLabel,
      formConfig: toJson(input.formConfig),
      messagesConfig: toJson(input.messagesConfig),
      infoLabelsConfig: toJson(input.infoLabels),
      socialLinksConfig: toJson(input.socialLinks),
    },
    create: {
      locale: DEFAULT_LOCALE,
      sectionVisible: input.sectionVisible,
      sectionLabel: input.sectionLabel,
      sectionTitle: input.sectionTitle,
      sectionTitleAccent: input.sectionTitleAccent || null,
      sectionDescription: input.sectionDescription,
      email: input.email,
      phone: input.phone || null,
      location: input.location,
      website: input.website,
      linkedin: input.linkedin,
      github: input.github,
      availabilityStatus: input.availabilityStatus,
      responseTime: input.responseTime,
      calendarUrl: input.calendarUrl || null,
      resumeHref: input.resumeHref,
      resumeLabel: input.resumeLabel,
      formConfig: toJson(input.formConfig),
      messagesConfig: toJson(input.messagesConfig),
      infoLabelsConfig: toJson(input.infoLabels),
      socialLinksConfig: toJson(input.socialLinks),
    },
  });
}
