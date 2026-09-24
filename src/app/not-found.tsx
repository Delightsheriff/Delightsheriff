import { NotFoundContent } from "@/components/not-found-content";
import { getSiteSettings } from "@/sanity/queries";
import { SiteHeader } from "@/components/site-header";

export default async function NotFound() {
  const settings = await getSiteSettings();

  return (
    <>
      <SiteHeader name={settings?.heroName} email={settings?.email} resumeUrl={settings?.resumeUrl} />
      <NotFoundContent />
    </>
  );
}
