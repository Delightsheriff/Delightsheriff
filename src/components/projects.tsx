import Link from "next/link";
import { getFeaturedProjects } from "@/sanity/queries";
import { ProjectRow } from "@/components/project-row";

export async function Projects() {
  const projects = await getFeaturedProjects();

  return (
    <section className="flex flex-col border-t border-border pt-10">
      <div className="flex items-baseline justify-between">
        <h2 className="font-heading text-sm uppercase tracking-wide text-muted-foreground">
          Projects
        </h2>
        <Link
          href="/projects"
          className="text-xs text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
        >
          View all →
        </Link>
      </div>

      <div className="mt-6 flex flex-col">
        {projects.map((project, i) => (
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
  );
}
