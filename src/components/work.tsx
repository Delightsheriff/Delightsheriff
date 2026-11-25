import { getWorkEntries } from "@/sanity/queries";
import { currentMonth, formatDateRange, formatDuration, monthsBetween } from "@/lib/format";
import { Section } from "@/components/section";
import { EmptyState } from "@/components/empty-state";

export async function Work() {
  // Shown in the order set in Sanity, so the current main role can lead.
  const entries = await getWorkEntries();
  const now = currentMonth();

  return (
    <Section id="experience" label="Experience">
      {entries.length === 0 ? (
        <EmptyState title="Work history is unavailable" description="The experience timeline could not be loaded right now." />
      ) : (
        <div>
          {entries.map((entry) => {
            const end = entry.present ? now : entry.endDate ?? entry.startDate;
            return (
              <article
                key={`${entry.company}-${entry.startDate}`}
                className="reveal grid gap-x-8 gap-y-2 border-t border-border py-8 first:border-t-0 first:pt-0 sm:grid-cols-[150px_minmax(0,1fr)]"
              >
                <div className="font-mono text-xs leading-[1.8] text-muted-foreground tabular-nums sm:pt-1">
                  <p className="text-foreground/80">
                    {formatDateRange(entry.startDate, entry.present ? "Present" : entry.endDate ?? "")}
                  </p>
                  <p>{formatDuration(monthsBetween(entry.startDate, end))}</p>
                  {entry.location && <p>{entry.location}</p>}
                </div>

                <div className="min-w-0">
                  <h3 className="text-[17px] font-medium leading-snug tracking-[-0.015em]">
                    {entry.role} <span className="font-normal text-muted-foreground">at {entry.company}</span>
                  </h3>
                  <p className="mb-3 mt-2.5 max-w-[60ch] leading-relaxed text-muted-foreground [text-wrap:pretty]">{entry.bio}</p>
                  {entry.achievements && entry.achievements.length > 0 && (
                    <ul className="flex max-w-[60ch] flex-col gap-2 text-[15px] leading-relaxed">
                      {entry.achievements.map((achievement) => (
                        <li key={achievement} className="relative pl-[18px] before:absolute before:left-0 before:top-[0.8em] before:w-2 before:border-t before:border-muted-foreground">
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </Section>
  );
}
