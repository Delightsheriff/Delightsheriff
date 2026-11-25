import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  label: string;
  meta?: string;
  children: ReactNode;
  className?: string;
};

// Every section shares one layout: a narrow label gutter on the left (sticky on wide
// screens) and the content on the right. Keeping this in one place keeps the page rhythm.
export function Section({ id, label, meta, children, className }: SectionProps) {
  return (
    <section id={id} className={cn("border-t border-border py-16 sm:py-24", className)}>
      <div className="grid gap-5 md:grid-cols-[168px_minmax(0,1fr)] md:gap-x-12">
        <h2 className="text-[1.75rem] font-semibold leading-none tracking-[-0.035em] text-foreground md:sticky md:top-20 md:self-start md:pt-1.5 md:font-mono md:text-xs md:font-normal md:leading-snug md:tracking-normal md:text-muted-foreground">
          {label}
          {meta && (
            <span className="mt-2 block font-mono text-xs font-normal leading-snug tracking-normal text-muted-foreground md:mt-1">
              {meta}
            </span>
          )}
        </h2>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
