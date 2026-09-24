import type { Metadata } from "next";
import { getAllProjects } from "@/sanity/queries";
import { ProjectRow } from "@/components/project-row";
import { NavLink } from "@/components/nav-link";
import { groupByCategory } from "@/lib/group-by-category";
import { EmptyState } from "@/components/empty-state";

const CATEGORY_LABELS: Record<string, string> = {
  web: "Web",
  mobile: "Mobile",
  api: "API",
  macos: "macOS",
};

export const metadata: Metadata = {
  title: "Projects",
  description: "Full-stack web and mobile projects. Real production systems, not demos.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — Delight Amadi Sheriff",
    description: "Full-stack web and mobile projects. Real production systems, not demos.",
    url: "/projects",
    type: "website",
  },
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  const grouped = groupByCategory(projects);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: projects.map((project, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: project.name,
      url: `https://www.delightsheriff.com/projects/${project.slug}`,
    })),
  };

  return (
    <main className="page-shell mx-auto flex w-full max-w-2xl flex-1 flex-col gap-16 px-6 py-20 sm:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="flex flex-col gap-4">
        <NavLink href="/" direction="back">
          Back
        </NavLink>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">All Projects</h1>
      </div>

      {Object.entries(grouped).length > 0 ? Object.entries(grouped).map(([category, items]) => (
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
                  role={project.role}
                  impact={project.impact}
                  thumbnail={project.thumbnail}
                  tags={project.tags}
                href={`/projects/${project.slug}`}
              />
            ))}
          </div>
        </section>
      )) : <section className="border-t border-border pt-10"><EmptyState title="No projects published yet" description="Projects will appear here once they are ready to share." /></section>}
    </main>
  );
}
