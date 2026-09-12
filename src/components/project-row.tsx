type ProjectRowProps = {
  index: number;
  name: string;
  description: string;
  tags: string[];
  href: string;
  external?: boolean;
};

export function ProjectRow({ index, name, description, tags, href, external }: ProjectRowProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-start gap-4 border-t border-border py-6 first:border-t-0 first:pt-4 sm:gap-6"
    >
      <span className="font-heading text-sm text-muted-foreground/90 tabular-nums">
        {String(index).padStart(2, "0")}
      </span>

      <div className="flex flex-1 flex-col gap-1.5">
        <p className="font-heading text-lg font-medium text-foreground/90 transition-colors group-hover:text-foreground">
          {name}
        </p>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
        <p className="mt-1 text-xs text-muted-foreground">{tags.join(" · ")}</p>
      </div>

      <span
        aria-hidden
        className="mt-1 shrink-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:text-foreground group-hover:opacity-100"
      >
        →
      </span>
    </a>
  );
}
