"use client";

import { useEffect, useState } from "react";
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
  "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

export function SiteHeader({ name, resumeUrl, showBlog }: SiteHeaderProps) {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);

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

  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-40">
      <nav aria-label="Primary navigation" className="mx-auto flex h-14 w-full max-w-[960px] items-center justify-between gap-4 px-6">
        <TrackedLink
          href="/"
          eventName="navigation_click"
          data={{ href: "/", location: "header" }}
          className={cn("text-sm font-medium text-foreground", LINK)}
        >
          {name ?? "Delight Sheriff"}
        </TrackedLink>

        <div className="flex items-center gap-5 text-[13px] text-muted-foreground">
          {SECTIONS.map((section) => (
            <TrackedLink
              key={section.id}
              href={`/#${section.id}`}
              eventName="navigation_click"
              data={{ href: `/#${section.id}`, location: "header" }}
              className={cn("hidden sm:inline hover:text-foreground", LINK, current === section.id && "text-foreground")}
            >
              {section.label}
            </TrackedLink>
          ))}
          {showBlog && (
            <TrackedLink
              href="/blog"
              eventName="navigation_click"
              data={{ href: "/blog", location: "header" }}
              className={cn("hidden sm:inline hover:text-foreground", LINK)}
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
              className={cn("hidden md:inline hover:text-foreground", LINK)}
            >
              Resume
            </TrackedLink>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
