import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts } from "@/sanity/queries";
import { NavLink } from "@/components/nav-link";
import { PostListItem } from "@/components/post-list-item";
import { BLOG_DESCRIPTION, LLMS_TYPES, buildBlogGraph, jsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Blog",
  description: BLOG_DESCRIPTION,
  alternates: { canonical: "/blog", types: LLMS_TYPES },
  openGraph: {
    title: "Blog | Delight Amadi Sheriff",
    description: BLOG_DESCRIPTION,
    url: "/blog",
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  // Until the first post is published, the blog does not exist: no page, no nav link, no sitemap entry.
  if (posts.length === 0) notFound();

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto w-full max-w-[960px] flex-1 px-6 py-24 sm:py-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(buildBlogGraph(posts)) }} />

      <div className="grid gap-5 md:grid-cols-[168px_minmax(0,1fr)] md:gap-x-12">
        <div className="flex flex-col gap-4 md:sticky md:top-20 md:self-start">
          <NavLink href="/" direction="back">
            Home
          </NavLink>
        </div>

        <div className="min-w-0">
          <h1 className="text-[clamp(1.9rem,4vw,2.75rem)] font-medium leading-[1.1] tracking-[-0.03em]">Blog</h1>
          <p className="mt-4 max-w-[48ch] text-[clamp(1.0625rem,1.6vw,1.1875rem)] leading-[1.6] text-muted-foreground [text-wrap:pretty]">
            {BLOG_DESCRIPTION}
          </p>

          <ul className="mt-14">
            {posts.map((post) => (
              <PostListItem
                key={post.slug}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                publishedAt={post.publishedAt}
                tags={post.tags}
                coverImage={post.coverImage}
              />
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
