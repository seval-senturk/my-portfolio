import {
  BookOpen,
  FolderKanban,
  Home,
  Layers,
  MessageSquareQuote,
  Send,
  UserRound,
  type LucideIcon,
  BriefcaseBusiness,
} from "lucide-react";

import { SECTION_IDS, type SectionId } from "@/constants/sections";

export const SLIDE_NAV_ICONS: Record<SectionId, LucideIcon> = {
  [SECTION_IDS.hero]: Home,
  [SECTION_IDS.about]: UserRound,
  [SECTION_IDS.expertise]: Layers,
  [SECTION_IDS.experience]: BriefcaseBusiness,
  [SECTION_IDS.projects]: FolderKanban,
  [SECTION_IDS.testimonials]: MessageSquareQuote,
  [SECTION_IDS.blog]: BookOpen,
  [SECTION_IDS.contact]: Send,
};
