import { prisma } from "@/lib/prisma";
import { saveResumePdfFile } from "@/lib/resume/pdf-storage";
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
  return prisma.resume.findUnique({
    where: { locale: DEFAULT_LOCALE },
    include: { files: { orderBy: { sortOrder: "asc" } } },
  });
}

export interface ResumeFileInfo {
  id: string;
  label: string;
  filePath: string;
  fileName: string;
  mimeType: string;
  isDefault: boolean;
}

export async function upsertDefaultResumePdf(input: {
  buffer: Buffer;
  originalName: string;
  label?: string;
}): Promise<ResumeFileInfo> {
  const { filePath, fileName } = await saveResumePdfFile(input.buffer, input.originalName);

  const resume = await prisma.resume.upsert({
    where: { locale: DEFAULT_LOCALE },
    update: {},
    create: {
      locale: DEFAULT_LOCALE,
      sectionTitle: "Resume Center",
      sectionDescription: "Professional resume hub",
      profile: {},
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
      contentUpdatedAt: new Date().toISOString().slice(0, 10),
    },
  });

  await prisma.resumeFile.updateMany({
    where: { resumeId: resume.id },
    data: { isDefault: false },
  });

  const file = await prisma.resumeFile.upsert({
    where: { id: `${resume.id}-default-pdf` },
    update: {
      label: input.label?.trim() || "English CV",
      filePath,
      fileName,
      mimeType: "application/pdf",
      isDefault: true,
      locale: DEFAULT_LOCALE,
    },
    create: {
      id: `${resume.id}-default-pdf`,
      resumeId: resume.id,
      locale: DEFAULT_LOCALE,
      label: input.label?.trim() || "English CV",
      filePath,
      fileName,
      mimeType: "application/pdf",
      isDefault: true,
      sortOrder: 0,
    },
  });

  return {
    id: file.id,
    label: file.label,
    filePath: file.filePath,
    fileName: file.fileName,
    mimeType: file.mimeType,
    isDefault: file.isDefault,
  };
}

export function serializeResumeFile(
  record: Awaited<ReturnType<typeof getResumeRecord>>,
): ResumeFileInfo | null {
  const defaultFile = record?.files.find((file) => file.isDefault) ?? record?.files[0];
  if (!defaultFile) {
    return null;
  }

  return {
    id: defaultFile.id,
    label: defaultFile.label,
    filePath: defaultFile.filePath,
    fileName: defaultFile.fileName,
    mimeType: defaultFile.mimeType,
    isDefault: defaultFile.isDefault,
  };
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
