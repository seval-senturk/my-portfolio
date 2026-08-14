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
  { value: "briefcase", label: "Experience / Briefcase" },
  { value: "rocket", label: "Availability / Rocket" },
  { value: "map-pin", label: "Location" },
  { value: "languages", label: "Languages" },
  { value: "mail", label: "Email" },
  { value: "globe", label: "Remote / Globe" },
  { value: "calendar-check", label: "Calendar" },
  { value: "clock", label: "Clock" },
  { value: "building", label: "Building" },
  { value: "user", label: "User" },
  { value: "code", label: "Code" },
  { value: "zap", label: "Performance" },
  { value: "search", label: "Search / SEO" },
  { value: "brain", label: "AI / Brain" },
  { value: "star", label: "Star" },
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
  return name in ABOUT_HOME_ICON_MAP ? name : "briefcase";
}
