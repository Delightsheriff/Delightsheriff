"use client";

import { useSyncExternalStore, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

const OPTIONS: { value: Theme; label: string }[] = [
  { value: "dark", label: "Midnight" },
  { value: "light", label: "Paper" },
];

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void> };
};

export function ThemeToggle() {
  // Midnight is the default, so that is what the server renders.
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);

  function choose(next: Theme, event: MouseEvent<HTMLButtonElement>) {
    if (next === theme) return;

    const apply = () => document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode or blocked storage: the choice just won't persist.
    }

    const doc = document as ViewTransitionDocument;
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }

    // The new theme grows out of the button as a circle that fills the screen.
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    doc
      .startViewTransition(apply)
      .ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 700, easing: "cubic-bezier(0.23, 1, 0.32, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
  }

  return (
    <div role="group" aria-label="Theme" className="relative grid grid-cols-2 rounded-full border border-border p-0.5 text-xs">
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-secondary transition-transform duration-300 ease-out-strong",
          theme === "light" && "translate-x-full",
        )}
      />
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={theme === option.value}
          onClick={(event) => choose(option.value, event)}
          className={cn(
            "press relative z-10 rounded-full px-2.5 py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            theme === option.value ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
