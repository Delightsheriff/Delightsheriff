import { getSiteSettings } from "@/sanity/queries";
import { toRoman } from "@/lib/roman";

export async function Footer() {
  const settings = await getSiteSettings();
  if (!settings) return null;

  const year = toRoman(new Date().getFullYear());

  return (
    <footer className="flex flex-col gap-6 border-t border-border pt-10 pb-4">
      <p className="max-w-xl text-base leading-relaxed text-foreground/80">{settings.footerLine}</p>

      <p className="text-xs text-muted-foreground">© {year} · {settings.heroName}</p>
    </footer>
  );
}
