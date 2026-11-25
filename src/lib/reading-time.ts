import type { PortableTextBlock } from "@portabletext/react";

// Plain text of the written parts of a post (images and other blocks add no words).
export function plainText(blocks: PortableTextBlock[]): string {
  return blocks
    .filter((block) => block._type === "block")
    .map((block) =>
      ((block.children as { text?: string }[] | undefined) ?? []).map((child) => child.text ?? "").join(""),
    )
    .join("\n");
}

export function wordCount(blocks: PortableTextBlock[]): number {
  const text = plainText(blocks).trim();
  return text ? text.split(/\s+/).length : 0;
}

// Round up, and never promise less than a minute.
export function readingMinutes(blocks: PortableTextBlock[], wordsPerMinute = 200): number {
  return Math.max(1, Math.ceil(wordCount(blocks) / wordsPerMinute));
}
