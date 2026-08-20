import Image from "next/image";

import type { AboutHomeProfile } from "@/types/about-home";
import { optimizePortraitUrl } from "@/lib/media/optimize-portrait-url";
import { cn } from "@/lib/cn";

const PORTRAIT_WIDTH = 720;
const PORTRAIT_HEIGHT = 900;

interface AboutHomePortraitProps {
  profile: AboutHomeProfile;
  className?: string;
}

export function AboutHomePortrait({ profile, className }: AboutHomePortraitProps) {
  if (!profile?.visible) {
    return null;
  }

  const hasImage = Boolean(profile.imageSrc);
  const imageSrc = profile.imageSrc ? optimizePortraitUrl(profile.imageSrc) : undefined;

  return (
    <div className={cn("about-home-portrait", className)}>
      <div className="about-home-portrait__frame">
        <span
          className="about-home-portrait__corner about-home-portrait__corner--tr"
          aria-hidden
        />
        <span
          className="about-home-portrait__corner about-home-portrait__corner--bl"
          aria-hidden
        />

        {hasImage && imageSrc ? (
          <Image
            src={imageSrc}
            alt={profile.imageAlt}
            width={PORTRAIT_WIDTH}
            height={PORTRAIT_HEIGHT}
            className="about-home-portrait__photo"
            sizes="(max-width: 1023px) min(100vw - 3rem, 420px), 38vw"
          />
        ) : (
          <div
            role="img"
            aria-label={profile.imageAlt}
            className="about-home-portrait__photo about-home-portrait__photo--fallback"
          >
            <span className="about-home-portrait__initials" aria-hidden>
              {profile.initials}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
