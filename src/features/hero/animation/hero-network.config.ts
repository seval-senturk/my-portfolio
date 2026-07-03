import type { HeroNetworkDensity, HeroNetworkPalette } from "@/features/hero/animation/hero-network.types";

/** Portfolio accent — matches globals.css `--primary` / `#7c83ff`. */
export const HERO_NETWORK_PALETTE: HeroNetworkPalette = {
  lineBase: "124, 131, 255",
  lineHighlight: "124, 131, 255",
  nodeBase: "124, 131, 255",
  nodeHighlight: "164, 171, 255",
};

export const HERO_NETWORK_DENSITY = {
  mobile: {
    nodeCount: 22,
    linkDistance: 128,
    mouseRadius: 130,
    mouseStrength: 0.6,
    driftAmplitude: 0.4,
  },
  tablet: {
    nodeCount: 34,
    linkDistance: 148,
    mouseRadius: 150,
    mouseStrength: 0.7,
    driftAmplitude: 0.48,
  },
  desktop: {
    nodeCount: 52,
    linkDistance: 168,
    mouseRadius: 175,
    mouseStrength: 0.8,
    driftAmplitude: 0.55,
  },
} as const satisfies Record<string, HeroNetworkDensity>;

export function resolveHeroNetworkDensity(width: number): HeroNetworkDensity {
  if (width < 640) {
    return HERO_NETWORK_DENSITY.mobile;
  }

  if (width < 1024) {
    return HERO_NETWORK_DENSITY.tablet;
  }

  return HERO_NETWORK_DENSITY.desktop;
}

/** Spring/easing constants — tuned for premium, non-jarring motion. */
export const HERO_NETWORK_PHYSICS = {
  spring: 0.038,
  driftSpeed: 0.00045,
  lineWidth: 0.9,
  nodeMinRadius: 1.4,
  nodeMaxRadius: 2.4,
  maxDpr: 2,
} as const;
