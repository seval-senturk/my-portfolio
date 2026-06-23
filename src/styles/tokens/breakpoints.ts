export const breakpointScale = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const breakpointLabels = {
  mobile: breakpointScale.sm,
  tablet: breakpointScale.md,
  desktop: breakpointScale.lg,
  largeDesktop: breakpointScale.xl,
} as const;

export const breakpointMediaQueries = {
  sm: `(min-width: ${breakpointScale.sm})`,
  md: `(min-width: ${breakpointScale.md})`,
  lg: `(min-width: ${breakpointScale.lg})`,
  xl: `(min-width: ${breakpointScale.xl})`,
  "2xl": `(min-width: ${breakpointScale["2xl"]})`,
} as const;

export const containerWidths = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1200px",
  content: "72rem",
} as const;
