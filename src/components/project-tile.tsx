import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { TrackedLink } from "@/components/tracked-link";
import { Spotlight } from "@/components/spotlight";
import { Tilt } from "@/components/tilt";

type ProjectTileProps = {
  name: string;
  description: string;
  role?: string;
  tags: string[];
  thumbnail?: { asset: Parameters<typeof urlFor>[0]; alt?: string };
  hasDemo?: boolean;
  href: string;
  liveUrl?: string;
  priority?: boolean;
};

// The tile link stretches over the whole card with ::after, so the card stays one big
// target while the live-site link can sit on top of it as its own link (links can't nest).
export function ProjectTile({ name, description, role, tags, thumbnail, hasDemo, href, liveUrl, priority }: ProjectTileProps) {
  return (
    <article className="reveal spotlight-host zoom-host nudge-host group relative flex flex-col has-[.tile-link:focus-visible]:rounded-xl has-[.tile-link:focus-visible]:ring-2 has-[.tile-link:focus-visible]:ring-ring has-[.tile-link:focus-visible]:ring-offset-8 has-[.tile-link:focus-visible]:ring-offset-background">
      <Tilt className="mb-4">
        <Spotlight className="glow-card aspect-[16/10] overflow-hidden rounded-xl border border-border bg-card">
        {thumbnail ? (
          <Image
            src={urlFor(thumbnail.asset).width(1200).height(750).fit("crop").url()}
            alt={thumbnail.alt ?? `${name} preview`}
            width={600}
            height={375}
            sizes="(min-width: 768px) 396px, 100vw"
            priority={priority}
            className="zoom-target h-full w-full object-cover transition-transform duration-500 ease-out-strong"
          />
        ) : (
          <div className="flex h-full w-full items-end p-5 text-sm text-muted-foreground">{name}</div>
        )}
        </Spotlight>
      </Tilt>

      <h3 className="flex items-center gap-1.5 text-[17px] font-medium leading-snug tracking-[-0.015em]">
        <TrackedLink
          href={href}
          eventName="project_open"
          data={{ project: name, destination: "detail" }}
          className="tile-link after:absolute after:inset-0 focus-visible:outline-none"
        >
          {name}
        </TrackedLink>
        <span aria-hidden className="nudge-target font-normal text-muted-foreground transition-[transform,color] duration-200 ease-out-strong">
          ↗
        </span>
        {hasDemo && (
          <span className="ml-1 rounded-full border border-border px-2 py-0.5 text-[11px] font-normal leading-none text-muted-foreground">
            Demo
          </span>
        )}
      </h3>

      <p className="mb-2.5 mt-1.5 line-clamp-3 text-[15px] leading-relaxed text-muted-foreground [text-wrap:pretty]">
        {description}
      </p>

      <p className="font-mono text-xs leading-relaxed text-muted-foreground">
        {[role, tags.join(", ")].filter(Boolean).join(" / ")}
      </p>

      {liveUrl && (
        <TrackedLink
          href={liveUrl}
          external
          eventName="project_destination_click"
          data={{ project: name, destination: "Live", location: "project-tile" }}
          className="link-u relative z-10 mt-2 w-fit text-[13px] text-foreground/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          Visit site<span aria-hidden> ↗</span>
          <span className="sr-only"> for {name} (opens in a new tab)</span>
        </TrackedLink>
      )}
    </article>
  );
}
