import {
  Brain,
  Briefcase,
  Building,
  CalendarCheck,
  Clock,
  Code2,
  Globe,
  Languages,
  Mail,
  MapPin,
  Rocket,
  Search,
  Star,
  User,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const ABOUT_HOME_FEATURE_ICON_OPTIONS = [
  { value: "code", label: "Code" },
  { value: "zap", label: "Performance" },
  { value: "search", label: "Search / SEO" },
  { value: "brain", label: "AI / Brain" },
  { value: "briefcase", label: "Briefcase" },
  { value: "rocket", label: "Rocket" },
  { value: "star", label: "Star" },
  { value: "user", label: "User" },
  { value: "globe", label: "Globe" },
] as const;

export const ABOUT_HOME_ICON_MAP: Record<string, LucideIcon> = {
  code: Code2,
  zap: Zap,
  search: Search,
  brain: Brain,
  briefcase: Briefcase,
  "map-pin": MapPin,
  mail: Mail,
  languages: Languages,
  "calendar-check": CalendarCheck,
  globe: Globe,
  user: User,
  rocket: Rocket,
  star: Star,
  clock: Clock,
  building: Building,
};

export function resolveAboutHomeIcon(name: string): string {
  return ABOUT_HOME_FEATURE_ICON_OPTIONS.some((option) => option.value === name)
    ? name
    : "code";
}
