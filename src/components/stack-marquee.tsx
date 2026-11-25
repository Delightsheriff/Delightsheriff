"use client";

import { useEffect, useRef } from "react";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// A band of the tools I work with that drifts sideways, speeds up with the scroll, reverses
// when you scroll back, and leans into the motion. With reduced motion it is a plain wrapped list.
export function StackMarquee({ items }: { items: string[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = track.current;
    const host = root.current;
    if (!el || !host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let x = 0;
    let velocity = 0;
    let direction = 1;
    let lastY = window.scrollY;
    let last = performance.now();
    let frame = 0;
    let visible = true;

    function tick(now: number) {
      const dt = Math.min(50, now - last) / 16.67;
      last = now;

      const y = window.scrollY;
      velocity += (y - lastY - velocity) * 0.12;
      lastY = y;
      if (velocity > 1) direction = 1;
      else if (velocity < -1) direction = -1;

      const half = el!.scrollWidth / 2;
      x -= (0.55 + Math.abs(velocity) * 0.35) * direction * dt;
      if (x <= -half) x += half;
      if (x > 0) x -= half;

      el!.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0) skewX(${(-clamp(velocity * 0.35, -9, 9)).toFixed(2)}deg)`;
      frame = visible ? requestAnimationFrame(tick) : 0;
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    });
    observer.observe(host);
    frame = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  const row = items.map((item) => (
    <span key={item} className="flex items-center gap-x-6 pr-6 sm:gap-x-8 sm:pr-8">
      <span className="transition-colors duration-300 hover:text-foreground">{item}</span>
      <span aria-hidden className="text-border">/</span>
    </span>
  ));

  return (
    <div
      ref={root}
      className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]"
    >
      <div ref={track} className="stack-track text-[clamp(2rem,6vw,4.25rem)] font-medium leading-tight tracking-[-0.035em] text-muted-foreground">
        <div className="flex shrink-0" aria-label={items.join(", ")} role="img">
          {row}
        </div>
        <div className="flex shrink-0" aria-hidden>
          {row}
        </div>
      </div>
    </div>
  );
}
