"use client";

import { useEffect, useRef } from "react";

const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

// On hover the text scrambles for a moment and settles back, left to right.
// The real text is always the markup, so screen readers and copy and paste are unaffected.
export function DecryptedText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const running = useRef(false);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function run() {
    const el = ref.current;
    if (!el || running.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    running.current = true;
    const startedAt = performance.now();
    const duration = 650;

    function tick(now: number) {
      if (!el) return;
      const t = Math.min(1, (now - startedAt) / duration);
      const settled = Math.floor(t * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        out += i < settled || !/[a-z0-9]/i.test(ch) ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      el.textContent = out;
      if (t < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        el.textContent = text;
        running.current = false;
      }
    }
    frame.current = requestAnimationFrame(tick);
  }

  return (
    <span ref={ref} className={className} onPointerEnter={run}>
      {text}
    </span>
  );
}
