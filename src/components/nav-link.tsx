import Link from "next/link";
import type { ReactNode } from "react";

type NavLinkProps = {
  href: string;
  direction: "back" | "forward";
  children: ReactNode;
};

export function NavLink({ href, direction, children }: NavLinkProps) {
  const arrow = (
    <span
      aria-hidden
      className={`text-sm font-semibold transition-transform ${
        direction === "back" ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"
      }`}
    >
      {direction === "back" ? "←" : "→"}
    </span>
  );

  return (
    <Link
      href={href}
      className="group inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      {direction === "back" && arrow}
      <span className="underline decoration-border underline-offset-4 group-hover:decoration-foreground">
        {children}
      </span>
      {direction === "forward" && arrow}
    </Link>
  );
}
