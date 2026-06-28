import {
  AtSign,
  BookOpen,
  Briefcase,
  Code2,
  Mail,
  type LucideIcon,
} from "lucide-react";

import type { SocialPlatform } from "@/config/social-links.config";

const LUCIDE_ICONS: Partial<Record<SocialPlatform, LucideIcon>> = {
  github: Code2,
  linkedin: Briefcase,
  email: Mail,
  x: AtSign,
  medium: BookOpen,
};

interface HeroSocialIconProps {
  platform: SocialPlatform;
  size?: number;
}

export function HeroSocialIcon({ platform, size = 16 }: HeroSocialIconProps) {
  const LucideIcon = LUCIDE_ICONS[platform];

  if (LucideIcon) {
    return <LucideIcon size={size} aria-hidden />;
  }

  if (platform === "instagram") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
      </svg>
    );
  }

  if (platform === "dribbble") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 0 1 2.307 5.365c-.237-.05-2.595-.52-4.965-.244-.099-.24-.198-.48-.317-.74-.308-.66-.66-1.32-1.021-1.96 2.078-.84 3.896-2.217 3.996-2.421zm-3.996 1.053a29.5 29.5 0 0 0-1.58-2.831 8.45 8.45 0 0 0-3.857 1.044c.752 1.217 1.405 2.494 1.938 3.812a31.5 31.5 0 0 1 3.499-2.025zM8.22 6.303A8.466 8.466 0 0 0 5.66 12c0 .752.099 1.484.277 2.177 1.82-.237 5.305-.99 7.787-2.454-.534-1.277-1.166-2.514-1.898-3.692A8.46 8.46 0 0 0 8.22 6.303zM12 19.938a8.45 8.45 0 0 1-4.748-1.442c.099-.02 2.277-.455 4.628-.178.158.336.317.673.455 1.03.752 1.838 1.561 3.676 1.665 3.59zM18.792 16.8c-.198-.653-.435-1.326-.712-2.018 2.336-.297 4.469.178 4.687.237a8.502 8.502 0 0 1-3.975 1.781z" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.938 4.503c.702 0 1.34.088 1.916.264.576.176 1.064.44 1.464.792.4.352.704.792.912 1.32.208.528.312 1.144.312 1.848 0 .616-.088 1.188-.264 1.716-.176.528-.44.984-.792 1.368-.352.384-.792.68-1.32.888-.528.208-1.144.312-1.848.312H4.598V4.503h2.34zm-.264 6.336c.352 0 .66-.044.924-.132.264-.088.484-.22.66-.396.176-.176.308-.396.396-.66.088-.264.132-.572.132-.924 0-.352-.044-.66-.132-.924a1.55 1.55 0 0 0-.396-.66 1.55 1.55 0 0 0-.66-.396 2.2 2.2 0 0 0-.924-.132H6.278v4.224h.396zm7.392-6.336h2.244v8.448h-2.244V4.503zm4.224 0H22.5v1.848h-3.432v1.716H22.14v1.716h-3.432v3.168h-2.244V4.503z" />
    </svg>
  );
}
