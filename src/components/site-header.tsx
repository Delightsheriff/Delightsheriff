import Link from "next/link";

type SiteHeaderProps = {
  name?: string;
  email?: string;
  resumeUrl?: string;
};

export function SiteHeader({ name, email, resumeUrl }: SiteHeaderProps) {
  return (
    <header className="site-header sticky top-0 z-10 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-3"
      >
        <Link
          href="/"
          className="font-heading text-sm font-medium tracking-tight text-foreground/90 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {name ?? "Delight Sheriff"}
        </Link>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Link
            href="/projects"
            className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Projects
          </Link>
          {email && (
            <a
              href={`mailto:${email}`}
              className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Contact
            </a>
          )}
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline"
            >
              Resume
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}
