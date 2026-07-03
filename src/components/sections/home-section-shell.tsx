import { type ReactNode } from "react";

import { cn } from "@/lib/cn";

import { Container } from "@/components/ui/container";
import {
  HomeSectionHeader,
  type HomeSectionHeaderProps,
} from "@/components/sections/home-section-header";

export interface HomeSectionShellProps {
  id: string;
  headingId: string;
  children: ReactNode;
  sectionClassName?: string;
  containerClassName?: string;
  header?: Omit<HomeSectionHeaderProps, "headingId">;
  backdrop?: ReactNode;
}

export function HomeSectionShell({
  id,
  headingId,
  children,
  sectionClassName,
  containerClassName,
  header,
  backdrop,
}: HomeSectionShellProps) {
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("home-section", sectionClassName)}
    >
      {backdrop}
      <Container
        size="wide"
        className={cn("home-section__container", containerClassName)}
      >
        {header ? <HomeSectionHeader {...header} headingId={headingId} /> : null}
        {children}
      </Container>
    </section>
  );
}
