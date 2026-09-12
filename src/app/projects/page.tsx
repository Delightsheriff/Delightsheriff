import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects } from "@/sanity/queries";
import { ProjectRow } from "@/components/project-row";

const CATEGORY_LABELS: Record<string, string> = {
  web: "Web",
  mobile: "Mobile",
  api: "API",
};

export const metadata: Metadata = {
  title: "Projects",
  description: "Full-stack web and mobile projects — real production systems, not demos.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  const grouped = projects.reduce<Record<string, typeof projects>>((acc, project) => {
    (acc[project.category] ??= []).push(project);
    return acc;
  }, {});

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-16 px-6 py-20 sm:py-28">
      <div className="flex flex-col gap-4">
        <Link
          href="/"
          className="w-fit text-xs text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
        >
          ← Back
        </Link>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">All Projects</h1>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} className="flex flex-col border-t border-border pt-10">
          <h2 className="font-heading text-sm uppercase tracking-wide text-muted-foreground">
            {CATEGORY_LABELS[category] ?? category}
          </h2>
          <div className="mt-6 flex flex-col">
            {items.map((project, i) => (
              <ProjectRow
                key={project.slug}
                index={i + 1}
                name={project.name}
                description={project.description}
                tags={project.tags}
                href={`/projects/${project.slug}`}
              />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
