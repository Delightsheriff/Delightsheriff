"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "@vercel/analytics";

type TrackedLinkProps = {
  href: string;
  eventName: string;
  data?: Record<string, string | number | boolean | null>;
  external?: boolean;
  // A mouse shortcut that duplicates a visible link: out of the tab order and the accessibility tree.
  decorative?: boolean;
  className?: string;
  children: ReactNode;
};

export function TrackedLink({
  href,
  eventName,
  data,
  external,
  decorative,
  className,
  children,
}: TrackedLinkProps) {
  const hidden = decorative ? ({ tabIndex: -1, "aria-hidden": true } as const) : {};
  function handleClick() {
    track(eventName, data);
  }

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={handleClick} {...hidden}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className} onClick={handleClick} {...hidden}>
      {children}
    </Link>
  );
}
