"use client";

import type { MouseEvent } from "react";

export function SkipLink() {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    const main = document.getElementById("main-content");
    if (!main) return;

    main.focus();
    window.history.replaceState(null, "", "#main-content");
  }

  return (
    <a href="#main-content" className="skip-link" onClick={handleClick}>
      Skip to content
    </a>
  );
}
