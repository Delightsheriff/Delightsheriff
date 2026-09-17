import { getFeaturedProjects } from "@/sanity/queries";
import { ProjectRow } from "@/components/project-row";
import { NavLink } from "@/components/nav-link";

export async function Projects() {
  const projects = await getFeaturedProjects();

  return (
    <section id="projects" className="scroll-mt-8 flex flex-col border-t border-border pt-10">
      <div className="flex items-baseline justify-between">
        <h2 className="font-heading text-sm uppercase tracking-wide text-muted-foreground">
          Selected work
        </h2>
        <NavLink href="/projects" direction="forward">
          View all
        </NavLink>
      </div>

      <div className="mt-6 flex flex-col">
        {projects.map((project, i) => (
          <ProjectRow
            key={project.slug}
            index={i + 1}
            name={project.name}
            description={project.description}
            role={project.role}
            impact={project.impact}
            thumbnail={project.thumbnail}
            tags={project.tags}
            href={`/projects/${project.slug}`}
          />
        ))}
      </div>
    </section>
  );
}
