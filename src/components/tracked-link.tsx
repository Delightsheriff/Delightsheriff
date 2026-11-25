"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "@vercel/analytics";

type TrackedLinkProps = {
  href: string;
  eventName: string;
  data?: Record<string, string | number | boolean | null>;
  external?: boolean;
  className?: string;
  children: ReactNode;
};

export function TrackedLink({
  href,
  eventName,
  data,
  external,
  className,
  children,
}: TrackedLinkProps) {
  function handleClick() {
    track(eventName, data);
  }

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={handleClick}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
