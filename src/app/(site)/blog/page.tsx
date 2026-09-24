import type { Metadata } from "next";
import { getAllPosts } from "@/sanity/queries";
import { NavLink } from "@/components/nav-link";
import { TrackedLink } from "@/components/tracked-link";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on building software, mostly the parts that don't make it into a README.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Delight Amadi Sheriff",
    description: "Notes on building software, mostly the parts that don't make it into a README.",
    url: "/blog",
    type: "website",
  },
};

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="page-shell mx-auto flex w-full max-w-2xl flex-1 flex-col gap-16 px-6 py-20 sm:py-28">
      <div className="flex flex-col gap-4">
        <NavLink href="/" direction="back">
          Back
        </NavLink>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Blog</h1>
      </div>

      {posts.length > 0 ? (
        <div className="flex flex-col">
          {posts.map((post) => (
            <TrackedLink
              key={post.slug}
              href={`/blog/${post.slug}`}
              eventName="post_open"
              data={{ post: post.title }}
              className="group flex items-start justify-between gap-4 border-t border-border py-6 first:border-t-0 first:pt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              <span className="flex flex-1 flex-col gap-1.5">
                <span className="font-heading text-lg font-medium text-foreground/90 transition-colors group-hover:text-foreground">
                  {post.title}
                </span>
                <span className="max-w-md text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {formatDate(post.publishedAt)}
                </span>
              </span>
              <span
                aria-hidden
                className="project-arrow mt-1 shrink-0 text-muted-foreground transition-[color,opacity,transform] duration-150 ease-out group-hover:text-foreground group-hover:opacity-100"
              >
                →
              </span>
            </TrackedLink>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nothing published yet"
          description="I'm still writing the first post. Check back soon, or follow along on GitHub in the meantime."
        />
      )}
    </main>
  );
}
