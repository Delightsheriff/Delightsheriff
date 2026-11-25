import type { SkillGroup } from "@/sanity/queries";

export function Skills({ groups }: { groups: SkillGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <dl className="mt-14 grid">
      {groups.map((group) => (
        <div key={group.label} className="grid gap-x-4 border-t border-border py-3 text-sm sm:grid-cols-[130px_minmax(0,1fr)]">
          <dt className="font-mono text-xs leading-[1.9] text-muted-foreground">{group.label}</dt>
          <dd className="leading-relaxed">{group.items.join(", ")}</dd>
        </div>
      ))}
    </dl>
  );
}
