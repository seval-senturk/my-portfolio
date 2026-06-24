import { type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Heading } from "@/components/ui/heading";

interface SkillsSubsectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function SkillsSubsection({
  title,
  children,
  className,
}: SkillsSubsectionProps) {
  return (
    <div className={cn("mt-12 md:mt-16 first:mt-0", className)}>
      <Heading as="h3">{title}</Heading>
      <div className="mt-6">{children}</div>
    </div>
  );
}
