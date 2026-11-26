"use client";

import { useEffect, useState } from "react";
import type { NowPlaying as Track } from "@/lib/spotify";
import { TrackedLink } from "@/components/tracked-link";

export function NowPlaying() {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/now-playing", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setTrack(data?.track ?? null))
      // The line is a nice extra, so a failed request just leaves it out.
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (!track) return null;

  return (
    <TrackedLink
      href={track.url}
      external
      eventName="spotify_click"
      data={{ location: "now-playing" }}
      className="group flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
    >
      <span className="tabular-nums">{track.isPlaying ? "Now playing" : "Last played"}:</span>
      <span className="text-foreground/80 group-hover:text-foreground">
        {track.title} — {track.artist}
      </span>
    </TrackedLink>
  );
}
