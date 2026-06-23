import { type LucideIcon, type LucideProps } from "lucide-react";

import { cn } from "@/lib/cn";

const ICON_SIZES = {
  sm: 14,
  md: 16,
  lg: 20,
} as const;

export type IconSize = keyof typeof ICON_SIZES;

interface IconProps extends LucideProps {
  icon: LucideIcon;
  size?: IconSize;
  label?: string;
}

export function Icon({
  icon: IconComponent,
  size = "md",
  label,
  className,
  ...props
}: IconProps) {
  return (
    <IconComponent
      size={ICON_SIZES[size]}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}
