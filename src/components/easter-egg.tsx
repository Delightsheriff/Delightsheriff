"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Type "ynwa" anywhere on the page. A small, quiet note, nothing more.
export function EasterEgg() {
  const [visible, setVisible] = useState(false);
  const buffer = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (target?.isContentEditable || event.metaKey || event.ctrlKey || event.altKey) return;

      buffer.current = (buffer.current + event.key.toLowerCase()).slice(-4);
      if (buffer.current === "ynwa") {
        buffer.current = "";
        setVisible(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setVisible(false), 2600);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <div
      role="status"
      className={cn(
        "pointer-events-none fixed bottom-[calc(24px+env(safe-area-inset-bottom,0px))] left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-[opacity,transform] duration-300 ease-out-strong",
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
      )}
    >
      {visible ? "You'll never walk alone." : ""}
    </div>
  );
}
