import { getSiteSettings } from "@/sanity/queries";

export async function Skills() {
  const settings = await getSiteSettings();
  if (!settings) return null;

  return (
    <section className="flex flex-col border-t border-border pt-10">
      <h2 className="font-heading text-sm uppercase tracking-wide text-muted-foreground">
        Skills
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
        {settings.skillGroups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1.5">
            <p className="text-sm font-medium text-foreground/90">{group.label}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {group.items.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
