"use client";

import { useRef, useState } from "react";
import { track } from "@/lib/analytics";

export function CopyEmailButton({ email }: { email: string }) {
  const [label, setLabel] = useState("Copy");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  async function copy() {
    track("contact_click", { location: "contact-copy" });
    try {
      await navigator.clipboard.writeText(email);
      setLabel("Copied");
    } catch {
      setLabel("Copy failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setLabel("Copy"), 1600);
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="press rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-[color,border-color] duration-200 hover:border-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {label}
      </button>
      <span role="status" className="sr-only">
        {label === "Copied" ? "Email copied" : ""}
      </span>
    </>
  );
}
