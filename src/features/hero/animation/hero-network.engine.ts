/**
 * Custom HTML5 Canvas network renderer.
 *
 * Why Canvas over SVG/WebGL:
 * - Hundreds of dynamic line segments + nodes per frame are cheaper on a single 2D context
 *   than mutating hundreds of SVG DOM nodes (layout/paint overhead in React).
 * - WebGL/Three.js would add bundle weight and GPU setup for a subtle 2D overlay — unnecessary.
 */

import {
  HERO_NETWORK_PHYSICS,
} from "@/features/hero/animation/hero-network.config";
import type {
  HeroNetworkDensity,
  HeroNetworkEngineHandle,
  HeroNetworkEngineOptions,
  HeroNetworkNode,
  HeroNetworkPointer,
} from "@/features/hero/animation/hero-network.types";

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function createNodes(
  count: number,
  width: number,
  height: number,
): HeroNetworkNode[] {
  const nodes: HeroNetworkNode[] = [];

  for (let index = 0; index < count; index += 1) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius =
      HERO_NETWORK_PHYSICS.nodeMinRadius +
      Math.random() *
        (HERO_NETWORK_PHYSICS.nodeMaxRadius - HERO_NETWORK_PHYSICS.nodeMinRadius);

    nodes.push({
      x,
      y,
      originX: x,
      originY: y,
      phase: Math.random() * Math.PI * 2,
      radius,
    });
  }

  return nodes;
}

export function createHeroNetworkEngine(
  canvas: HTMLCanvasElement,
  options: HeroNetworkEngineOptions,
): HeroNetworkEngineHandle {
  const ctx = canvas.getContext("2d", { alpha: true });

  if (!ctx) {
    throw new Error("Hero network canvas: 2D context unavailable.");
  }

  let width = 0;
  let height = 0;
  let dpr = 1;
  let density = options.density;
  let palette = options.palette;
  let reducedMotion = options.reducedMotion;
  let nodes = createNodes(density.nodeCount, 1, 1);
  let pointer: HeroNetworkPointer = { x: -9999, y: -9999, active: false };
  let rafId = 0;
  let running = false;
  let time = 0;
  let lastFrame = 0;

  function seedNodes() {
    nodes = createNodes(
      density.nodeCount,
      Math.max(width, 1),
      Math.max(height, 1),
    );
  }

  function resize(nextWidth: number, nextHeight: number) {
    const cappedDpr = clamp(
      window.devicePixelRatio || 1,
      1,
      options.dprCap ?? HERO_NETWORK_PHYSICS.maxDpr,
    );

    width = nextWidth;
    height = nextHeight;
    dpr = cappedDpr;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seedNodes();
    drawFrame(0);
  }

  function updateNodes(delta: number) {
    if (reducedMotion) {
      return;
    }

    time += delta;

    for (const node of nodes) {
      const driftScale = density.driftAmplitude * 14;
      const anchorX =
        node.originX +
        Math.sin(time * HERO_NETWORK_PHYSICS.driftSpeed + node.phase) * driftScale;
      const anchorY =
        node.originY +
        Math.cos(time * HERO_NETWORK_PHYSICS.driftSpeed * 1.17 + node.phase) *
          driftScale;

      let targetX = anchorX;
      let targetY = anchorY;

      if (pointer.active) {
        const dx = node.x - pointer.x;
        const dy = node.y - pointer.y;
        const distance = Math.hypot(dx, dy);

        if (distance > 0 && distance < density.mouseRadius) {
          const influence = 1 - distance / density.mouseRadius;
          const eased = influence * influence * density.mouseStrength;
          const push = eased * 42;
          targetX = node.x + (dx / distance) * push;
          targetY = node.y + (dy / distance) * push;
        }
      }

      node.x += (targetX - node.x) * HERO_NETWORK_PHYSICS.spring;
      node.y += (targetY - node.y) * HERO_NETWORK_PHYSICS.spring;

      node.x = clamp(node.x, -20, width + 20);
      node.y = clamp(node.y, -20, height + 20);
    }
  }

  function drawFrame(timestamp: number) {
    const delta = lastFrame === 0 ? 16 : timestamp - lastFrame;
    lastFrame = timestamp;

    updateNodes(delta);

    ctx.clearRect(0, 0, width, height);

    const linkDistance = density.linkDistance;
    const linkDistanceSq = linkDistance * linkDistance;
    const pointerActive = pointer.active && !reducedMotion;

    for (let i = 0; i < nodes.length; i += 1) {
      const a = nodes[i]!;

      for (let j = i + 1; j < nodes.length; j += 1) {
        const b = nodes[j]!;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;

        if (distSq > linkDistanceSq) {
          continue;
        }

        const dist = Math.sqrt(distSq);
        let alpha = (1 - dist / linkDistance) * 0.38;

        if (pointerActive) {
          const midX = (a.x + b.x) * 0.5;
          const midY = (a.y + b.y) * 0.5;
          const pointerDist = Math.hypot(midX - pointer.x, midY - pointer.y);

          if (pointerDist < density.mouseRadius * 1.15) {
            const glow = 1 - pointerDist / (density.mouseRadius * 1.15);
            alpha += glow * 0.28;
          }
        }

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(${palette.lineBase}, ${clamp(alpha, 0.08, 0.52)})`;
        ctx.lineWidth = HERO_NETWORK_PHYSICS.lineWidth;
        ctx.stroke();
      }
    }

    for (const node of nodes) {
      let alpha = 0.42;
      let radius = node.radius;
      let rgb = palette.nodeBase;

      if (pointerActive) {
        const pointerDist = Math.hypot(node.x - pointer.x, node.y - pointer.y);

        if (pointerDist < density.mouseRadius) {
          const glow = 1 - pointerDist / density.mouseRadius;
          alpha += glow * 0.38;
          radius += glow * 0.85;
          rgb = palette.nodeHighlight;
        }
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${clamp(alpha, 0.2, 0.82)})`;
      ctx.fill();
    }
  }

  function tick(timestamp: number) {
    if (!running) {
      return;
    }

    drawFrame(timestamp);
    rafId = window.requestAnimationFrame(tick);
  }

  function start() {
    if (running) {
      return;
    }

    running = true;
    lastFrame = 0;
    rafId = window.requestAnimationFrame(tick);
  }

  function stop() {
    running = false;

    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function destroy() {
    stop();
    nodes = [];
    pointer = { x: -9999, y: -9999, active: false };
  }

  return {
    resize,
    setPointer(nextPointer: HeroNetworkPointer) {
      pointer = nextPointer;
    },
    setReducedMotion(nextReduced: boolean) {
      reducedMotion = nextReduced;

      if (reducedMotion) {
        drawFrame(performance.now());
      }
    },
    setDensity(nextDensity: HeroNetworkDensity) {
      density = nextDensity;
      seedNodes();
      drawFrame(performance.now());
    },
    start,
    stop,
    destroy,
  };
}
