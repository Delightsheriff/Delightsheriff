import Image from "next/image";
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor } from "@/sanity/image";

type PostImage = { asset: SanityImageSource; alt?: string; caption?: string };

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href) && !href.includes("delightsheriff.com");
}

// Reading typography for an article. Lists use dashes and a plain counter, never dots.
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="[text-wrap:pretty]">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-10 text-[1.625rem] font-semibold leading-tight tracking-[-0.03em] text-foreground [text-wrap:balance]">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-xl font-semibold leading-snug tracking-[-0.02em] text-foreground [text-wrap:balance]">{children}</h3>
    ),
    h4: ({ children }) => <h4 className="mt-6 text-base font-semibold text-foreground">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l border-foreground/40 pl-5 text-muted-foreground [text-wrap:pretty]">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="flex flex-col gap-2.5">{children}</ul>,
    number: ({ children }) => <ol className="flex flex-col gap-2.5 [counter-reset:item]">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-[18px] before:absolute before:left-0 before:top-[0.85em] before:w-2 before:border-t before:border-muted-foreground">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="relative pl-8 [counter-increment:item] before:absolute before:left-0 before:top-[0.5em] before:font-mono before:text-xs before:text-muted-foreground before:content-[counter(item)]">
        {children}
      </li>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = isExternal(href);
      return (
        <a
          href={href}
          className="link-u text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[0.875em] text-foreground">{children}</code>,
  },
  types: {
    image: ({ value }: { value: PostImage }) => (
      <figure className="my-4 flex flex-col gap-2.5">
        <Image
          src={urlFor(value).width(1400).url()}
          alt={value.alt ?? "Article image"}
          width={1400}
          height={900}
          sizes="(min-width: 768px) 744px, 100vw"
          className="h-auto w-full rounded-xl border border-border"
        />
        {value.caption && <figcaption className="text-sm text-muted-foreground">{value.caption}</figcaption>}
      </figure>
    ),
  },
};

export function PostBody({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="flex max-w-[64ch] flex-col gap-5 text-[1.0625rem] leading-[1.75] text-foreground/90 sm:text-[1.125rem]">
      <PortableText value={value} components={components} />
    </div>
  );
}
