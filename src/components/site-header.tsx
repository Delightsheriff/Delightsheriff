"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { TrackedLink } from "@/components/tracked-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  name?: string;
  resumeUrl?: string;
  // The Blog link is hidden until there's at least one post to read.
  showBlog?: boolean;
};

const SECTIONS = [
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

const LINK =
  "relative z-10 rounded-full px-2.5 py-1 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function SiteHeader({ name, resumeUrl, showBlog }: SiteHeaderProps) {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const nav = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);

  // Highlight the section in view. Only meaningful on the home page.
  useEffect(() => {
    if (pathname !== "/") return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [pathname]);

  const current = pathname === "/" ? active : null;
  const target = hovered ?? current;

  // One pill slides to whichever link is hovered, or rests on the section in view.
  useEffect(() => {
    const container = nav.current;
    const el = pill.current;
    if (!container || !el) return;

    const link = target ? container.querySelector<HTMLElement>(`[data-nav="${target}"]`) : null;
    if (!link || link.offsetParent === null) {
      el.style.opacity = "0";
      return;
    }

    const box = container.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    if (!placed.current) {
      // First appearance: drop into place without sliding in from the corner.
      el.style.transition = "opacity 200ms ease";
      placed.current = true;
    } else {
      el.style.transition = "";
    }
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
    el.style.transform = `translate(${rect.left - box.left}px, ${rect.top - box.top}px)`;
    el.style.opacity = "1";
  }, [target]);

  function linkProps(id: string) {
    return {
      "data-nav": id,
      onPointerEnter: () => setHovered(id),
      onPointerLeave: () => setHovered(null),
      onFocus: () => setHovered(id),
      onBlur: () => setHovered(null),
    };
  }

  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40">
      <nav aria-label="Primary navigation" className="mx-auto flex h-14 w-full max-w-[960px] items-center justify-between gap-4 px-6">
        <TrackedLink
          href="/"
          eventName="navigation_click"
          data={{ href: "/", location: "header" }}
          className="rounded-sm text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {name ?? "Delight Sheriff"}
        </TrackedLink>

        <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
          <div ref={nav} className="relative flex items-center">
            <span
              ref={pill}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 rounded-full bg-secondary opacity-0 transition-[transform,width,height,opacity] duration-300 ease-out-strong"
            />
            {SECTIONS.map((section) => (
              <span key={section.id} {...linkProps(section.id)} className="hidden sm:inline">
                <TrackedLink
                  href={`/#${section.id}`}
                  eventName="navigation_click"
                  data={{ href: `/#${section.id}`, location: "header" }}
                  className={cn(LINK, "inline-block", target === section.id && "text-foreground")}
                >
                  {section.label}
                </TrackedLink>
              </span>
            ))}
            {showBlog && (
              <TrackedLink
                href="/blog"
                eventName="navigation_click"
                data={{ href: "/blog", location: "header" }}
                className={cn(LINK, "hidden sm:inline-block hover:text-foreground")}
              >
                Blog
              </TrackedLink>
            )}
            {resumeUrl && (
              <TrackedLink
                href={resumeUrl}
                external
                eventName="resume_click"
                data={{ location: "header" }}
                className={cn(LINK, "hidden md:inline-block hover:text-foreground")}
              >
                Resume
              </TrackedLink>
            )}
          </div>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
