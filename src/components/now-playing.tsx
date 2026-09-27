import { getNowPlaying } from "@/lib/spotify";
import { TrackedLink } from "@/components/tracked-link";

export async function NowPlaying() {
  const track = await getNowPlaying();
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
