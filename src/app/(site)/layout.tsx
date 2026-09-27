import { getSiteSettings } from "@/sanity/queries";
import { SiteHeader } from "@/components/site-header";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <SiteHeader name={settings?.heroName} email={settings?.email} resumeUrl={settings?.resumeUrl} />
      {children}
    </>
  );
}
