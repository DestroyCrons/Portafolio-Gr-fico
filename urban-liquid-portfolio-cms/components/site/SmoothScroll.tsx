"use client";

import { useEffect } from "react";
import Lenis from "lenis";

type SmoothScrollProps = {
  enabled: boolean;
  children: React.ReactNode;
};

export function SmoothScroll({ enabled, children }: SmoothScrollProps) {
  useEffect(() => {
    if (!enabled) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.08,
      smoothWheel: true,
      touchMultiplier: 1.25
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [enabled]);

  return <>{children}</>;
}

