import { NowPlaying } from "@/components/now-playing";
import { getSiteSettings } from "@/sanity/queries";

export async function Hero() {
  const settings = await getSiteSettings();
  if (!settings) return null;

  return (
    <section className="flex flex-col gap-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {settings.openToWorkLabel}
      </p>

      <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
        {settings.heroName}
      </h1>

      <p className="text-lg text-muted-foreground">{settings.heroTitle}</p>

      <p className="max-w-xl text-base leading-relaxed text-foreground/80">{settings.tagline}</p>

      <nav className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <a
          href={`mailto:${settings.email}`}
          className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
        >
          Email
        </a>
        <a
          href={settings.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
        >
          GitHub
        </a>
        <a
          href={settings.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
        >
          LinkedIn
        </a>
      </nav>

      <NowPlaying />
    </section>
  );
}
