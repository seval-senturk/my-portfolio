import type { ResumeRepository } from "@/content/domains/resume/repository";
import { prisma } from "@/lib/prisma";
import { mapResumeToContent } from "@/repositories/prisma/mappers/resume.mapper";
import { ContentNotFoundError } from "@/repositories/shared/errors";
import { resolveLocale } from "@/repositories/shared/locale";
import type { ResumeFile } from "@/types/resume";

const resumeInclude = {
  files: { orderBy: { sortOrder: "asc" as const } },
  educations: { orderBy: { sortOrder: "asc" as const } },
  certifications: { orderBy: { sortOrder: "asc" as const } },
  languages: { orderBy: { sortOrder: "asc" as const } },
} as const;

export const prismaResumeRepository: ResumeRepository = {
  async get(options) {
    const locale = resolveLocale(options);
    const resume = await prisma.resume.findUnique({
      where: { locale },
      include: resumeInclude,
    });

    if (!resume) {
      throw new ContentNotFoundError("Resume", locale);
    }

    return mapResumeToContent(resume);
  },

  async getDefaultFile(options) {
    const locale = resolveLocale(options);
    const resume = await prisma.resume.findUnique({
      where: { locale },
      include: { files: { orderBy: { sortOrder: "asc" } } },
    });

    if (!resume) {
      return null;
    }

    const defaultFile =
      resume.files.find((file) => file.isDefault) ?? resume.files[0];

    if (!defaultFile) {
      return null;
    }

    return {
      id: defaultFile.id,
      locale: defaultFile.locale as ResumeFile["locale"],
      label: defaultFile.label,
      filePath: defaultFile.filePath,
      fileName: defaultFile.fileName,
      mimeType: defaultFile.mimeType as ResumeFile["mimeType"],
      isDefault: defaultFile.isDefault,
    };
  },
};
