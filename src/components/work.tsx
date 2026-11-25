import { getWorkEntries } from "@/sanity/queries";
import { currentMonth, formatDateRange, formatDuration, monthsBetween } from "@/lib/format";
import { Section } from "@/components/section";
import { EmptyState } from "@/components/empty-state";
import { BlurWords } from "@/components/blur-words";

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
            const titleWords = `${entry.role} at ${entry.company}`.split(" ").length;
            const bioWords = entry.bio.split(" ").length;
            let offset = titleWords + bioWords;
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
                    <BlurWords text={entry.role} scroll />{" "}
                    <span className="font-normal text-muted-foreground">
                      <BlurWords text={`at ${entry.company}`} start={entry.role.split(" ").length} scroll />
                    </span>
                  </h3>
                  <p className="mb-3 mt-2.5 max-w-[60ch] leading-relaxed text-muted-foreground [text-wrap:pretty]">
                    <BlurWords text={entry.bio} start={titleWords} scroll />
                  </p>
                  {entry.achievements && entry.achievements.length > 0 && (
                    <ul className="flex max-w-[60ch] flex-col gap-2 text-[15px] leading-relaxed">
                      {entry.achievements.map((achievement) => {
                        const start = offset;
                        offset += achievement.split(" ").length;
                        return (
                          <li key={achievement} className="relative pl-[18px] before:absolute before:left-0 before:top-[0.8em] before:w-2 before:border-t before:border-muted-foreground">
                            <BlurWords text={achievement} start={start} scroll />
                          </li>
                        );
                      })}
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
