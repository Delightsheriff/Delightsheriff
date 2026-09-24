import { getSiteSettings } from "@/sanity/queries";
import { toRoman } from "@/lib/roman";
import { TrackedLink } from "@/components/tracked-link";

export async function Footer() {
  const settings = await getSiteSettings();
  if (!settings) return null;

  const year = toRoman(new Date().getFullYear());

  return (
    <footer className="flex flex-col gap-6 border-t border-border pt-10 pb-4">
      <p className="max-w-xl text-base leading-relaxed text-foreground/80">{settings.footerLine}</p>

      <TrackedLink
        href={`mailto:${settings.email}`}
        eventName="contact_click"
        data={{ location: "footer" }}
        className="glass pressable inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm text-muted-foreground transition-[transform,color,background-color,border-color] duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        Let&apos;s build something useful <span aria-hidden className="ml-2">↗</span>
      </TrackedLink>

      <nav aria-label="Footer links" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <TrackedLink href={`mailto:${settings.email}`} eventName="contact_click" data={{ location: "footer-links" }} className="text-muted-foreground transition-colors hover:text-foreground">
            Email
          </TrackedLink>
        <a href={settings.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
          GitHub
        </a>
        <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-foreground">
          LinkedIn
        </a>
        {settings.resumeUrl && (
          <TrackedLink href={settings.resumeUrl} external eventName="resume_click" data={{ location: "footer-links" }} className="text-muted-foreground transition-colors hover:text-foreground">
            Resume
          </TrackedLink>
        )}
      </nav>

      <p className="text-xs text-muted-foreground">© {year} · {settings.heroName}</p>
    </footer>
  );
}
