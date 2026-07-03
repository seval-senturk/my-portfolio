export interface HeroNetworkNode {
  x: number;
  y: number;
  originX: number;
  originY: number;
  phase: number;
  radius: number;
}

export interface HeroNetworkPointer {
  x: number;
  y: number;
  active: boolean;
}

export interface HeroNetworkDensity {
  nodeCount: number;
  linkDistance: number;
  mouseRadius: number;
  mouseStrength: number;
  driftAmplitude: number;
}

export interface HeroNetworkPalette {
  lineBase: string;
  lineHighlight: string;
  nodeBase: string;
  nodeHighlight: string;
}

export interface HeroNetworkEngineOptions {
  density: HeroNetworkDensity;
  palette: HeroNetworkPalette;
  reducedMotion: boolean;
  dprCap?: number;
}

export interface HeroNetworkEngineHandle {
  resize(width: number, height: number): void;
  setPointer(pointer: HeroNetworkPointer): void;
  setReducedMotion(reduced: boolean): void;
  setDensity(density: HeroNetworkDensity): void;
  start(): void;
  stop(): void;
  destroy(): void;
}
