export type SocialPlatform =
  | "github"
  | "linkedin"
  | "email"
  | "x"
  | "instagram"
  | "medium"
  | "behance"
  | "dribbble";

export interface SocialLink {
  label: string;
  href: string;
  platform: SocialPlatform;
}

export const socialLinks: readonly SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/sevalsenturk",
    platform: "github",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sevalsenturk",
    platform: "linkedin",
  },
  {
    label: "Email",
    href: "mailto:hello@sevalsenturk.com",
    platform: "email",
  },
] as const;
