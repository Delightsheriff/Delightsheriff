"use client";

import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

// A soft light follows the pointer across the surface. The effect itself is CSS
// (.spotlight in globals.css) and only shows on devices that hover.
export function Spotlight({ className, children }: { className?: string; children: ReactNode }) {
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return (
    <div className={cn("spotlight", className)} onPointerMove={onPointerMove}>
      {children}
    </div>
  );
}
