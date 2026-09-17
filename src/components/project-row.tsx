type ProjectRowProps = {
  index: number;
  name: string;
  description: string;
  role?: string;
  impact?: string;
  tags: string[];
  href: string;
  external?: boolean;
};

export function ProjectRow({ index, name, description, role, impact, tags, href, external }: ProjectRowProps) {
  const content = (
    <>
      <span className="font-heading text-sm text-muted-foreground/90 tabular-nums">
        {String(index).padStart(2, "0")}
      </span>

      <div className="flex flex-1 flex-col gap-1.5">
        <p className="font-heading text-lg font-medium text-foreground/90 transition-colors group-hover:text-foreground">
          {name}
        </p>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
          {role && <span>{role}</span>}
          {role && tags.length > 0 && <span aria-hidden>·</span>}
          <span>{tags.join(" · ")}</span>
        </div>
        {impact && <p className="mt-1 text-xs text-foreground/70">{impact}</p>}
      </div>

      <span
        aria-hidden
        className="project-arrow mt-1 shrink-0 text-muted-foreground transition-[color,opacity,transform] duration-150 ease-out group-hover:text-foreground group-hover:opacity-100"
      >
        →
      </span>
    </>
  );

  const className =
    "group flex items-start gap-4 border-t border-border py-6 first:border-t-0 first:pt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:gap-6";

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
import Link from "next/link";
