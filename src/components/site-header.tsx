"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { TrackedLink } from "@/components/tracked-link";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  name?: string;
  resumeUrl?: string;
  // The Blog link is hidden until there's at least one published post to read.
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

const MENU_LINK =
  "flex items-baseline justify-between border-b border-border py-4 text-[1.75rem] font-semibold leading-none tracking-[-0.035em] text-foreground transition-colors duration-200 hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function SiteHeader({ name, resumeUrl, showBlog }: SiteHeaderProps) {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  // The menu remembers the page it was opened on, so moving to another page closes it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const nav = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const placed = useRef(false);

  const menuOpen = openedOn === pathname;
  const closeMenu = () => setOpenedOn(null);

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

  // Escape closes the menu and hands focus back to the button.
  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpenedOn(null);
      menuButton.current?.focus();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

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
          <div ref={nav} className="relative hidden items-center sm:flex">
            <span
              ref={pill}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 rounded-full bg-secondary opacity-0 transition-[transform,width,height,opacity] duration-300 ease-out-strong"
            />
            {SECTIONS.map((section) => (
              <span key={section.id} {...linkProps(section.id)}>
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
                className={cn(LINK, "inline-block hover:text-foreground", pathname.startsWith("/blog") && "text-foreground")}
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

          <button
            ref={menuButton}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setOpenedOn(menuOpen ? null : pathname)}
            className="press rounded-full border border-border px-3.5 py-1.5 text-[13px] font-medium text-foreground transition-colors duration-200 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:hidden"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div id="mobile-menu" className="enter absolute inset-x-0 top-full border-b border-border bg-background sm:hidden">
          <nav
            aria-label="Menu"
            className="mx-auto flex max-w-[960px] flex-col px-6 pb-8 pt-2"
            // Tapping any link, anywhere in its row, closes the menu.
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("a")) closeMenu();
            }}
          >
            {SECTIONS.map((section) => (
              <TrackedLink
                key={section.id}
                href={`/#${section.id}`}
                eventName="navigation_click"
                data={{ href: `/#${section.id}`, location: "mobile-menu" }}
                className={MENU_LINK}
              >
                {section.label}
              </TrackedLink>
            ))}
            {showBlog && (
              <TrackedLink
                href="/blog"
                eventName="navigation_click"
                data={{ href: "/blog", location: "mobile-menu" }}
                className={MENU_LINK}
              >
                Blog
              </TrackedLink>
            )}
            {resumeUrl && (
              <TrackedLink
                href={resumeUrl}
                external
                eventName="resume_click"
                data={{ location: "mobile-menu" }}
                className={MENU_LINK}
              >
                Resume
                <span aria-hidden className="text-base font-normal text-muted-foreground">
                  ↗
                </span>
              </TrackedLink>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
