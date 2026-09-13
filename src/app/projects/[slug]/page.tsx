import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getProjectBySlug } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.description,
    openGraph: { title: project.name, description: project.description },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-20 sm:py-28">
      <div className="flex flex-col gap-4">
        <Link
          href="/projects"
          className="w-fit text-xs text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
        >
          ← All projects
        </Link>

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h1 className="font-heading text-3xl font-semibold tracking-tight">{project.name}</h1>
          <p className="text-sm text-muted-foreground">
            {project.category} · {project.year}
          </p>
        </div>

        <p className="max-w-xl text-base leading-relaxed text-foreground/80">
          {project.description}
        </p>

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

      {project.body && project.body.length > 0 && (
        <div className="flex max-w-xl flex-col gap-4 text-base leading-relaxed text-foreground/80 [&_p]:leading-relaxed">
          <PortableText value={project.body} />
        </div>
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
        <p className="border-t border-border pt-6 text-sm text-muted-foreground">
          {project.tags.join(" · ")}
        </p>
      )}
    </main>
  );
}
