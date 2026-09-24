import { getSiteSettings } from "@/sanity/queries";
import { SiteHeader } from "@/components/site-header";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteHeader name={settings?.heroName} email={settings?.email} resumeUrl={settings?.resumeUrl} />
      {children}
    </>
  );
}
