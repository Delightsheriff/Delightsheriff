import { TrackedLink } from "@/components/tracked-link";

type SiteHeaderProps = {
  name?: string;
  email?: string;
  resumeUrl?: string;
};

export function SiteHeader({ name, email, resumeUrl }: SiteHeaderProps) {
  return (
    <header className="site-header sticky top-0 z-10 border-b border-border/60 bg-background/70 backdrop-blur-lg backdrop-saturate-150 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-3"
      >
        <TrackedLink
          href="/"
          eventName="navigation_click"
          data={{ href: "/", location: "header" }}
          className="font-heading text-sm font-medium tracking-tight text-foreground/90 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {name ?? "Delight Sheriff"}
        </TrackedLink>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <TrackedLink
            href="/projects"
            eventName="navigation_click"
            data={{ href: "/projects", location: "header" }}
            className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Projects
          </TrackedLink>
          <TrackedLink
            href="/blog"
            eventName="navigation_click"
            data={{ href: "/blog", location: "header" }}
            className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Blog
          </TrackedLink>
          {email && (
            <TrackedLink
              href={`mailto:${email}`}
              eventName="contact_click"
              data={{ location: "header" }}
              className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Contact
            </TrackedLink>
          )}
          {resumeUrl && (
            <TrackedLink
              href={resumeUrl}
              external
              eventName="resume_click"
              data={{ location: "header" }}
              className="hidden transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline"
            >
              Resume
            </TrackedLink>
          )}
        </div>
      </nav>
    </header>
  );
}
