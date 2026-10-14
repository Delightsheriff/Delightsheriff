"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Pause, Play } from "lucide-react";
import type { SanityProjectDemo } from "@/sanity/queries";
import { cn } from "@/lib/utils";

// The tallest the recording is allowed to render, so portrait phone captures
// don't push the case study below the fold.
const MAX_HEIGHT_REM = 32;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

function posterSrc(url: string, width: number) {
  return `${url}?w=${width}&auto=format&q=80`;
}

type ProjectDemoProps = {
  demo: SanityProjectDemo;
  title: string;
};

export function ProjectDemo({ demo, title }: ProjectDemoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [inView, setInView] = useState(false);
  // "auto" follows visibility and the motion preference until the visitor
  // presses play or pause themselves.
  const [intent, setIntent] = useState<"auto" | "play" | "pause">("auto");
  const [playing, setPlaying] = useState(false);

  const shouldPlay = inView && (intent === "play" || (intent === "auto" && !reducedMotion));

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.25,
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlay) {
      // Rejected when the browser blocks autoplay (e.g. iOS Low Power Mode);
      // the poster and play button stay up in that case.
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [shouldPlay]);

  const ratio = demo.width / demo.height;
  const frame = demo.frame ?? "none";
  const label = demo.caption ?? `${title} demo recording`;

  const video = (
    <div
      className="relative overflow-hidden bg-muted bg-cover bg-center"
      style={{
        aspectRatio: `${demo.width} / ${demo.height}`,
        backgroundImage: demo.lqip ? `url(${demo.lqip})` : undefined,
      }}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster={posterSrc(demo.posterUrl, Math.min(demo.width, 1200))}
        width={demo.width}
        height={demo.height}
        muted
        loop
        playsInline
        preload="none"
        disableRemotePlayback
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={demo.url} type={demo.mimeType} />
      </video>

      {reducedMotion && !playing ? (
        <button
          type="button"
          onClick={() => setIntent("play")}
          className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors hover:bg-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-background/90 text-foreground shadow-lg">
            <Play aria-hidden className="size-6 translate-x-0.5" fill="currentColor" />
          </span>
          <span className="sr-only">Play {label}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIntent(playing ? "pause" : "play")}
          aria-label={playing ? `Pause ${label}` : `Play ${label}`}
          className="absolute right-3 bottom-3 flex size-9 items-center justify-center rounded-full bg-background/85 text-foreground shadow-md backdrop-blur transition-opacity hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {playing ? (
            <Pause aria-hidden className="size-4" fill="currentColor" />
          ) : (
            <Play aria-hidden className="size-4 translate-x-px" fill="currentColor" />
          )}
        </button>
      )}
    </div>
  );

  return (
    <figure className="flex flex-col items-center gap-3">
      <div
        data-frame={frame}
        className={cn(
          "w-full",
          frame === "none" && "overflow-hidden rounded-xl",
          frame === "phone" && "rounded-[2.75rem] bg-neutral-950 p-2.5 shadow-xl ring-1 ring-foreground/10 [&>div]:rounded-[2.1rem]",
          frame === "browser" && "overflow-hidden rounded-xl border border-border bg-muted shadow-lg",
        )}
        style={{ maxWidth: `calc(${MAX_HEIGHT_REM}rem * ${ratio.toFixed(4)})` }}
      >
        {frame === "browser" && (
          <div aria-hidden className="flex gap-1.5 border-b border-border px-3 py-2.5">
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="size-2.5 rounded-full bg-foreground/15" />
            <span className="size-2.5 rounded-full bg-foreground/15" />
          </div>
        )}
        {video}
      </div>
      {demo.caption && <figcaption className="text-xs text-muted-foreground">{demo.caption}</figcaption>}
    </figure>
  );
}
