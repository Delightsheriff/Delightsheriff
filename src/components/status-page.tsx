import type { ReactNode } from "react";
import { BlurWords } from "@/components/blur-words";

type StatusPageProps = {
  // Small mono label in the gutter, e.g. "404".
  label: string;
  // The sentence that matters, in white.
  title: string;
  // The rest, in grey.
  description: string;
  actions?: ReactNode;
  // Optional small print under the actions, e.g. an error reference.
  note?: ReactNode;
};

// 404 and error pages share the home page's layout and type, so they feel like the same site.
export function StatusPage({ label, title, description, actions, note }: StatusPageProps) {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto flex w-full max-w-[960px] flex-1 flex-col justify-center px-6 py-28 md:py-40">
      <div className="grid gap-6 md:grid-cols-[168px_minmax(0,1fr)] md:gap-x-12">
        <p className="enter font-mono text-xs text-muted-foreground md:pt-3">{label}</p>

        <div className="min-w-0">
          <h1 className="max-w-[24ch] text-balance text-[clamp(1.7rem,3.8vw,2.55rem)] font-medium leading-[1.22] tracking-[-0.028em]">
            <BlurWords text={title} />{" "}
            <span className="text-muted-foreground">
              <BlurWords text={description} start={title.split(" ").length} />
            </span>
          </h1>

          {actions && <div className="enter enter-3 mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px]">{actions}</div>}
          {note && <p className="enter enter-3 mt-6 font-mono text-xs text-muted-foreground">{note}</p>}
        </div>
      </div>
    </main>
  );
}
