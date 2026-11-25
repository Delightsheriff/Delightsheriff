"use client";

import { useCallback, useRef, type PointerEvent, type ReactNode } from "react";
import { canHover, useSmoothTarget } from "@/lib/use-smooth-target";

type TiltProps = {
  children: ReactNode;
  className?: string;
  // Maximum rotation in degrees at the edges.
  max?: number;
  // Extra scale at the centre of the hover, e.g. 0.012 is 1.2%.
  lift?: number;
};

// The surface leans toward the pointer and settles back when it leaves.
export function Tilt({ children, className, max = 5, lift = 0.012 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  const apply = useCallback(([rx, ry, scale]: number[]) => {
    if (!ref.current) return;
    // Back at rest: drop the transform entirely so the browser can release the GPU layer.
    const resting = Math.abs(rx) < 0.01 && Math.abs(ry) < 0.01 && Math.abs(scale) < 0.0005;
    ref.current.style.transform = resting
      ? ""
      : `perspective(900px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) scale(${(1 + scale).toFixed(4)})`;
  }, []);
  const move = useSmoothTarget(apply, 3);

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!canHover()) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    move([-y * 2 * max, x * 2 * max, lift]);
  }

  return (
    <div
      ref={ref}
      className={className}
      onPointerMove={onPointerMove}
      onPointerLeave={() => move([0, 0, 0])}
    >
      {children}
    </div>
  );
}
