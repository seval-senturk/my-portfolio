import type { LucideIcon } from "lucide-react";
import {
  Box,
  Brain,
  Code2,
  Cpu,
  Database,
  Globe,
  Layers,
  Palette,
  PenTool,
  Server,
  Shield,
  Smartphone,
  Sparkles,
  Workflow,
} from "lucide-react";

export const EXPERTISE_ICON_OPTIONS = [
  "Layers",
  "Code2",
  "PenTool",
  "Server",
  "Database",
  "Cpu",
  "Sparkles",
  "Shield",
  "Globe",
  "Smartphone",
  "Palette",
  "Box",
  "Brain",
  "Workflow",
] as const;

export type ExpertiseIconName = (typeof EXPERTISE_ICON_OPTIONS)[number];

const ICON_MAP: Record<ExpertiseIconName, LucideIcon> = {
  Layers,
  Code2,
  PenTool,
  Server,
  Database,
  Cpu,
  Sparkles,
  Shield,
  Globe,
  Smartphone,
  Palette,
  Box,
  Brain,
  Workflow,
};

export function resolveExpertiseIcon(name: string): LucideIcon {
  if (name in ICON_MAP) {
    return ICON_MAP[name as ExpertiseIconName];
  }

  return Sparkles;
}
