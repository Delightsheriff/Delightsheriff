"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { canHover, useSmoothTarget } from "@/lib/use-smooth-target";

type MagnetProps = {
  children: ReactNode;
  className?: string;
  // How far from the element, in pixels, the pull starts.
  range?: number;
  // Fraction of the pointer offset the element follows.
  pull?: number;
};

// The element drifts toward the pointer as it gets close, then eases back home.
export function Magnet({ children, className, range = 90, pull = 0.25 }: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);

  const apply = useCallback(([x, y]: number[]) => {
    if (!ref.current) return;
    // Back at rest: drop the transform entirely so the browser can release the GPU layer.
    ref.current.style.transform = Math.abs(x) < 0.05 && Math.abs(y) < 0.05 ? "" : `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
  }, []);
  const move = useSmoothTarget(apply, 2, 0.16);

  useEffect(() => {
    if (!canHover()) return;

    function onPointerMove(event: globalThis.PointerEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Measure from the untransformed centre so the pull doesn't chase itself.
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const near =
        Math.abs(dx) < rect.width / 2 + range && Math.abs(dy) < rect.height / 2 + range;
      move(near ? [dx * pull, dy * pull] : [0, 0]);
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [move, range, pull]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
