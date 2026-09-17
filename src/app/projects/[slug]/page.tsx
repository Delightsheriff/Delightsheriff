import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getProjectBySlug, getProjectNavigation } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { NavLink } from "@/components/nav-link";

const CATEGORY_LABELS: Record<string, string> = {
  web: "Web",
  mobile: "Mobile",
  api: "API",
};

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

  return (
    <main className="page-shell mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-20 sm:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="flex flex-col gap-4">
        <NavLink href="/projects" direction="back">
          All projects
        </NavLink>

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">{project.name}</h1>
          <p className="text-sm text-muted-foreground">
            {CATEGORY_LABELS[project.category] ?? project.category} · {project.year}
          </p>
        </div>

        <p className="max-w-xl text-base leading-relaxed text-foreground/80">
          {project.description}
        </p>

        {(project.role || project.impact) && (
          <dl className="grid grid-cols-1 gap-4 border-y border-border py-4 text-sm sm:grid-cols-2">
            {project.role && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Role</dt>
                <dd className="mt-1 text-foreground/85">{project.role}</dd>
              </div>
            )}
            {project.impact && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">Impact</dt>
                <dd className="mt-1 text-foreground/85">{project.impact}</dd>
              </div>
            )}
          </dl>
        )}

        <div className="flex flex-wrap gap-5 text-sm">
          {[
            { label: "Live", href: project.links?.live },
            { label: "App Store", href: project.links?.appStore },
            { label: "Play Store", href: project.links?.playStore },
            { label: "Source", href: project.links?.source },
          ]
            .filter((link) => link.href)
            .map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
              >
                {link.label}
              </a>
            ))}
        </div>
      </div>

      {(project.challenge || project.contribution || project.outcome) && (
        <div className="flex max-w-xl flex-col gap-8 border-y border-border py-8">
          {[
            ["Challenge", project.challenge],
            ["Contribution", project.contribution],
            ["Outcome", project.outcome],
          ].map(([label, text]) =>
            text ? (
              <section key={label} className="flex flex-col gap-2">
                <h2 className="font-heading text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</h2>
                <p className="text-base leading-relaxed text-foreground/80">{text}</p>
              </section>
            ) : null,
          )}
        </div>
      )}

      {project.body && project.body.length > 0 && (
        <div className="flex max-w-xl flex-col gap-4 text-base leading-relaxed text-foreground/80 [&_p]:leading-relaxed">
          <h2 className="font-heading text-xs uppercase tracking-[0.16em] text-muted-foreground">Details</h2>
          <PortableText value={project.body} />
        </div>
      )}

      {project.highlights && project.highlights.length > 0 && (
        <ul className="flex max-w-xl flex-col gap-3 text-base leading-relaxed text-foreground/80">
          {project.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}

      {project.screenshots && project.screenshots.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {project.screenshots.map((shot) => (
            <figure key={shot._key} className="flex flex-col gap-2">
              <Image
                src={urlFor(shot.asset).width(800).url()}
                alt={shot.caption ?? project.name}
                width={800}
                height={800}
                className="rounded-lg border border-border"
              />
              {shot.caption && (
                <figcaption className="text-xs text-muted-foreground">{shot.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      )}

      {project.tags && project.tags.length > 0 && (
        <section className="border-t border-border pt-6">
          <h2 className="font-heading text-xs uppercase tracking-[0.16em] text-muted-foreground">Stack</h2>
          <p className="mt-3 text-sm text-muted-foreground">{project.tags.join(" · ")}</p>
        </section>
      )}

      <nav aria-label="Project navigation" className="grid grid-cols-2 gap-4 border-t border-border pt-6">
        {navigation.previous ? (
          <NavLink href={`/projects/${navigation.previous.slug}`} direction="back">
            <span className="flex flex-col items-start gap-1">
              <span>Previous</span>
              <span className="text-foreground/80">{navigation.previous.name}</span>
            </span>
          </NavLink>
        ) : <span />}
        {navigation.next ? (
          <NavLink href={`/projects/${navigation.next.slug}`} direction="forward">
            <span className="flex flex-col items-end gap-1 text-right">
              <span>Next</span>
              <span className="text-foreground/80">{navigation.next.name}</span>
            </span>
          </NavLink>
        ) : <span />}
      </nav>
    </main>
  );
}
