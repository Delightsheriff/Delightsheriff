import Image from "next/image";
import { Play } from "lucide-react";
import { urlFor } from "@/sanity/image";
import { TrackedLink } from "@/components/tracked-link";

type ProjectRowProps = {
  index: number;
  name: string;
  description: string;
  role?: string;
  impact?: string;
  thumbnail?: { asset: Parameters<typeof urlFor>[0]; alt?: string };
  tags: string[];
  href: string;
  external?: boolean;
  hasDemo?: boolean;
  liveUrl?: string;
};

// The project link stretches over the whole row with ::after, so the row stays one big
// target while the live-site link can sit on top of it as its own link (links can't nest).
export function ProjectRow({ index, name, description, role, impact, thumbnail, tags, href, external, hasDemo, liveUrl }: ProjectRowProps) {
  return (
    <div className="group relative flex items-start gap-4 border-t border-border py-6 px-3 -mx-3 rounded-lg transition-colors duration-150 ease-out active:bg-foreground/[0.04] first:border-t-0 first:pt-4 has-[.project-link:focus-visible]:ring-2 has-[.project-link:focus-visible]:ring-ring has-[.project-link:focus-visible]:ring-offset-4 has-[.project-link:focus-visible]:ring-offset-background sm:gap-6">
      <span className="font-heading text-sm text-muted-foreground/90 tabular-nums">
        {String(index).padStart(2, "0")}
      </span>

      <div className="flex flex-1 flex-col gap-1.5">
        <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-heading text-lg font-medium text-foreground/90 transition-colors group-hover:text-foreground">
          <TrackedLink
            href={href}
            external={external}
            eventName="project_open"
            data={{ project: name, destination: external ? "external" : "detail" }}
            className="project-link after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none"
          >
            {name}
          </TrackedLink>
          {hasDemo && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 font-sans text-[0.6875rem] font-medium leading-none text-muted-foreground">
              <Play aria-hidden className="size-2.5" fill="currentColor" />
              Demo
            </span>
          )}
        </p>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {role && <span>{role}</span>}
          {role && tags.length > 0 && <span aria-hidden>·</span>}
          <span>{tags.join(" · ")}</span>
        </div>
        {impact && <p className="mt-1 text-xs text-foreground/70">{impact}</p>}
        {liveUrl && (
          <TrackedLink
            href={liveUrl}
            external
            eventName="project_destination_click"
            data={{ project: name, destination: "Live", location: "project-row" }}
            className="relative z-10 mt-0.5 w-fit text-xs text-foreground/80 underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Visit site<span aria-hidden> ↗</span>
            <span className="sr-only"> for {name} (opens in a new tab)</span>
          </TrackedLink>
        )}
      </div>

      {thumbnail && (
        <Image
          src={urlFor(thumbnail.asset).width(240).height(150).fit("crop").url()}
          alt={thumbnail.alt ?? `${name} preview`}
          width={120}
          height={75}
          className="project-thumbnail hidden rounded-md object-cover outline outline-1 -outline-offset-1 outline-white/10 sm:block"
        />
      )}

      <span
        aria-hidden
        className="project-arrow mt-1 shrink-0 text-muted-foreground transition-[color,opacity,transform] duration-150 ease-out group-hover:text-foreground group-hover:opacity-100"
      >
        →
      </span>
    </div>
  );
}
