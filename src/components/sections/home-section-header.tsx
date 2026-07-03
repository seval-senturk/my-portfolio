import { type ElementType } from "react";

import { cn } from "@/lib/cn";
import type { SectionHeaderContent } from "@/types/section-header";

import { SectionTitle } from "@/components/sections/section-title";

export interface HomeSectionHeaderProps extends SectionHeaderContent {
  headingId: string;
  /** Use `div` when the header sits inside another layout block (e.g. About grid). */
  as?: "header" | "div";
  /** Adds standard spacing below the header block for standalone sections. */
  withSectionSpacing?: boolean;
  align?: "start" | "center";
  descriptionClassName?: string;
  className?: string;
}

export function HomeSectionHeader({
  label,
  title,
  titleAccent = null,
  description,
  headingId,
  as = "header",
  withSectionSpacing = true,
  align = "start",
  descriptionClassName,
  className,
}: HomeSectionHeaderProps) {
  const Root = as as ElementType;

  return (
    <Root
      className={cn(
        "home-section-header",
        !withSectionSpacing && "home-section-header--embedded",
        align === "center" && "home-section-header--center",
        className,
      )}
    >
      <p className="home-section-header__label">{label}</p>
      <SectionTitle id={headingId} title={title} titleAccent={titleAccent} />
      {description ? (
        <p
          className={cn(
            "home-section-header__description",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      ) : null}
    </Root>
  );
}
