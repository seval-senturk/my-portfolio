import Image from "next/image";

import type { HeroProfile } from "@/types/hero";
import { cn } from "@/lib/cn";

const PROFILE_SIZE = 400;

interface HeroProfileImageProps {
  profile: HeroProfile;
  className?: string;
}

export function HeroProfileImage({
  profile,
  className,
}: HeroProfileImageProps) {
  const hasImage = Boolean(profile.imageSrc);

  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-2xl border border-border bg-muted shadow-md sm:max-w-sm lg:mx-0 lg:ml-auto lg:max-w-md",
        className,
      )}
    >
      {hasImage && profile.imageSrc ? (
        <Image
          src={profile.imageSrc}
          alt={profile.imageAlt}
          width={PROFILE_SIZE}
          height={PROFILE_SIZE}
          priority
          className="h-full w-full object-cover"
          sizes="(max-width: 1024px) 320px, 400px"
        />
      ) : (
        <div
          role="img"
          aria-label={profile.imageAlt}
          className="flex h-full w-full items-center justify-center bg-muted"
        >
          <span
            className="text-display text-muted-foreground select-none"
            aria-hidden
          >
            {profile.initials}
          </span>
        </div>
      )}
    </div>
  );
}
