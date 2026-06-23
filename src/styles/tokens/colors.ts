export const lightColors = {
  background: "#FAFAFA",
  surface: "#FFFFFF",
  foreground: "#0F0F0F",
  primary: "#0F0F0F",
  primaryForeground: "#FAFAFA",
  secondary: "#71717A",
  secondaryForeground: "#FAFAFA",
  accent: "#2563EB",
  accentForeground: "#FFFFFF",
  border: "#E4E4E7",
  muted: "#F4F4F5",
  mutedForeground: "#71717A",
  success: "#16A34A",
  successForeground: "#FFFFFF",
  warning: "#CA8A04",
  warningForeground: "#FFFFFF",
  error: "#DC2626",
  errorForeground: "#FFFFFF",
} as const;

export const darkColors = {
  background: "#0A0A0A",
  surface: "#141414",
  foreground: "#FAFAFA",
  primary: "#FAFAFA",
  primaryForeground: "#0F0F0F",
  secondary: "#A1A1AA",
  secondaryForeground: "#0F0F0F",
  accent: "#3B82F6",
  accentForeground: "#FFFFFF",
  border: "#27272A",
  muted: "#1C1C1E",
  mutedForeground: "#A1A1AA",
  success: "#22C55E",
  successForeground: "#0F0F0F",
  warning: "#EAB308",
  warningForeground: "#0F0F0F",
  error: "#EF4444",
  errorForeground: "#FFFFFF",
} as const;

export type ColorToken = keyof typeof lightColors;

export const colorTokens = lightColors;
