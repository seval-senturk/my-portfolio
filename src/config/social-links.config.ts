export interface SocialLink {
  label: string;
  href: string;
  platform: "github" | "linkedin" | "email" | "x";
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
