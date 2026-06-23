export const animationDuration = {
  fast: "150ms",
  normal: "200ms",
  slow: "300ms",
} as const;

export const animationEasing = {
  default: "cubic-bezier(0.4, 0, 0.2, 1)",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  inOut: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export const transitionTokens = {
  fast: `${animationDuration.fast} ${animationEasing.default}`,
  normal: `${animationDuration.normal} ${animationEasing.default}`,
  slow: `${animationDuration.slow} ${animationEasing.default}`,
} as const;
