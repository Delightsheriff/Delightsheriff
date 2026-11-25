import Image from "next/image";
import { getSiteSettings } from "@/sanity/queries";
import { TrackedLink } from "@/components/tracked-link";
import { urlFor } from "@/sanity/image";
import { BlurWords } from "@/components/blur-words";

const DEFAULT_STATUS_NOTE = "Remote, worldwide. Liverpool fan";

export async function Hero() {
  const settings = await getSiteSettings();
  if (!settings) return null;

  const links: {
    label: string;
    href: string;
    event: string;
    data: Record<string, string>;
    external?: boolean;
  }[] = [
    { label: "Email", href: `mailto:${settings.email}`, event: "contact_click", data: { location: "hero-links" } },
    { label: "GitHub", href: settings.githubUrl, event: "social_click", data: { network: "github", location: "hero-links" }, external: true },
    { label: "LinkedIn", href: settings.linkedinUrl, event: "social_click", data: { network: "linkedin", location: "hero-links" }, external: true },
    ...(settings.resumeUrl
      ? [{ label: "Resume", href: settings.resumeUrl, event: "resume_click", data: { location: "hero-links" }, external: true }]
      : []),
  ];

  return (
    <section className="py-20 sm:py-28 md:py-36">
      <div className="grid gap-6 md:grid-cols-[168px_minmax(0,1fr)] md:gap-x-12">
        <div className="enter font-mono text-xs leading-relaxed text-muted-foreground md:pt-3">
          <p className="text-foreground">{settings.openToWorkLabel}</p>
          <p>{settings.statusNote || DEFAULT_STATUS_NOTE}</p>
        </div>

        <div className="min-w-0">
          {settings.showAvatar && settings.avatar && (
            <div className="enter mb-8 h-16 w-16 overflow-hidden rounded-full border border-border">
              <Image
                src={urlFor(settings.avatar.asset).width(128).height(128).fit("crop").url()}
                alt={settings.avatar.alt ?? settings.heroName ?? "Portrait"}
                width={64}
                height={64}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          )}

          <h1 className="max-w-[24ch] text-balance text-[clamp(1.7rem,3.8vw,2.55rem)] font-medium leading-[1.22] tracking-[-0.028em]">
            <BlurWords text={`${settings.heroName}.`} />{" "}
            <span className="text-muted-foreground">
              {/* Non-breaking hyphen so "Full-Stack" never splits across lines. */}
              <BlurWords
                text={`${settings.heroTitle.replace(/-/g, "\u2011")}. ${settings.tagline}`}
                start={settings.heroName.split(" ").length}
              />
            </span>
          </h1>

          <nav aria-label="Social links" className="enter enter-3 mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
            {links.map((link) => (
              <TrackedLink
                key={link.label}
                href={link.href}
                external={link.external}
                eventName={link.event}
                data={link.data}
                className="link-u focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-sm first:text-foreground text-muted-foreground hover:text-foreground"
              >
                {link.label}
              </TrackedLink>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
