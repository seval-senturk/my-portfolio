import { Briefcase } from "lucide-react";

import { ABOUT_HOME_ICON_MAP } from "@/features/about-home/config/about-home-icons.config";

interface AboutHomeIconProps {
  name: string;
  size?: number;
  className?: string;
}

export function AboutHomeIcon({ name, size = 18, className }: AboutHomeIconProps) {
  const Icon = ABOUT_HOME_ICON_MAP[name] ?? Briefcase;
  return <Icon size={size} aria-hidden className={className} />;
}
