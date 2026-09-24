import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getPostBySlug } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { NavLink } from "@/components/nav-link";

type PageProps = { params: Promise<{ slug: string }> };

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const url = `/blog/${slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: `${post.title} — Delight Amadi Sheriff`,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} — Delight Amadi Sheriff`,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const postJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `https://www.delightsheriff.com/blog/${slug}`,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: "Delight Amadi Sheriff",
      url: "https://www.delightsheriff.com",
    },
  };

  return (
    <main className="page-shell mx-auto flex w-full max-w-2xl flex-1 flex-col gap-10 px-6 py-20 sm:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="flex flex-col gap-4">
        <NavLink href="/blog" direction="back">
          Blog
        </NavLink>

        <h1 className="font-heading text-3xl font-semibold tracking-tight">{post.title}</h1>
        <p className="text-sm text-muted-foreground">{formatDate(post.publishedAt)}</p>
      </div>

      {post.coverImage && (
        <Image
          src={urlFor(post.coverImage.asset).width(1200).url()}
          alt={post.coverImage.alt ?? post.title}
          width={1200}
          height={630}
          className="rounded-lg border border-border"
          priority
        />
      )}

      <div className="flex max-w-xl flex-col gap-4 text-base leading-relaxed text-foreground/80 [&_p]:leading-relaxed">
        <PortableText value={post.body} />
      </div>

      {post.tags && post.tags.length > 0 && (
        <p className="border-t border-border pt-6 text-sm text-muted-foreground">
          {post.tags.join(" · ")}
        </p>
      )}
    </main>
  );
}
