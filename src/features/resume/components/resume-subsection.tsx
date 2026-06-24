import { type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Heading } from "@/components/ui/heading";

interface ResumeSubsectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function ResumeSubsection({
  title,
  children,
  className,
}: ResumeSubsectionProps) {
  return (
    <section className={cn("mt-12 md:mt-16 first:mt-0", className)}>
      <Heading as="h3">{title}</Heading>
      <div className="mt-6">{children}</div>
    </section>
  );
}
