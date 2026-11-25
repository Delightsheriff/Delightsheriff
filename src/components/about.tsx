import { Suspense } from "react";
import { getSiteSettings } from "@/sanity/queries";
import { getContributions } from "@/lib/github";
import { Section } from "@/components/section";
import { ScrollReveal } from "@/components/scroll-reveal";
import { CountUp } from "@/components/count-up";
import { Skills } from "@/components/skills";
import { TrackedLink } from "@/components/tracked-link";

async function ContributionLine({ githubUrl }: { githubUrl: string }) {
  const data = await getContributions();
  if (!data) return null;

  return (
    <p className="mt-2 text-sm text-muted-foreground">
      <CountUp value={data.totalContributions} /> contributions on{" "}
      <TrackedLink
        href={githubUrl}
        external
        eventName="social_click"
        data={{ network: "github", location: "contributions" }}
        className="link-u text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        GitHub
      </TrackedLink>{" "}
      in the last year.
    </p>
  );
}

export async function About() {
  const settings = await getSiteSettings();
  if (!settings) return null;

  return (
    <Section id="about" label="About">
      <div className="flex max-w-[58ch] flex-col gap-5">
        {settings.bio.map((paragraph, i) => (
          <ScrollReveal
            key={i}
            text={paragraph}
            className="text-[clamp(1.0625rem,1.6vw,1.1875rem)] leading-[1.65] [text-wrap:pretty]"
          />
        ))}
      </div>

      <Suspense fallback={null}>
        <ContributionLine githubUrl={settings.githubUrl} />
      </Suspense>

      <Skills groups={settings.skillGroups} />
    </Section>
  );
}
