import {
  Briefcase,
  CalendarCheck,
  Globe,
  Languages,
  Mail,
  MapPin,
  Rocket,
  Star,
  User,
  type LucideIcon,
} from "lucide-react";

export const ABOUT_HOME_ICON_OPTIONS = [
  { value: "briefcase", label: "Briefcase" },
  { value: "map-pin", label: "Location" },
  { value: "mail", label: "Email" },
  { value: "languages", label: "Languages" },
  { value: "calendar-check", label: "Availability" },
  { value: "globe", label: "Remote" },
  { value: "user", label: "User" },
  { value: "rocket", label: "Rocket" },
  { value: "star", label: "Star" },
  { value: "clock", label: "Clock" },
  { value: "building", label: "Building" },
] as const;

export const ABOUT_HOME_ICON_MAP: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  "map-pin": MapPin,
  mail: Mail,
  languages: Languages,
  "calendar-check": CalendarCheck,
  globe: Globe,
  user: User,
  rocket: Rocket,
  star: Star,
};

export function resolveAboutHomeIcon(name: string): string {
  return ABOUT_HOME_ICON_OPTIONS.some((option) => option.value === name)
    ? name
    : "briefcase";
}
