import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Work } from "@/components/work";
import { About } from "@/components/about";
import { Contact } from "@/components/contact";

export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto flex w-full max-w-[960px] flex-1 flex-col px-6">
      <Hero />
      <Projects />
      <Work />
      <About />
      <Contact />
    </main>
  );
}
