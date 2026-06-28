import type {
  Certification,
  Education,
  Resume,
  ResumeFile,
  ResumeLanguage,
} from "@prisma/client";

import { fromJson } from "@/repositories/prisma/mappers/json";
import { mapEmploymentDate } from "@/repositories/prisma/mappers/shared.mapper";
import type {
  ResumeCertification,
  ResumeContent,
  ResumeEducation,
  ResumeFile as ResumeFileType,
  ResumeLanguage as ResumeLanguageType,
} from "@/types/resume";

type ResumeWithRelations = Resume & {
  files: ResumeFile[];
  educations: Education[];
  certifications: Certification[];
  languages: ResumeLanguage[];
};

function mapResumeFile(file: ResumeFile): ResumeFileType {
  return {
    id: file.id,
    locale: file.locale as ResumeFileType["locale"],
    label: file.label,
    filePath: file.filePath,
    fileName: file.fileName,
    mimeType: file.mimeType as ResumeFileType["mimeType"],
    isDefault: file.isDefault,
  };
}

function mapEducation(education: Education): ResumeEducation {
  return {
    id: education.id,
    institution: education.institution,
    degree: education.degree,
    fieldOfStudy: education.fieldOfStudy ?? undefined,
    startDate: mapEmploymentDate(education.startMonth, education.startYear),
    endDate: mapEmploymentDate(education.endMonth, education.endYear),
    description: education.description ?? undefined,
  };
}

function mapCertification(certification: Certification): ResumeCertification {
  return {
    id: certification.id,
    title: certification.title,
    organization: certification.organization,
    issueDate: mapEmploymentDate(
      certification.issueMonth,
      certification.issueYear,
    ),
    credentialUrl: certification.credentialUrl ?? undefined,
  };
}

function mapLanguage(language: ResumeLanguage): ResumeLanguageType {
  return {
    id: language.id,
    name: language.name,
    proficiency: language.proficiency,
  };
}

export function mapResumeToContent(resume: ResumeWithRelations): ResumeContent {
  return {
    id: resume.id,
    section: {
      title: resume.sectionTitle,
      description: resume.sectionDescription,
    },
    profile: fromJson<ResumeContent["profile"]>(resume.profile),
    updatedAt: resume.contentUpdatedAt,
    professionalSummary: fromJson<ResumeContent["professionalSummary"]>(
      resume.professionalSummary,
    ),
    quickFacts: fromJson<ResumeContent["quickFacts"]>(resume.quickFacts),
    experienceSnapshot: fromJson<ResumeContent["experienceSnapshot"]>(
      resume.experienceSnapshot,
    ),
    skillsSnapshot: fromJson<ResumeContent["skillsSnapshot"]>(resume.skillsSnapshot),
    education: {
      title: resume.educationTitle,
      items: resume.educations.map(mapEducation),
    },
    certifications: {
      title: resume.certificationsTitle,
      items: resume.certifications.map(mapCertification),
    },
    languages: {
      title: resume.languagesTitle,
      items: resume.languages.map(mapLanguage),
    },
    files: resume.files.map(mapResumeFile),
    actions: fromJson<ResumeContent["actions"]>(resume.actions),
  };
}
