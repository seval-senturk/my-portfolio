"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";
import {
  HERO_NETWORK_PALETTE,
  resolveHeroNetworkDensity,
} from "@/features/hero/animation/hero-network.config";
import { createHeroNetworkEngine } from "@/features/hero/animation/hero-network.engine";
import type { HeroNetworkEngineHandle } from "@/features/hero/animation/hero-network.types";

interface HeroNetworkBackgroundProps {
  className?: string;
}

export function HeroNetworkBackground({ className }: HeroNetworkBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<HeroNetworkEngineHandle | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) {
      return;
    }

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const initialWidth = container.clientWidth;
    const initialDensity = resolveHeroNetworkDensity(initialWidth);

    const engine = createHeroNetworkEngine(canvas, {
      density: initialDensity,
      palette: HERO_NETWORK_PALETTE,
      reducedMotion: reducedMotionQuery.matches,
    });

    engineRef.current = engine;

    const resize = () => {
      const nextWidth = container.clientWidth;
      const nextHeight = container.clientHeight;

      if (nextWidth <= 0 || nextHeight <= 0) {
        return;
      }

      engine.setDensity(resolveHeroNetworkDensity(nextWidth));
      engine.resize(nextWidth, nextHeight);
    };

    resize();

    const resizeObserver = new ResizeObserver(() => {
      resize();
    });

    resizeObserver.observe(container);

    const updatePointer = (clientX: number, clientY: number, active: boolean) => {
      const rect = container.getBoundingClientRect();
      const inside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      engine.setPointer({
        x: clientX - rect.left,
        y: clientY - rect.top,
        active: active && inside,
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY, true);
    };

    const handlePointerLeave = () => {
      engine.setPointer({ x: -9999, y: -9999, active: false });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        engine.stop();
        return;
      }

      if (!reducedMotionQuery.matches) {
        engine.start();
      }
    };

    const handleReducedMotionChange = () => {
      const reduced = reducedMotionQuery.matches;
      engine.setReducedMotion(reduced);

      if (reduced) {
        engine.stop();
        engine.resize(container.clientWidth, container.clientHeight);
        return;
      }

      engine.start();
    };

    let intersectionObserver: IntersectionObserver | null = null;

    if ("IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries.some((entry) => entry.isIntersecting);

          if (!visible || document.hidden) {
            engine.stop();
            return;
          }

          if (!reducedMotionQuery.matches) {
            engine.start();
          }
        },
        { threshold: 0.05 },
      );

      intersectionObserver.observe(container);
    } else if (!reducedMotionQuery.matches) {
      engine.start();
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerLeave, { passive: true });
    window.addEventListener("blur", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("hero-section__network", className)}
      aria-hidden
    >
      <canvas ref={canvasRef} className="hero-section__network-canvas" />
    </div>
  );
}
