import { type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { ContainerSize, HeadingLevel, SectionSpacing } from "@/types/ui";

import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

const SPACING_CLASSES: Record<SectionSpacing, string> = {
  compact: "py-12 md:py-16",
  default: "py-16 md:py-24",
  loose: "py-24 md:py-32",
};

interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  titleAs?: HeadingLevel;
  headingId?: string;
  headerContainerSize?: ContainerSize;
  spacing?: SectionSpacing;
  children: ReactNode;
}

export function Section({
  title,
  description,
  titleAs = "h2",
  headingId,
  headerContainerSize,
  spacing = "default",
  className,
  children,
  ...props
}: SectionProps) {
  const hasHeader = Boolean(title ?? description);

  const header = hasHeader ? (
    <header className="mb-8 md:mb-12">
      {title && (
        <Heading as={titleAs} id={headingId}>
          {title}
        </Heading>
      )}
      {description && (
        <Text variant="body-large" tone="muted" className="mt-3 max-w-2xl">
          {description}
        </Text>
      )}
    </header>
  ) : null;

  return (
    <section className={cn(SPACING_CLASSES[spacing], className)} {...props}>
      {header &&
        (headerContainerSize ? (
          <Container size={headerContainerSize}>{header}</Container>
        ) : (
          header
        ))}
      {children}
    </section>
  );
}
