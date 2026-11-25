import { NotFoundContent } from "@/components/not-found-content";
import { getSiteSettings, hasPublishedPosts } from "@/sanity/queries";
import { SiteHeader } from "@/components/site-header";
import { GradualBlur } from "@/components/gradual-blur";

export default async function NotFound() {
  const [settings, showBlog] = await Promise.all([getSiteSettings(), hasPublishedPosts()]);

  return (
    <>
      <GradualBlur />
      <SiteHeader name={settings?.heroName} resumeUrl={settings?.resumeUrl} showBlog={showBlog} />
      <NotFoundContent />
    </>
  );
}
