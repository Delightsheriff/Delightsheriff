import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { NowPlaying } from "@/components/now-playing";
import { getSiteSettings } from "@/sanity/queries";
import { TrackedLink } from "@/components/tracked-link";
import { urlFor } from "@/sanity/image";

export async function Hero() {
  const settings = await getSiteSettings();
  if (!settings) return null;

  return (
    <section className="hero-shell flex flex-col gap-5">
      {settings.showAvatar && settings.avatar && (
        <div className="avatar-duotone h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border">
          <Image
            src={urlFor(settings.avatar.asset).width(128).height(128).fit("crop").url()}
            alt={settings.avatar.alt ?? settings.heroName ?? "Portrait"}
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {settings.openToWorkLabel}
      </p>

      <h1 className="max-w-2xl font-heading text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
        {settings.heroName}
      </h1>

      <p className="max-w-lg text-lg text-muted-foreground">{settings.heroTitle}</p>

      <p className="max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg">{settings.tagline}</p>

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Link
          href="#projects"
          className="glass-tint pressable inline-flex items-center rounded-full border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[0_8px_24px_-12px_var(--primary)] transition-[transform,background-color] duration-150 ease-out hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          View selected work <span aria-hidden className="ml-2">↘</span>
        </Link>
        <TrackedLink
          href={`mailto:${settings.email}`}
          eventName="contact_click"
          data={{ location: "hero" }}
          className="glass pressable inline-flex items-center rounded-full border px-4 py-2 text-sm text-muted-foreground transition-[transform,color,background-color,border-color] duration-150 ease-out hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          Start a conversation
        </TrackedLink>
      </div>

      <nav aria-label="Social links" className="mt-1 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <TrackedLink
            href={`mailto:${settings.email}`}
            eventName="contact_click"
            data={{ location: "hero-links" }}
            className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
          >
            Email
          </TrackedLink>
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
        {settings.resumeUrl && (
          <TrackedLink
            href={settings.resumeUrl}
            external
            eventName="resume_click"
            data={{ location: "hero-links" }}
            className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
          >
            Resume
          </TrackedLink>
        )}
      </nav>

      <Suspense fallback={null}>
        <NowPlaying />
      </Suspense>
    </section>
  );
}
