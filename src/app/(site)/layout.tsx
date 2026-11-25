import { getSiteSettings, hasPublishedPosts } from "@/sanity/queries";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import { GradualBlur } from "@/components/gradual-blur";
import { EasterEgg } from "@/components/easter-egg";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, showBlog] = await Promise.all([getSiteSettings(), hasPublishedPosts()]);

  return (
    <>
      <SkipLink />
      <GradualBlur />
      <SiteHeader name={settings?.heroName} resumeUrl={settings?.resumeUrl} showBlog={showBlog} />
      {children}
      <EasterEgg />
    </>
  );
}
