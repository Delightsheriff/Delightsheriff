import { getContributions } from "@/lib/github";

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

  // No token configured, or the request failed — skip the section rather
  // than show broken/fake data.
  if (!data) return null;

  return (
    <section className="flex flex-col gap-4 border-t border-border pt-10">
      <div className="flex items-baseline justify-between">
        <h2 className="font-heading text-sm uppercase tracking-wide text-muted-foreground">
          Contributions
        </h2>
        <p className="text-sm text-muted-foreground">
          {data.totalContributions.toLocaleString()} in the last year
        </p>
      </div>

      <div className="flex gap-[3px] overflow-x-auto pb-1">
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
      </div>
    </section>
  );
}
