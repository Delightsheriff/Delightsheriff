import { NotFoundContent } from "@/components/not-found-content";
import { getSiteSettings, hasPublishedPosts } from "@/sanity/queries";
import { SiteHeader } from "@/components/site-header";

export default async function NotFound() {
  const [settings, showBlog] = await Promise.all([getSiteSettings(), hasPublishedPosts()]);

  return (
    <>
      <SiteHeader name={settings?.heroName} email={settings?.email} resumeUrl={settings?.resumeUrl} showBlog={showBlog} />
      <NotFoundContent />
    </>
  );
}
