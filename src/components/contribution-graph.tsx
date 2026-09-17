import { getContributions } from "@/lib/github";
import { getSiteSettings } from "@/sanity/queries";
import { EmptyState } from "@/components/empty-state";

function levelFor(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

const LEVEL_CLASSES = [
  "bg-muted",
  "bg-primary/25",
  "bg-primary/50",
  "bg-primary/75",
  "bg-primary",
];

export async function ContributionGraph() {
  const data = await getContributions();
  const settings = await getSiteSettings();

  return (
    <section className="flex flex-col gap-4 border-t border-border pt-10">
      <div className="flex items-baseline justify-between">
        <h2 className="font-heading text-sm uppercase tracking-wide text-muted-foreground">
          Contributions
        </h2>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {data ? `${data.totalContributions.toLocaleString()} in the last year` : "Activity unavailable"}
          </p>
          {settings?.githubUrl && (
            <a
              href={settings.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
            >
              GitHub
            </a>
          )}
        </div>
      </div>

      {data ? <div className="contribution-scroll flex gap-[3px] overflow-x-auto pb-1" aria-label="GitHub contribution activity">
        {data.weeks.map((week, i) => (
          <div key={i} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <div
                key={day.date}
                role="img"
                aria-label={`${day.count} contributions on ${day.date}`}
                title={`${day.count} contributions on ${day.date}`}
                className={`h-[10px] w-[10px] rounded-[2px] outline outline-1 -outline-offset-1 outline-white/5 ${LEVEL_CLASSES[levelFor(day.count)]}`}
              />
            ))}
          </div>
        ))}
      </div> : <EmptyState title="GitHub activity is unavailable" description="Contribution activity will appear here when the GitHub connection is available." />}

      {data && <div className="flex items-center justify-end gap-2 text-[11px] text-muted-foreground">
        <span>Less</span>
        {LEVEL_CLASSES.map((level, index) => (
          <span key={level} aria-label={`${index} contributions`} className={`h-[10px] w-[10px] rounded-[2px] outline outline-1 -outline-offset-1 outline-white/5 ${level}`} />
        ))}
        <span>More</span>
      </div>}
    </section>
  );
}
