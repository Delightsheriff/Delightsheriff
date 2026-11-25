import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getProjectBySlug, getProjectNavigation } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { NavLink } from "@/components/nav-link";
import { TrackedLink } from "@/components/tracked-link";
import { categoryLabel } from "@/lib/project-categories";
import { ProjectDemo } from "@/components/project-demo";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  const url = `/projects/${slug}`;

  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.name} — Delight Amadi Sheriff`,
      description: project.description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} — Delight Amadi Sheriff`,
      description: project.description,
    },
  };
}

const LABEL = "font-mono text-xs font-normal text-muted-foreground";

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  const navigation = await getProjectNavigation(slug);

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.name,
    description: project.description,
    url: `https://www.delightsheriff.com/projects/${slug}`,
    datePublished: String(project.year),
    programmingLanguage: project.tags,
    author: {
      "@type": "Person",
      name: "Delight Amadi Sheriff",
      url: "https://www.delightsheriff.com",
    },
    ...(project.links?.source && { codeRepository: project.links.source }),
  };

  const destinations = [
    { label: "Live", href: project.links?.live },
    { label: "Download", href: project.links?.download },
    { label: "App Store", href: project.links?.appStore },
    { label: "Play Store", href: project.links?.playStore },
    { label: "Source", href: project.links?.source },
  ].filter((link) => link.href);

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[960px] flex-1 px-6 py-24 sm:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="grid gap-5 md:grid-cols-[168px_minmax(0,1fr)] md:gap-x-12">
        <div className="flex flex-col gap-4 md:sticky md:top-20 md:self-start">
          <NavLink href="/#projects" direction="back">
            All projects
          </NavLink>
          <p className={LABEL}>
            {categoryLabel(project.category)} / {project.year}
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-12">
          <div className="flex flex-col gap-5">
            <h1 className="text-[clamp(1.9rem,4vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.03em]">{project.name}</h1>

            <p className="max-w-[58ch] text-[clamp(1.0625rem,1.6vw,1.1875rem)] leading-[1.6] text-muted-foreground [text-wrap:pretty]">
              {project.description}
            </p>

            {(project.role || project.impact) && (
              <dl className="grid grid-cols-1 gap-5 border-y border-border py-5 text-sm sm:grid-cols-2">
                {project.role && (
                  <div>
                    <dt className={LABEL}>Role</dt>
                    <dd className="mt-1.5 leading-relaxed">{project.role}</dd>
                  </div>
                )}
                {project.impact && (
                  <div>
                    <dt className={LABEL}>Impact</dt>
                    <dd className="mt-1.5 leading-relaxed">{project.impact}</dd>
                  </div>
                )}
              </dl>
            )}

            {destinations.length > 0 && (
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
                {destinations.map((link) => (
                  <TrackedLink
                    key={link.label}
                    href={link.href!}
                    external
                    eventName="project_destination_click"
                    data={{ project: project.name, destination: link.label }}
                    className="link-u rounded-sm text-muted-foreground first:text-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                  >
                    {link.label}
                    <span aria-hidden> ↗</span>
                  </TrackedLink>
                ))}
              </div>
            )}
          </div>

          {project.demo && <ProjectDemo demo={project.demo} title={project.name} />}

          {(project.challenge || project.contribution || project.outcome) && (
            <div className="flex max-w-[58ch] flex-col gap-8">
              {[
                ["Challenge", project.challenge],
                ["Contribution", project.contribution],
                ["Outcome", project.outcome],
              ].map(([label, text]) =>
                text ? (
                  <section key={label} className="flex flex-col gap-2">
                    <h2 className={LABEL}>{label}</h2>
                    <p className="text-base leading-relaxed [text-wrap:pretty]">{text}</p>
                  </section>
                ) : null,
              )}
            </div>
          )}

          {project.body && project.body.length > 0 && (
            <div className="flex max-w-[58ch] flex-col gap-4 text-base leading-relaxed [text-wrap:pretty]">
              <h2 className={LABEL}>Details</h2>
              <PortableText value={project.body} />
            </div>
          )}

          {project.highlights && project.highlights.length > 0 && (
            <ul className="flex max-w-[58ch] flex-col gap-3 text-base leading-relaxed">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="relative pl-[18px] before:absolute before:left-0 before:top-[0.8em] before:w-2 before:border-t before:border-muted-foreground">
                  {highlight}
                </li>
              ))}
            </ul>
          )}

          {project.screenshots && project.screenshots.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.screenshots.map((shot) => {
                const width = 800;
                const height = shot.dimensions
                  ? Math.round((width * shot.dimensions.height) / shot.dimensions.width)
                  : width;
                return (
                  <figure key={shot._key} className="flex flex-col gap-2">
                    <Image
                      src={urlFor(shot.asset).width(width).url()}
                      alt={shot.caption ?? project.name}
                      width={width}
                      height={height}
                      placeholder={shot.lqip ? "blur" : "empty"}
                      blurDataURL={shot.lqip}
                      className="h-auto w-full rounded-xl border border-border"
                    />
                    {shot.caption && <figcaption className="text-xs text-muted-foreground">{shot.caption}</figcaption>}
                  </figure>
                );
              })}
            </div>
          )}

          {project.tags && project.tags.length > 0 && (
            <section className="border-t border-border pt-6">
              <h2 className={LABEL}>Stack</h2>
              <p className="mt-2 text-sm leading-relaxed">{project.tags.join(", ")}</p>
            </section>
          )}

          <nav aria-label="Project navigation" className="grid grid-cols-2 gap-4 border-t border-border pt-6">
            <div className="flex justify-start">
              {navigation.previous && (
                <NavLink href={`/projects/${navigation.previous.slug}`} direction="back" className="items-start">
                  <span className="flex max-w-40 flex-col items-start gap-1 sm:max-w-56">
                    <span>Previous</span>
                    <span className="text-foreground/80">{navigation.previous.name}</span>
                  </span>
                </NavLink>
              )}
            </div>
            <div className="flex justify-end">
              {navigation.next && (
                <NavLink href={`/projects/${navigation.next.slug}`} direction="forward" className="items-start">
                  <span className="flex max-w-40 flex-col items-end gap-1 text-right sm:max-w-56">
                    <span>Next</span>
                    <span className="text-foreground/80">{navigation.next.name}</span>
                  </span>
                </NavLink>
              )}
            </div>
          </nav>
        </div>
      </div>
    </main>
  );
}
