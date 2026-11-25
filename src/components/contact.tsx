import { Suspense } from "react";
import { getSiteSettings } from "@/sanity/queries";
import { toRoman } from "@/lib/roman";
import { Section } from "@/components/section";
import { TrackedLink } from "@/components/tracked-link";
import { DecryptedText } from "@/components/decrypted-text";
import { CopyEmailButton } from "@/components/copy-email-button";
import { NowPlaying } from "@/components/now-playing";
import { Magnet } from "@/components/magnet";

const LINK =
  "link-u text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background rounded-sm";

export async function Contact() {
  const settings = await getSiteSettings();
  if (!settings) return null;

  const year = toRoman(new Date().getFullYear());

  return (
    <>
      <Section id="contact" label="Contact">
        <p className="mb-5 max-w-[46ch] text-[clamp(1.0625rem,1.6vw,1.1875rem)] leading-[1.65] [text-wrap:pretty]">
          {settings.footerLine} Happy to talk football as well as code.
        </p>

        <div className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Magnet pull={0.18}>
          <TrackedLink
            href={`mailto:${settings.email}`}
            eventName="contact_click"
            data={{ location: "contact" }}
            className="break-all rounded-sm text-[clamp(1.5rem,4vw,2.4rem)] font-medium leading-tight tracking-[-0.03em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            <DecryptedText text={settings.email} />
          </TrackedLink>
          </Magnet>
          <Magnet pull={0.35} range={60}>
            <CopyEmailButton email={settings.email} />
          </Magnet>
        </div>

        <nav aria-label="Contact links" className="flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
          <TrackedLink href={settings.githubUrl} external eventName="social_click" data={{ network: "github", location: "contact" }} className={LINK}>
            GitHub
          </TrackedLink>
          <TrackedLink href={settings.linkedinUrl} external eventName="social_click" data={{ network: "linkedin", location: "contact" }} className={LINK}>
            LinkedIn
          </TrackedLink>
          {settings.resumeUrl && (
            <TrackedLink href={settings.resumeUrl} external eventName="resume_click" data={{ location: "contact" }} className={LINK}>
              Resume
            </TrackedLink>
          )}
        </nav>

        <div className="mt-14 text-[13px]">
          <Suspense fallback={null}>
            <NowPlaying />
          </Suspense>
        </div>
      </Section>

      <footer className="flex flex-wrap justify-between gap-3 border-t border-border py-6 font-mono text-xs text-muted-foreground">
        <span>
          © {year} {settings.heroName}
        </span>
      </footer>
    </>
  );
}
