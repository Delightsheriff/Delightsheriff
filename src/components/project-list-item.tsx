import { TrackedLink } from "@/components/tracked-link";
import { categoryLabel } from "@/lib/project-categories";

type ProjectListItemProps = {
  name: string;
  category: string;
  description: string;
  impact?: string;
  tags: string[];
  links: { source?: string; live?: string; download?: string; appStore?: string; playStore?: string };
};

const LINK_LABELS: [keyof ProjectListItemProps["links"], string][] = [
  ["live", "Live"],
  ["appStore", "App Store"],
  ["playStore", "Play Store"],
  ["download", "Download"],
  ["source", "Source"],
];

// Projects that aren't featured get a quiet row with direct links instead of a case study.
export function ProjectListItem({ name, category, description, impact, tags, links }: ProjectListItemProps) {
  const destinations = LINK_LABELS.filter(([key]) => links[key]);

  return (
    <li className="grid gap-x-8 gap-y-1 border-t border-border py-5 last:border-b sm:grid-cols-[minmax(0,1fr)_auto]">
      <div className="min-w-0">
        <h3 className="flex flex-wrap items-baseline gap-x-3 text-base font-medium leading-snug tracking-[-0.01em]">
          {name}
          <span className="font-mono text-xs font-normal text-muted-foreground">{categoryLabel(category)}</span>
        </h3>
        <p className="mb-1.5 mt-0.5 max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground [text-wrap:pretty]">
          {description}
          {impact && <span className="text-foreground"> {impact}.</span>}
        </p>
        <p className="font-mono text-xs leading-relaxed text-muted-foreground">{tags.join(", ")}</p>
      </div>

      {destinations.length > 0 && (
        <div className="flex gap-4 pt-0.5 text-[13px] text-muted-foreground sm:self-start">
          {destinations.map(([key, label]) => (
            <TrackedLink
              key={key}
              href={links[key]!}
              external
              eventName="project_destination_click"
              data={{ project: name, destination: label, location: "project-list" }}
              className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {label}
              <span aria-hidden> ↗</span>
              <span className="sr-only"> for {name} (opens in a new tab)</span>
            </TrackedLink>
          ))}
        </div>
      )}
    </li>
  );
}
