import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";

export interface UpdateResumeInput {
  sectionTitle: string;
  sectionDescription: string;
  profileSummary: string;
  profileTitle: string;
  profileLocation: string;
  contentUpdatedAt: string;
}

export async function updateResume(input: UpdateResumeInput) {
  const existing = await prisma.resume.findUnique({
    where: { locale: DEFAULT_LOCALE },
  });

  const profile = {
    ...(typeof existing?.profile === "object" && !Array.isArray(existing.profile)
      ? (existing.profile as Record<string, unknown>)
      : {}),
    summary: input.profileSummary,
    title: input.profileTitle,
    location: input.profileLocation,
  };

  return prisma.resume.upsert({
    where: { locale: DEFAULT_LOCALE },
    update: {
      sectionTitle: input.sectionTitle,
      sectionDescription: input.sectionDescription,
      profile,
      contentUpdatedAt: input.contentUpdatedAt,
    },
    create: {
      locale: DEFAULT_LOCALE,
      sectionTitle: input.sectionTitle,
      sectionDescription: input.sectionDescription,
      profile,
      contentUpdatedAt: input.contentUpdatedAt,
      professionalSummary: { title: "Professional Summary", paragraphs: [] },
      quickFacts: { title: "Quick Facts", items: [] },
      experienceSnapshot: {
        title: "Experience Snapshot",
        viewAllLabel: "View full experience",
        viewAllHref: "/experience",
        entryIds: [],
      },
      skillsSnapshot: {
        title: "Skills Snapshot",
        viewAllLabel: "View full skills",
        viewAllHref: "/skills",
        itemIds: [],
      },
      actions: {
        downloadLabel: "Download Resume",
        viewLabel: "View Resume",
        contactLabel: "Contact Me",
        contactHref: "/contact",
      },
    },
  });
}

export async function getResumeRecord() {
  return prisma.resume.findUnique({ where: { locale: DEFAULT_LOCALE } });
}

export function serializeResumeForForm(record: Awaited<ReturnType<typeof getResumeRecord>>) {
  if (!record) {
    return null;
  }

  const profile = record.profile as {
    summary?: string;
    title?: string;
    location?: string;
  };

  return {
    sectionTitle: record.sectionTitle,
    sectionDescription: record.sectionDescription,
    profileSummary: profile.summary ?? "",
    profileTitle: profile.title ?? "",
    profileLocation: profile.location ?? "",
    contentUpdatedAt: record.contentUpdatedAt,
  };
}
