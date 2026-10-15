import { getSiteSettings, hasPublishedPosts } from "@/sanity/queries";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, showBlog] = await Promise.all([getSiteSettings(), hasPublishedPosts()]);

  return (
    <>
      <SkipLink />
      <SiteHeader name={settings?.heroName} email={settings?.email} resumeUrl={settings?.resumeUrl} showBlog={showBlog} />
      {children}
    </>
  );
}
