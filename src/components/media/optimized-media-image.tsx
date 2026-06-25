import type { MediaProvider } from "@prisma/client";

import { buildLazyImageProps } from "@/lib/media/build-delivery-url";

interface OptimizedMediaImageProps {
  storageProvider: MediaProvider;
  storageKey: string;
  publicUrl: string;
  alt: string;
  width?: number | null;
  height?: number | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function OptimizedMediaImage({
  storageProvider,
  storageKey,
  publicUrl,
  alt,
  width,
  height,
  className,
  sizes,
  priority = false,
}: OptimizedMediaImageProps) {
  const props = buildLazyImageProps({
    storageProvider,
    storageKey,
    publicUrl,
    alt,
    width,
    height,
    sizes,
  });

  return (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img
      {...props}
      className={className}
      loading={priority ? "eager" : props.loading}
      fetchPriority={priority ? "high" : undefined}
    />
  );
}
