import { Suspense } from "react";
import { Hero } from "@/components/hero";
import { Bio } from "@/components/bio";
import { ContributionGraph } from "@/components/contribution-graph";
import { Work } from "@/components/work";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { Footer } from "@/components/footer";

function ContributionGraphFallback() {
  return (
    <section className="flex flex-col gap-4 border-t border-border pt-10">
      <div className="flex items-baseline justify-between">
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-[130px] w-full animate-pulse rounded bg-muted" />
    </section>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-16 px-6 py-20 sm:py-28">
      <Hero />
      <Bio />
      <Suspense fallback={<ContributionGraphFallback />}>
        <ContributionGraph />
      </Suspense>
      <Work />
      <Projects />
      <Skills />
      <Footer />
    </main>
  );
}
