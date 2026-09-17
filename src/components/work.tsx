import { getWorkEntries } from "@/sanity/queries";
import { formatDateRange } from "@/lib/format";

export async function Work() {
  const entries = await getWorkEntries();
  const sorted = [...entries].sort((a, b) => b.startDate.localeCompare(a.startDate));

  return (
    <section className="flex flex-col gap-8 border-t border-border pt-10">
      <h2 className="font-heading text-sm uppercase tracking-wide text-muted-foreground">Work</h2>

      <div className="flex flex-col gap-10">
        {sorted.map((entry) => (
          <div key={`${entry.company}-${entry.startDate}`} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="font-heading text-base font-medium">
                {entry.role} <span className="text-muted-foreground">— {entry.company}</span>
              </p>
                <p className="text-sm text-muted-foreground">
                  {formatDateRange(entry.startDate, entry.present ? "Present" : entry.endDate ?? "")}
                </p>
              </div>
              {entry.location && <p className="text-xs text-muted-foreground">{entry.location}</p>}
            <p className="max-w-xl text-base leading-relaxed text-foreground/80">{entry.bio}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
