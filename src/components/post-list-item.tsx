import Image from "next/image";
import { urlFor } from "@/sanity/image";
import { TrackedLink } from "@/components/tracked-link";
import { formatLongDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type PostListItemProps = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  tags?: string[];
  coverImage?: { asset: Parameters<typeof urlFor>[0]; alt?: string };
};

// The title link stretches over the whole row with ::after, so the row opens the post.
export function PostListItem({ slug, title, excerpt, publishedAt, tags, coverImage }: PostListItemProps) {
  return (
    <li
      className={cn(
        "zoom-host nudge-host group relative grid gap-x-8 gap-y-4 border-t border-border py-8 first:border-t-0 first:pt-0",
        coverImage && "sm:grid-cols-[minmax(0,1fr)_200px]",
      )}
    >
      <div className="min-w-0">
        <p className="mb-2 font-mono text-xs text-muted-foreground">
          <time dateTime={publishedAt}>{formatLongDate(publishedAt)}</time>
        </p>
        <h2 className="flex items-baseline gap-2 text-[clamp(1.35rem,2.6vw,1.75rem)] font-medium leading-snug tracking-[-0.025em] [text-wrap:balance]">
          <TrackedLink
            href={`/blog/${slug}`}
            eventName="post_open"
            data={{ post: title }}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-ring focus-visible:after:ring-offset-4 focus-visible:after:ring-offset-background"
          >
            {title}
          </TrackedLink>
          <span aria-hidden className="nudge-target text-base font-normal text-muted-foreground transition-[transform,color] duration-200 ease-out-strong">
            ↗
          </span>
        </h2>
        <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground [text-wrap:pretty]">{excerpt}</p>
        {tags && tags.length > 0 && <p className="mt-3 font-mono text-xs text-muted-foreground">{tags.join(", ")}</p>}
      </div>

      {coverImage && (
        <div className="aspect-[16/10] self-start overflow-hidden rounded-lg border border-border bg-card">
          <Image
            src={urlFor(coverImage.asset).width(640).height(400).fit("crop").url()}
            alt={coverImage.alt ?? title}
            width={320}
            height={200}
            sizes="(min-width: 640px) 200px, 100vw"
            className="zoom-target h-full w-full object-cover transition-transform duration-500 ease-out-strong"
          />
        </div>
      )}
    </li>
  );
}
