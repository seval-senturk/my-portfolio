import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { DEFAULT_LOCALE } from "@/repositories/shared/locale";
import type { AboutContent, AboutContentBlock } from "@/types/about";
import type { IdentifiedStatItem } from "@/types/stats";

export interface UpdateAboutInput {
  sectionTitle: string;
  sectionDescription: string;
  introductionParagraphs: string;
  storyTitle: string;
  storyParagraphs: string;
  coreExpertiseTitle: string;
  coreExpertiseItems: string;
  workingPrinciplesTitle: string;
  workingPrinciplesItems: string;
  professionalHighlightsTitle: string;
  professionalHighlightsItems: string;
  personalValuesTitle: string;
  personalValuesItems: string;
}

function splitParagraphs(value: string): string[] {
  return value
    .split("\n\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseAboutSimpleItems(value: string) {
  return value
    .split("\n---\n")
    .map((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length === 0) {
        return null;
      }

      return {
        title: lines[0] ?? "",
        description: lines.slice(1).join("\n"),
      };
    })
    .filter((item): item is { title: string; description: string } => Boolean(item?.title));
}

export function parseAboutExpertiseItems(value: string): AboutContentBlock[] {
  const items: AboutContentBlock[] = [];

  for (const block of value.split("\n---\n")) {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      continue;
    }

    const technologies = lines[2]
      ? lines[2]
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : undefined;

    items.push({
      title: lines[0] ?? "",
      description: lines[1] ?? "",
      technologies,
    });
  }

  return items;
}

export function parseAboutHighlightItems(value: string): IdentifiedStatItem[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [id, label, statValue] = line.split("|").map((part) => part.trim());
      if (!label) {
        return null;
      }

      return {
        id: id || `highlight-${index + 1}`,
        label,
        value: statValue ?? "",
      };
    })
    .filter((item): item is IdentifiedStatItem => Boolean(item));
}

export function serializeAboutSimpleItems(
  items: ReadonlyArray<{ title: string; description: string }>,
): string {
  return items
    .map((item) => [item.title, item.description].filter(Boolean).join("\n"))
    .join("\n---\n");
}

export function serializeAboutExpertiseItems(items: ReadonlyArray<AboutContentBlock>): string {
  return items
    .map((item) =>
      [
        item.title,
        item.description,
        item.technologies?.length ? item.technologies.join(", ") : "",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n---\n");
}

export function serializeAboutHighlightItems(items: ReadonlyArray<IdentifiedStatItem>): string {
  return items.map((item) => `${item.id} | ${item.label} | ${item.value}`).join("\n");
}

export async function updateAbout(input: UpdateAboutInput) {
  const introduction = {
    paragraphs: splitParagraphs(input.introductionParagraphs),
  };

  const story = {
    title: input.storyTitle,
    paragraphs: splitParagraphs(input.storyParagraphs),
  };

  const coreExpertise = {
    title: input.coreExpertiseTitle,
    items: parseAboutExpertiseItems(input.coreExpertiseItems),
  };

  const workingPrinciples = {
    title: input.workingPrinciplesTitle,
    items: parseAboutSimpleItems(input.workingPrinciplesItems),
  };

  const professionalHighlights = {
    title: input.professionalHighlightsTitle,
    items: parseAboutHighlightItems(input.professionalHighlightsItems),
  };

  const personalValues = {
    title: input.personalValuesTitle,
    items: parseAboutSimpleItems(input.personalValuesItems),
  };

  return prisma.about.upsert({
    where: { locale: DEFAULT_LOCALE },
    update: {
      sectionTitle: input.sectionTitle,
      sectionDescription: input.sectionDescription,
      introduction: introduction as Prisma.InputJsonValue,
      story: story as Prisma.InputJsonValue,
      coreExpertise: coreExpertise as unknown as Prisma.InputJsonValue,
      workingPrinciples: workingPrinciples as Prisma.InputJsonValue,
      professionalHighlights: professionalHighlights as unknown as Prisma.InputJsonValue,
      personalValues: personalValues as Prisma.InputJsonValue,
    },
    create: {
      locale: DEFAULT_LOCALE,
      sectionTitle: input.sectionTitle,
      sectionDescription: input.sectionDescription,
      introduction: introduction as Prisma.InputJsonValue,
      story: story as Prisma.InputJsonValue,
      coreExpertise: coreExpertise as unknown as Prisma.InputJsonValue,
      workingPrinciples: workingPrinciples as Prisma.InputJsonValue,
      professionalHighlights: professionalHighlights as unknown as Prisma.InputJsonValue,
      personalValues: personalValues as Prisma.InputJsonValue,
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

export function serializeAboutContentForForm(content: AboutContent) {
  return {
    sectionTitle: content.section.title,
    sectionDescription: content.section.description,
    introductionParagraphs: content.introduction.paragraphs.join("\n\n"),
    storyTitle: content.story.title,
    storyParagraphs: content.story.paragraphs.join("\n\n"),
    coreExpertiseTitle: content.coreExpertise.title,
    coreExpertiseItems: serializeAboutExpertiseItems(content.coreExpertise.items),
    workingPrinciplesTitle: content.workingPrinciples.title,
    workingPrinciplesItems: serializeAboutSimpleItems(content.workingPrinciples.items),
    professionalHighlightsTitle: content.professionalHighlights.title,
    professionalHighlightsItems: serializeAboutHighlightItems(
      content.professionalHighlights.items,
    ),
    personalValuesTitle: content.personalValues.title,
    personalValuesItems: serializeAboutSimpleItems(content.personalValues.items),
  };
}

export function serializeAboutForForm(record: Awaited<ReturnType<typeof getAboutRecord>>) {
  if (!record) {
    return null;
  }

  const story = record.story as { title?: string; paragraphs?: string[] };
  const coreExpertise = record.coreExpertise as {
    title?: string;
    items?: AboutContentBlock[];
  };
  const workingPrinciples = record.workingPrinciples as {
    title?: string;
    items?: Array<{ title: string; description: string }>;
  };
  const professionalHighlights = record.professionalHighlights as {
    title?: string;
    items?: IdentifiedStatItem[];
  };
  const personalValues = record.personalValues as {
    title?: string;
    items?: Array<{ title: string; description: string }>;
  };

  return {
    sectionTitle: record.sectionTitle,
    sectionDescription: record.sectionDescription,
    introductionParagraphs: fromJsonParagraphs(record.introduction),
    storyTitle: story.title ?? "",
    storyParagraphs: (story.paragraphs ?? []).join("\n\n"),
    coreExpertiseTitle: coreExpertise.title ?? "",
    coreExpertiseItems: serializeAboutExpertiseItems(coreExpertise.items ?? []),
    workingPrinciplesTitle: workingPrinciples.title ?? "",
    workingPrinciplesItems: serializeAboutSimpleItems(workingPrinciples.items ?? []),
    professionalHighlightsTitle: professionalHighlights.title ?? "",
    professionalHighlightsItems: serializeAboutHighlightItems(
      professionalHighlights.items ?? [],
    ),
    personalValuesTitle: personalValues.title ?? "",
    personalValuesItems: serializeAboutSimpleItems(personalValues.items ?? []),
  };
}
