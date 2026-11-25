"use client";

import { useEffect, useRef } from "react";

// Counts up once when it scrolls into view. The final number is in the markup from the start.
export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        const startedAt = performance.now();
        const duration = 1400;

        function tick(now: number) {
          const t = Math.min(1, (now - startedAt) / duration);
          const eased = 1 - Math.pow(1 - t, 4);
          if (el) el.textContent = Math.round(value * eased).toLocaleString("en-US");
          if (t < 1) frame = requestAnimationFrame(tick);
        }
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString("en-US")}
    </span>
  );
}
