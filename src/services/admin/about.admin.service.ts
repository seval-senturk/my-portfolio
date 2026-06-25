import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";

export interface UpdateAboutInput {
  sectionTitle: string;
  sectionDescription: string;
  introductionParagraphs: string;
  storyTitle: string;
  storyParagraphs: string;
}

export async function updateAbout(input: UpdateAboutInput) {
  const introduction = {
    paragraphs: input.introductionParagraphs
      .split("\n\n")
      .map((item) => item.trim())
      .filter(Boolean),
  };

  const story = {
    title: input.storyTitle,
    paragraphs: input.storyParagraphs
      .split("\n\n")
      .map((item) => item.trim())
      .filter(Boolean),
  };

  const existing = await prisma.about.findUnique({
    where: { locale: DEFAULT_LOCALE },
  });

  return prisma.about.upsert({
    where: { locale: DEFAULT_LOCALE },
    update: {
      sectionTitle: input.sectionTitle,
      sectionDescription: input.sectionDescription,
      introduction,
      story,
    },
    create: {
      locale: DEFAULT_LOCALE,
      sectionTitle: input.sectionTitle,
      sectionDescription: input.sectionDescription,
      introduction,
      story,
      coreExpertise: existing?.coreExpertise ?? { title: "Core Expertise", items: [] },
      workingPrinciples: existing?.workingPrinciples ?? {
        title: "Working Principles",
        items: [],
      },
      professionalHighlights: existing?.professionalHighlights ?? {
        title: "Professional Highlights",
        items: [],
      },
      personalValues: existing?.personalValues ?? { title: "Personal Values", items: [] },
    },
  });
}

export async function getAboutRecord() {
  return prisma.about.findUnique({ where: { locale: DEFAULT_LOCALE } });
}

function fromJsonParagraphs(value: Prisma.JsonValue | null): string {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return "";
  }

  const paragraphs = (value as { paragraphs?: string[] }).paragraphs ?? [];
  return paragraphs.join("\n\n");
}

export function serializeAboutForForm(record: Awaited<ReturnType<typeof getAboutRecord>>) {
  if (!record) {
    return null;
  }

  const story = record.story as { title?: string; paragraphs?: string[] };

  return {
    sectionTitle: record.sectionTitle,
    sectionDescription: record.sectionDescription,
    introductionParagraphs: fromJsonParagraphs(record.introduction),
    storyTitle: story.title ?? "",
    storyParagraphs: (story.paragraphs ?? []).join("\n\n"),
  };
}
