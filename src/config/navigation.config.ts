import type { NavigationItem } from "@/types/navigation";
import { ROUTES } from "@/constants/routes";

export const navigationConfig: readonly NavigationItem[] = [
  {
    label: "Home",
    href: ROUTES.home,
    description: "Professional portfolio homepage",
  },
] as const;
