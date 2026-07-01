import Image from "next/image";

import { brandConfig } from "@/config/navigation.config";
import { optimizePortraitUrl } from "@/lib/media/optimize-portrait-url";
import type { AboutHomeContent } from "@/types/about-home";

interface AboutHomeProfileProps {
  profile: AboutHomeContent["profile"];
}

const IMAGE_WIDTH = 640;
const IMAGE_HEIGHT = 800;

export function AboutHomeProfile({ profile }: AboutHomeProfileProps) {
  const imageSrc = profile.imageUrl
    ? optimizePortraitUrl(profile.imageUrl)
    : null;

  return (
    <div className="about-home__profile">
      <div className="about-home__profile-frame">
        <span className="about-home__profile-corner about-home__profile-corner--tl" aria-hidden />
        <span className="about-home__profile-corner about-home__profile-corner--br" aria-hidden />

        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={profile.imageAlt}
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            loading="lazy"
            className="about-home__profile-image"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        ) : (
          <div
            role="img"
            aria-label={profile.imageAlt}
            className="about-home__profile-placeholder"
          >
            <span aria-hidden>{brandConfig.shortName}</span>
          </div>
        )}
      </div>
    </div>
  );
}
