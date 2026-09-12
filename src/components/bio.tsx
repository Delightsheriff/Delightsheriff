import { getSiteSettings } from "@/sanity/queries";

export async function Bio() {
  const settings = await getSiteSettings();
  if (!settings) return null;

  return (
    <section className="flex flex-col gap-4 border-t border-border pt-10">
      {settings.bio.map((paragraph, i) => (
        <p key={i} className="max-w-xl text-base leading-relaxed text-foreground/80">
          {paragraph}
        </p>
      ))}
    </section>
  );
}
