import { cn } from "@/lib/utils";

// A placeholder block with a slow light sweep (see .skeleton in globals.css).
// It holds the shape of the content so the page does not jump when the real thing arrives.
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("skeleton rounded-md", className)} />;
}
