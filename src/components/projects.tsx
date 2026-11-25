import { getHomeProjects } from "@/sanity/queries";
import { Section } from "@/components/section";
import { ProjectTile } from "@/components/project-tile";
import { ProjectListItem } from "@/components/project-list-item";
import { EmptyState } from "@/components/empty-state";

export async function Projects() {
  const { featured, more } = await getHomeProjects();
  const total = featured.length + more.length;

  return (
    <Section id="projects" label="Projects" meta={total > 0 ? `${total} in total` : undefined}>
      {total === 0 ? (
        <EmptyState
          title="Projects are being refreshed"
          description="Selected work will be back shortly. In the meantime, get in touch to talk through recent builds."
        />
      ) : (
        <>
          {featured.length > 0 && (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2">
              {featured.map((project, i) => (
                <ProjectTile
                  key={project.slug}
                  name={project.name}
                  description={project.description}
                  role={project.role}
                  tags={project.tags}
                  thumbnail={project.thumbnail}
                  hasDemo={project.hasDemo}
                  href={`/projects/${project.slug}`}
                  liveUrl={project.links?.live}
                  priority={i < 2}
                />
              ))}
            </div>
          )}

          {more.length > 0 && (
            <div className="mt-16">
              <h3 className="mb-2 font-mono text-xs font-normal text-muted-foreground">More work</h3>
              <ul>
                {more.map((project) => (
                  <ProjectListItem
                    key={project.slug}
                    name={project.name}
                    category={project.category}
                    description={project.description}
                    impact={project.impact}
                    tags={project.tags}
                    links={project.links ?? {}}
                    thumbnail={project.thumbnail}
                  />
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </Section>
  );
}
