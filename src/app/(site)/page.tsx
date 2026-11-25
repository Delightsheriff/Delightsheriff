import { Hero } from "@/components/hero";
import { getHomeProjects } from "@/sanity/queries";
import { buildHomeGraph, jsonLd } from "@/lib/seo";
import { Projects } from "@/components/projects";
import { Work } from "@/components/work";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";

export default async function Home() {
  const { featured, more } = await getHomeProjects();
  const projects = [...featured, ...more];
  const modified = projects
    .map((project) => (project.updatedAt ? new Date(project.updatedAt) : undefined))
    .filter((date): date is Date => Boolean(date))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto flex w-full max-w-[960px] flex-1 flex-col px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(buildHomeGraph(projects, modified)) }} />
      <Hero />
      <Projects />
      <Work />
      <About />
      <Contact />
    </main>
  );
}
