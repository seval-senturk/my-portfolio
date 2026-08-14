import Image from "next/image";

import { cn } from "@/lib/cn";

interface ProjectCoverImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export function ProjectCoverImage({
  src,
  alt,
  priority = false,
  className,
}: ProjectCoverImageProps) {
  const isLocalPath = src.startsWith("/") && !src.startsWith("//");

  return (
    <div className={cn("project-cover-image", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 640px"
        priority={priority}
        unoptimized={isLocalPath}
        className="project-cover-image__img"
      />
    </div>
  );
}
