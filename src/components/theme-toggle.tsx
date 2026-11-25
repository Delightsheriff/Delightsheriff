"use client";

import { useSyncExternalStore } from "react";
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

export function ThemeToggle() {
  // Midnight is the default, so that is what the server renders.
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);

  function choose(next: Theme) {
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode or blocked storage: the choice just won't persist.
    }
  }

  return (
    <div role="group" aria-label="Theme" className="flex gap-0.5 rounded-full border border-border p-0.5 text-xs">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={theme === option.value}
          onClick={() => choose(option.value)}
          className={cn(
            "rounded-full px-2.5 py-1 transition-[background-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            theme === option.value ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
