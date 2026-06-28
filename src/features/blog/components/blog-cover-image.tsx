import Image from "next/image";

import { cn } from "@/lib/cn";

interface BlogCoverImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export function BlogCoverImage({
  src,
  alt,
  priority = false,
  className,
}: BlogCoverImageProps) {
  const isLocalPath = src.startsWith("/") && !src.startsWith("//");

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 768px"
        priority={priority}
        unoptimized={isLocalPath}
        className="object-cover"
      />
    </div>
  );
}
