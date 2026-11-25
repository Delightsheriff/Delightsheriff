import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { TrackedLink } from "@/components/tracked-link";
import { Spotlight } from "@/components/spotlight";
import { Tilt } from "@/components/tilt";
import { categoryLabel } from "@/lib/project-categories";

type Links = { source?: string; live?: string; download?: string; appStore?: string; playStore?: string };

type ProjectListItemProps = {
  name: string;
  category: string;
  description: string;
  impact?: string;
  tags: string[];
  links: Links;
  // The case study. Clicking anywhere on the row opens it.
  href: string;
  thumbnail?: { asset: Parameters<typeof urlFor>[0]; alt?: string };
};

const LINK_LABELS: [keyof Links, string][] = [
  ["live", "Live"],
  ["appStore", "App Store"],
  ["playStore", "Play Store"],
  ["download", "Download"],
  ["source", "Source"],
];

// A compact row: a glimpse of the work on the left, the story on the right. The title link
// stretches over the whole row with ::after, so the row opens the case study, while the
// destination links sit on top of it as their own links (links can't nest).
export function ProjectListItem({ name, category, description, impact, tags, links, href, thumbnail }: ProjectListItemProps) {
  const destinations = LINK_LABELS.filter(([key]) => links[key]);

  return (
    <li className="reveal spotlight-host zoom-host nudge-host group relative grid gap-x-6 gap-y-4 border-t border-border py-6 last:border-b has-[.row-link:focus-visible]:rounded-lg has-[.row-link:focus-visible]:ring-2 has-[.row-link:focus-visible]:ring-ring has-[.row-link:focus-visible]:ring-offset-4 has-[.row-link:focus-visible]:ring-offset-background sm:grid-cols-[200px_minmax(0,1fr)] md:gap-x-8">
      <Tilt className="self-start" max={4} lift={0.01}>
      <Spotlight className="glow-card aspect-[16/10] overflow-hidden rounded-lg border border-border bg-card">
        {thumbnail ? (
          <Image
            src={urlFor(thumbnail.asset).width(640).height(400).fit("crop").url()}
            alt={thumbnail.alt ?? `${name} preview`}
            width={320}
            height={200}
            sizes="(min-width: 640px) 200px, 100vw"
            className="zoom-target h-full w-full object-cover transition-transform duration-500 ease-out-strong"
          />
        ) : (
          <div className="flex h-full w-full items-end p-3 text-xs text-muted-foreground">{name}</div>
        )}
      </Spotlight>
      </Tilt>

      <div className="min-w-0">
        <h3 className="flex flex-wrap items-baseline gap-x-2 text-base font-medium leading-snug tracking-[-0.01em]">
          <TrackedLink
            href={href}
            eventName="project_open"
            data={{ project: name, destination: "detail", location: "project-list" }}
            className="row-link after:absolute after:inset-0 focus-visible:outline-none"
          >
            {name}
          </TrackedLink>
          <span aria-hidden className="nudge-target font-normal text-muted-foreground transition-[transform,color] duration-200 ease-out-strong">
            ↗
          </span>
          <span className="ml-1 font-mono text-xs font-normal text-muted-foreground">{categoryLabel(category)}</span>
        </h3>
        <p className="mb-2 mt-1 max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground [text-wrap:pretty]">
          {description}
          {impact && <span className="text-foreground"> {impact}.</span>}
        </p>
        <p className="font-mono text-xs leading-relaxed text-muted-foreground">{tags.join(", ")}</p>
        {destinations.length > 0 && (
          <div className="relative z-10 mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted-foreground">
            {destinations.map(([key, label]) => (
              <TrackedLink
                key={key}
                href={links[key]!}
                external
                eventName="project_destination_click"
                data={{ project: name, destination: label, location: "project-list" }}
                className="rounded-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {label}
                <span aria-hidden> ↗</span>
                <span className="sr-only"> for {name} (opens in a new tab)</span>
              </TrackedLink>
            ))}
          </div>
        )}
      </div>
    </li>
  );
}
