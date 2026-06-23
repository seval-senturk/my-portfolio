export const fontWeightScale = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const lineHeightScale = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.625,
} as const;

export const typographyVariants = {
  display: {
    fontSize: "3.5rem",
    lineHeight: lineHeightScale.tight,
    fontWeight: fontWeightScale.semibold,
    letterSpacing: "-0.025em",
  },
  h1: {
    fontSize: "2.5rem",
    lineHeight: lineHeightScale.tight,
    fontWeight: fontWeightScale.semibold,
    letterSpacing: "-0.025em",
  },
  h2: {
    fontSize: "2rem",
    lineHeight: lineHeightScale.snug,
    fontWeight: fontWeightScale.semibold,
    letterSpacing: "-0.02em",
  },
  h3: {
    fontSize: "1.5rem",
    lineHeight: lineHeightScale.snug,
    fontWeight: fontWeightScale.semibold,
    letterSpacing: "-0.015em",
  },
  h4: {
    fontSize: "1.25rem",
    lineHeight: lineHeightScale.snug,
    fontWeight: fontWeightScale.medium,
    letterSpacing: "-0.01em",
  },
  bodyLarge: {
    fontSize: "1.125rem",
    lineHeight: lineHeightScale.relaxed,
    fontWeight: fontWeightScale.normal,
    letterSpacing: "0",
  },
  body: {
    fontSize: "1rem",
    lineHeight: lineHeightScale.relaxed,
    fontWeight: fontWeightScale.normal,
    letterSpacing: "0",
  },
  small: {
    fontSize: "0.875rem",
    lineHeight: lineHeightScale.normal,
    fontWeight: fontWeightScale.normal,
    letterSpacing: "0",
  },
  caption: {
    fontSize: "0.75rem",
    lineHeight: lineHeightScale.normal,
    fontWeight: fontWeightScale.medium,
    letterSpacing: "0.01em",
  },
} as const;

export type TypographyVariant = keyof typeof typographyVariants;

export const responsiveTypography = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  h4: "text-h4",
  bodyLarge: "text-body-lg",
  body: "text-body",
  small: "text-small",
  caption: "text-caption",
} as const;
