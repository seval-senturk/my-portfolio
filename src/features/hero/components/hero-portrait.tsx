import Image from "next/image";

import type { HeroProfile } from "@/types/hero";
import { optimizePortraitUrl } from "@/lib/media/optimize-portrait-url";
import { cn } from "@/lib/cn";

const PROFILE_SIZE = 800;

interface HeroPortraitProps {
  profile: HeroProfile;
  className?: string;
}

export function HeroPortrait({ profile, className }: HeroPortraitProps) {
  const hasImage = Boolean(profile.imageSrc);
  const imageSrc = profile.imageSrc
    ? optimizePortraitUrl(profile.imageSrc)
    : undefined;

  return (
    <div
      className={cn(
        "hero-portrait relative mx-auto w-full max-w-md overflow-visible sm:max-w-lg lg:max-w-xl",
        className,
      )}
    >
      <div className="hero-portrait__stage relative flex flex-col justify-end">
        {hasImage && imageSrc ? (
          <Image
            src={imageSrc}
            alt={profile.imageAlt}
            width={PROFILE_SIZE}
            height={PROFILE_SIZE}
            priority
            className="hero-portrait__photo relative z-10 mx-auto h-auto w-full max-h-[min(78vh,720px)] object-contain object-bottom drop-shadow-[0_28px_56px_rgba(0,0,0,0.4)]"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 420px, 560px"
          />
        ) : (
          <div
            role="img"
            aria-label={profile.imageAlt}
            className="hero-portrait__photo relative z-10 flex min-h-[420px] items-end justify-center"
          >
            <span
              className="font-serif-display text-display text-muted-foreground/40 select-none"
              aria-hidden
            >
              {profile.initials}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
