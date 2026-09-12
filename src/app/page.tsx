import { Hero } from "@/components/hero";
import { Bio } from "@/components/bio";
import { ContributionGraph } from "@/components/contribution-graph";
import { Work } from "@/components/work";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-16 px-6 py-20 sm:py-28">
      <Hero />
      <Bio />
      <ContributionGraph />
      <Work />
      <Projects />
      <Skills />
      <Footer />
    </main>
  );
}
