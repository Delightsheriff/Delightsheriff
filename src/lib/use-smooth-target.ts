"use client";

import { useCallback, useEffect, useRef } from "react";

// Eases a few numbers toward a moving target, one animation frame at a time, so pointer
// effects feel like they have weight instead of snapping. The loop sleeps once it settles.
export function useSmoothTarget(apply: (values: number[]) => void, size: number, ease = 0.14) {
  const current = useRef<number[]>(Array.from({ length: size }, () => 0));
  const target = useRef<number[]>(Array.from({ length: size }, () => 0));
  const frame = useRef(0);
  const step = useRef<() => void>(() => {});

  useEffect(() => {
    step.current = () => {
      let moving = false;
      for (let i = 0; i < current.current.length; i++) {
        const delta = target.current[i] - current.current[i];
        if (Math.abs(delta) > 0.001) moving = true;
        current.current[i] += delta * ease;
      }
      apply(current.current);
      frame.current = moving ? requestAnimationFrame(() => step.current()) : 0;
    };
  }, [apply, ease]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return useCallback((next: number[]) => {
    target.current = next;
    if (!frame.current) frame.current = requestAnimationFrame(() => step.current());
  }, []);
}

export function canHover(): boolean {
  return (
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
