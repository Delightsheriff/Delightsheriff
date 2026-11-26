import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getPostNavigation } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";
import { NavLink } from "@/components/nav-link";
import { PostBody } from "@/components/post-body";
import { formatLongDate } from "@/lib/format";
import { readingMinutes, wordCount } from "@/lib/reading-time";
import { LLMS_TYPES, SITE_NAME, buildPostGraph, jsonLd } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

// Every published post is built at deploy time. Any other slug is a plain 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(({ slug }) => ({ slug }));
}

const LABEL = "font-mono text-xs font-normal text-muted-foreground";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const url = `/blog/${slug}`;
  // A cover image makes the best share card. Without one, the site-wide card is used.
  const cover = post.coverImage ? [{ url: urlFor(post.coverImage.asset).width(1200).height(630).fit("crop").url(), width: 1200, height: 630, alt: post.coverImage.alt ?? post.title }] : undefined;

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: SITE_NAME }],
    alternates: { canonical: url, types: LLMS_TYPES },
    openGraph: {
      title: `${post.title} | ${SITE_NAME}`,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.updatedAt && { modifiedTime: post.updatedAt }),
      authors: [SITE_NAME],
      tags: post.tags,
      ...(cover && { images: cover }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | ${SITE_NAME}`,
      description: post.excerpt,
      ...(cover && { images: cover.map((image) => image.url) }),
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const { newer, older } = await getPostNavigation(slug);

  const minutes = readingMinutes(post.body);
  const graph = buildPostGraph(post, {
    words: wordCount(post.body),
    image: post.coverImage ? urlFor(post.coverImage.asset).width(1200).url() : undefined,
  });

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[960px] flex-1 px-6 py-24 sm:py-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />

      <div className="grid gap-5 md:grid-cols-[168px_minmax(0,1fr)] md:gap-x-12">
        <div className="flex flex-col gap-4 md:sticky md:top-20 md:self-start">
          <NavLink href="/blog" direction="back">
            All posts
          </NavLink>
          <div className={`${LABEL} leading-[1.8]`}>
            <p>
              <time dateTime={post.publishedAt}>{formatLongDate(post.publishedAt)}</time>
            </p>
            <p>{minutes} min read</p>
            {post.tags && post.tags.length > 0 && <p className="mt-2">{post.tags.join(", ")}</p>}
          </div>
        </div>

        <article className="flex min-w-0 flex-col gap-10">
          <header className="flex flex-col gap-5">
            <h1 className="max-w-[24ch] text-balance text-[clamp(2rem,4.6vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.035em]">
              {post.title}
            </h1>
            <p className="max-w-[56ch] text-[clamp(1.0625rem,1.6vw,1.25rem)] leading-[1.55] text-muted-foreground [text-wrap:pretty]">
              {post.excerpt}
            </p>
          </header>

          {post.coverImage && (
            <Image
              src={urlFor(post.coverImage.asset).width(1600).url()}
              alt={post.coverImage.alt ?? post.title}
              width={1600}
              height={840}
              priority
              sizes="(min-width: 768px) 744px, 100vw"
              className="h-auto w-full rounded-xl border border-border"
            />
          )}

          <PostBody value={post.body} />

          <nav aria-label="More posts" className="grid grid-cols-2 gap-4 border-t border-border pt-6">
            <div className="flex justify-start">
              {newer && (
                <NavLink href={`/blog/${newer.slug}`} direction="back" className="items-start">
                  <span className="flex max-w-40 flex-col items-start gap-1 sm:max-w-56">
                    <span>Newer</span>
                    <span className="text-foreground/80">{newer.title}</span>
                  </span>
                </NavLink>
              )}
            </div>
            <div className="flex justify-end">
              {older && (
                <NavLink href={`/blog/${older.slug}`} direction="forward" className="items-start">
                  <span className="flex max-w-40 flex-col items-end gap-1 text-right sm:max-w-56">
                    <span>Older</span>
                    <span className="text-foreground/80">{older.title}</span>
                  </span>
                </NavLink>
              )}
            </div>
          </nav>
        </article>
      </div>
    </main>
  );
}
