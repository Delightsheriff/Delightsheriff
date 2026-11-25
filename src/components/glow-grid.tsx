"use client";

import type { PointerEvent, ReactNode } from "react";
import { canHover } from "@/lib/use-smooth-target";
import { cn } from "@/lib/utils";

// Wrap a set of cards. As the pointer moves, every .glow-card inside gets the pointer's
// position relative to itself, so the edge of each nearby card lights up together.
export function GlowGrid({ children, className }: { children: ReactNode; className?: string }) {
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!canHover()) return;
    const cards = event.currentTarget.querySelectorAll<HTMLElement>(".glow-card");
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--gx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--gy", `${event.clientY - rect.top}px`);
    }
  }

  return (
    <div className={cn("glow-grid", className)} onPointerMove={onPointerMove}>
      {children}
    </div>
  );
}
