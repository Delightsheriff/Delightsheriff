"use client";

import { useEffect, useRef } from "react";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

// Words brighten one by one as the paragraph rises into the reading zone.
// Opacity only. Without JavaScript, or with reduced motion, the text stays fully visible.
export function ScrollReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const spans = Array.from(el.children) as HTMLElement[];
    let frame = 0;

    function update() {
      frame = 0;
      if (!el) return;
      const vh = window.innerHeight;
      const start = vh * 0.92;
      const end = vh * 0.5;
      const progress = clamp((start - el.getBoundingClientRect().top) / (start - end));
      spans.forEach((span, i) => {
        span.style.opacity = (0.2 + 0.8 * clamp(progress * spans.length * 1.15 - i)).toFixed(2);
      });
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i}>
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
