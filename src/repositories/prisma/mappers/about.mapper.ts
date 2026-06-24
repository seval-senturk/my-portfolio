import type { About } from "@prisma/client";

import { fromJson } from "@/repositories/prisma/mappers/json";
import type { AboutContent } from "@/types/about";

export function mapAboutToContent(about: About): AboutContent {
  return {
    section: {
      title: about.sectionTitle,
      description: about.sectionDescription,
    },
    introduction: fromJson<AboutContent["introduction"]>(about.introduction),
    story: fromJson<AboutContent["story"]>(about.story),
    coreExpertise: fromJson<AboutContent["coreExpertise"]>(about.coreExpertise),
    workingPrinciples: fromJson<AboutContent["workingPrinciples"]>(
      about.workingPrinciples,
    ),
    professionalHighlights: fromJson<AboutContent["professionalHighlights"]>(
      about.professionalHighlights,
    ),
    personalValues: fromJson<AboutContent["personalValues"]>(about.personalValues),
  };
}
