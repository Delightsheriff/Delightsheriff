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

  // Keep the page still behind the open menu.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
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

  const menuItems = [
    ...SECTIONS.map((section) => ({
      key: section.id,
      href: `/#${section.id}`,
      label: section.label,
      event: "navigation_click",
      data: { href: `/#${section.id}`, location: "mobile-menu" },
      external: false,
    })),
    ...(showBlog
      ? [{ key: "blog", href: "/blog", label: "Blog", event: "navigation_click", data: { href: "/blog", location: "mobile-menu" }, external: false }]
      : []),
    ...(resumeUrl
      ? [{ key: "resume", href: resumeUrl, label: "Resume", event: "resume_click", data: { location: "mobile-menu" }, external: true }]
      : []),
  ];

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
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setOpenedOn(menuOpen ? null : pathname)}
            className="press flex items-center gap-2 rounded-full border border-border py-1.5 pl-3 pr-3.5 text-[13px] font-medium text-foreground transition-colors duration-200 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:hidden"
          >
            <span aria-hidden className="relative block h-[9px] w-3.5">
              <span
                className={cn(
                  "absolute left-0 top-0 block h-px w-full bg-current transition-transform duration-300 ease-out-strong motion-reduce:transition-none",
                  menuOpen && "translate-y-1 rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-2 block h-px w-full bg-current transition-transform duration-300 ease-out-strong motion-reduce:transition-none",
                  menuOpen && "-translate-y-1 -rotate-45",
                )}
              />
            </span>
            <span aria-hidden className="grid">
              <span
                className={cn(
                  "[grid-area:1/1] transition-[opacity,transform] duration-200 ease-out-strong motion-reduce:transition-none",
                  menuOpen && "-translate-y-1 opacity-0",
                )}
              >
                Menu
              </span>
              <span
                className={cn(
                  "[grid-area:1/1] transition-[opacity,transform] duration-200 ease-out-strong motion-reduce:transition-none",
                  !menuOpen && "translate-y-1 opacity-0",
                )}
              >
                Close
              </span>
            </span>
          </button>
        </div>
      </nav>

      {/* Dims the page behind the menu. Tapping it closes the menu. */}
      <div
        aria-hidden
        onClick={closeMenu}
        className={cn(
          "fixed inset-x-0 bottom-0 top-[calc(3.5rem+env(safe-area-inset-top,0px))] bg-background/70 transition-opacity ease-out-strong motion-reduce:transition-none sm:hidden",
          menuOpen ? "opacity-100 duration-300" : "pointer-events-none opacity-0 duration-200",
        )}
      />

      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className={cn(
          "absolute inset-x-0 top-full grid border-b bg-background transition-[grid-template-rows,opacity,visibility,border-color] ease-out-strong motion-reduce:transition-none sm:hidden",
          menuOpen
            ? "visible grid-rows-[1fr] border-border opacity-100 duration-[380ms]"
            : "invisible grid-rows-[0fr] border-transparent opacity-0 duration-[240ms]",
        )}
      >
        <nav
          aria-label="Menu"
          className="mx-auto flex min-h-0 w-full max-w-[960px] flex-col overflow-hidden px-6"
          // Tapping any link, anywhere in its row, closes the menu.
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a")) closeMenu();
          }}
        >
          <div className="flex flex-col pb-8 pt-2">
            {menuItems.map((item, index) => (
              <div
                key={item.key}
                style={{ transitionDelay: menuOpen ? `${90 + index * 45}ms` : "0ms" }}
                className={cn(
                  "transition-[opacity,transform] ease-out-strong motion-reduce:transition-none",
                  menuOpen ? "translate-y-0 opacity-100 duration-[420ms]" : "translate-y-2 opacity-0 duration-150",
                )}
              >
                <TrackedLink
                  href={item.href}
                  external={item.external}
                  eventName={item.event}
                  data={item.data}
                  className={MENU_LINK}
                >
                  {item.label}
                  {item.external && (
                    <span aria-hidden className="text-base font-normal text-muted-foreground">
                      ↗
                    </span>
                  )}
                </TrackedLink>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
